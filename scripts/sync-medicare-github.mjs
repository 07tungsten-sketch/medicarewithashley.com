import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REMOTE = "github";
const REMOTE_BRANCH = "main";
const MIRROR_BRANCH = "github-main";
const APPROVED_PATHS = [
  ".gitignore",
  ".githooks/pre-commit",
  ".github/workflows/medicare-site-hygiene.yml",
  "README.md",
  "artifacts/medicare-site",
  "lib/api-client-react",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  ".npmrc",
  "tsconfig.base.json",
  "tsconfig.json",
  "scripts",
];
const APPROVED_FILES = new Set([
  ".gitignore",
  ".githooks/pre-commit",
  ".github/workflows/medicare-site-hygiene.yml",
  "README.md",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  ".npmrc",
  "tsconfig.base.json",
  "tsconfig.json",
]);
const APPROVED_PREFIXES = [
  "artifacts/medicare-site/",
  "lib/api-client-react/",
  "scripts/",
];

function git(args, options = {}) {
  const output = execFileSync("git", args, {
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    ...options,
  });
  return typeof output === "string" ? output.trim() : "";
}

const tempDirectory = mkdtempSync(join(tmpdir(), "medicare-github-sync-"));
const indexPath = join(tempDirectory, "index");
const archivePath = join(tempDirectory, "source.tar");
const exportDirectory = join(tempDirectory, "source");

try {
  git(["fetch", "--no-tags", REMOTE, REMOTE_BRANCH]);

  const remoteRef = `${REMOTE}/${REMOTE_BRANCH}`;
  const gitDirectory = git(["rev-parse", "--absolute-git-dir"], {
    capture: true,
  });
  mkdirSync(exportDirectory);
  git([
    "archive",
    "--format=tar",
    `--output=${archivePath}`,
    "HEAD",
    "--",
    ...APPROVED_PATHS,
  ]);
  execFileSync("tar", ["-xf", archivePath, "-C", exportDirectory], {
    stdio: "inherit",
  });

  const environment = {
    ...process.env,
    GIT_DIR: gitDirectory,
    GIT_INDEX_FILE: indexPath,
    GIT_WORK_TREE: exportDirectory,
  };
  const temporaryGitOptions = { cwd: exportDirectory, env: environment };

  git(["read-tree", "--empty"], temporaryGitOptions);
  git(["add", "-A", "--", "."], temporaryGitOptions);
  const tree = git(["write-tree"], {
    ...temporaryGitOptions,
    capture: true,
  });

  const trackedPaths = git(["ls-tree", "-r", "--name-only", tree], {
    capture: true,
  })
    .split("\n")
    .filter(Boolean);
  const unapprovedPaths = trackedPaths.filter(
    (path) =>
      !APPROVED_FILES.has(path) &&
      !APPROVED_PREFIXES.some((prefix) => path.startsWith(prefix)),
  );
  if (unapprovedPaths.length > 0) {
    throw new Error(
      `Refusing to sync unapproved paths: ${unapprovedPaths.join(", ")}`,
    );
  }
  const missingFiles = [...APPROVED_FILES].filter(
    (path) => !trackedPaths.includes(path),
  );
  const missingPrefixes = APPROVED_PREFIXES.filter(
    (prefix) => !trackedPaths.some((path) => path.startsWith(prefix)),
  );
  if (missingFiles.length > 0 || missingPrefixes.length > 0) {
    throw new Error(
      `Refusing to sync an incomplete tree. Missing: ${[
        ...missingFiles,
        ...missingPrefixes,
      ].join(", ")}`,
    );
  }

  const remoteTree = git(["rev-parse", `${remoteRef}^{tree}`], {
    capture: true,
  });
  if (tree === remoteTree) {
    git(["update-ref", `refs/heads/${MIRROR_BRANCH}`, remoteRef]);
    console.log("GitHub already has the current committed Medicare source.");
    process.exit(0);
  }

  const authorName = git(["show", "-s", "--format=%an", remoteRef], {
    capture: true,
  });
  const authorEmail = git(["show", "-s", "--format=%ae", remoteRef], {
    capture: true,
  });
  const commitEnvironment = {
    ...process.env,
    GIT_AUTHOR_NAME: authorName,
    GIT_AUTHOR_EMAIL: authorEmail,
    GIT_COMMITTER_NAME: authorName,
    GIT_COMMITTER_EMAIL: authorEmail,
  };
  const commit = execFileSync(
    "git",
    ["commit-tree", tree, "-p", remoteRef],
    {
      encoding: "utf8",
      env: commitEnvironment,
      input: "Synchronize Medicare application source\n",
    },
  ).trim();

  git(["update-ref", `refs/heads/${MIRROR_BRANCH}`, commit]);
  git([
    "push",
    REMOTE,
    `${MIRROR_BRANCH}:refs/heads/${REMOTE_BRANCH}`,
  ]);
  git(["fetch", "--no-tags", REMOTE, REMOTE_BRANCH]);

  const advertisedHead = git(
    ["ls-remote", REMOTE, `refs/heads/${REMOTE_BRANCH}`],
    { capture: true },
  ).split(/\s+/)[0];
  if (advertisedHead !== commit) {
    throw new Error("GitHub did not advertise the synchronized commit.");
  }

  console.log(`Synchronized Medicare source at ${commit.slice(0, 12)}.`);
} finally {
  rmSync(tempDirectory, { recursive: true, force: true });
}
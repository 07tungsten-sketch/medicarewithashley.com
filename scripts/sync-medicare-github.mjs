import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REMOTE = "github";
const REMOTE_BRANCH = "main";
const MIRROR_BRANCH = "github-main";
const APPROVED_PATHS = [
  ".gitignore",
  ".githooks/pre-commit",
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
const EXCLUDED_PATH_PATTERN =
  /(^|\/)(attached_assets|\.agents|\.local|seo_strategy\.md|threat_model\.md|replit\.md|\.replit|replit\.nix|artifacts\/(api-server|mockup-sandbox|watson-insurance-sd))(\/|$|\.)/;

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

try {
  git(["fetch", "--no-tags", REMOTE, REMOTE_BRANCH]);

  const remoteRef = `${REMOTE}/${REMOTE_BRANCH}`;
  const environment = { ...process.env, GIT_INDEX_FILE: indexPath };

  git(["read-tree", remoteRef], { env: environment });
  git(["add", "-A", "--", ...APPROVED_PATHS], { env: environment });

  const tree = git(["write-tree"], { capture: true, env: environment });
  const remoteTree = git(["rev-parse", `${remoteRef}^{tree}`], { capture: true });

  if (tree === remoteTree) {
    git(["update-ref", `refs/heads/${MIRROR_BRANCH}`, remoteRef]);
    console.log("GitHub already has the current Medicare source.");
    process.exit(0);
  }

  const trackedPaths = git(["ls-tree", "-r", "--name-only", tree], {
    capture: true,
  });
  if (trackedPaths.split("\n").some((path) => EXCLUDED_PATH_PATTERN.test(path))) {
    throw new Error("Refusing to sync because an excluded workspace path is present.");
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
# SEO Verification Report

Verified on **August 30, 2026**. This report separates the fresh local release
candidate from the version currently deployed at
`https://medicarewithashley.com`.

## Status summary

| Check | Fresh release candidate | Current production |
| --- | --- | --- |
| Part B calculator FAQPage | Pass: 5 source-backed questions, 1 JSON-LD block | Live: detected by Schema.org Validator |
| Part B calculator application | Pass: co-typed `SoftwareApplication` + `WebApplication` | Not live yet |
| Part D calculator FAQPage | Pass: 5 source-backed questions, 1 JSON-LD block | Live: detected by Schema.org Validator |
| Part D calculator application | Pass: co-typed `SoftwareApplication` + `WebApplication` | Not live yet |
| Canonicals and redirects | Build/server checks pass | All 76 live self-canonicals pass; named redirect variants pass |
| Sitemap policy | Build check passes | Pass: 76 unique canonical URLs |

The application schema changes need a new publish before they can appear in
production or be tested there by external crawlers.

## Calculator structured data

Both calculator release-candidate pages contain:

- one `FAQPage` block generated from the same exported FAQ array rendered in
  the visible page;
- one co-typed `SoftwareApplication` + `WebApplication` block;
- the exact slashless page URL in the canonical link, FAQ schema, FAQ answer
  URLs, and application schema;
- `UtilitiesApplication`, `Web browser`, `Requires JavaScript`, and a free
  `Offer` priced at `0 USD`.

The application descriptions identify the applicable 2026 Part B standard
premium or Part D national base beneficiary premium. No rating or review was
invented.

Automated release checks now reject:

- malformed or duplicate calculator FAQ/application JSON-LD;
- schema URLs that differ from the page canonical;
- missing, duplicate, or non-visible FAQ questions and answers;
- inaccurate application name, premium context, category, operating system,
  free-access flag, or offer;
- missing prerendered pages, non-self canonicals, malformed JSON-LD anywhere
  in the 76-route prerender set, or non-canonical sitemap routes.

## External validator results for the deployed pages

The tested URLs included unique cache-busting queries:

- `/part-b-penalty-calculator?seo_check=220-rrt-b-20260830`
- `/part-d-penalty-calculator?seo_check=220-rrt-d-20260830`

### Schema.org Markup Validator

| Deployed page | Detected top-level items | Errors | Warnings |
| --- | --- | ---: | ---: |
| Part B calculator | `LocalBusiness` / `InsuranceAgency`, `Person`, `FAQPage` | 0 | 0 |
| Part D calculator | `LocalBusiness` / `InsuranceAgency`, `Person`, `FAQPage` | 0 | 0 |

The validator fetched and rendered both URLs successfully. It did not detect
application schema because production has not yet received this release.

### Google Rich Results Test

Both live-URL tests were started on August 30, 2026. Google displayed “Testing
live URL,” then blocked the automated browser with **“Something went wrong —
Log in and try again”** and a reCAPTCHA-protected iframe. No result report was
produced, so Google-detected types, errors, and warnings are **not available**;
this report does not claim that the pages passed the Rich Results Test.

Google feature eligibility is also distinct from Schema.org validity:

- Google says FAQ rich results are shown only for well-known, authoritative
  government and health websites. Valid FAQPage markup does not guarantee that
  this brokerage site will receive an FAQ rich result.
- Google documents `name`, `offers.price`, and either `aggregateRating` or
  `review` for Software App rich-result eligibility. The calculator schemas
  intentionally omit a rating/review because the pages do not present one.
  The application markup remains valid descriptive Schema.org data, but no
  Software App rich-result eligibility is claimed.

References:

- [Google structured data testing guidance](https://developers.google.com/search/docs/appearance/structured-data)
- [Google SoftwareApplication guidance](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Google FAQ rich-result availability](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Schema.org Validator](https://validator.schema.org/)

## Fresh prerendered schema inventory

The release-candidate audit parsed **183 JSON-LD blocks across 76 canonical
routes**.

| Coverage | Types and routes |
| --- | --- |
| Sitewide business identity | `LocalBusiness` + `InsuranceAgency` and `Person` on all 76 routes |
| Homepage | business/person plus `FAQPage` |
| Content | `Article` on the Family Pharmacy Center and GLP-1 Bridge articles |
| FAQ | `FAQPage` on 27 routes: homepage; 6 general Medicare pages; 2 calculators; 10 provider pages; the San Marcos city page; and 7 blog posts |
| Provider pages | business/person on every provider route; provider-specific `FAQPage` on 10 routes |
| Calculators | Part B and Part D: `SoftwareApplication` + `WebApplication`, `Offer`, and `FAQPage`; IRMAA: `FAQPage` |

Nested supporting types include `Organization`, `AdministrativeArea`, `City`,
`PostalAddress`, `Question`, `Answer`, `Offer`, and
`EducationalOccupationalCredential`.

## Cache-busted production canonical verification

The repeatable command is:

```sh
pnpm --filter @workspace/medicare-site run verify:production-seo
```

The August 30 run used cache token `seo-220-20260830-all-pages`. It fetched all
76 live sitemap URLs for self-canonical checks and exercised redirect variants
for:

- homepage;
- `/turning-65`;
- `/medicare-advantage`;
- `/sharp-healthcare-medicare-san-diego`;
- `/kaiser-permanente-medicare-san-diego`;
- `/medicare-medi-cal-dual-eligible-san-diego`;
- `/about`;
- `/blog/can-i-change-my-medicare-plan-after-enrollment`;
- both penalty calculators.

Results:

- all 76 live sitemap URLs returned `200` and an exact self-matching canonical;
- every tested HTTPS `www`, trailing-slash, and combined variant returned one
  `301` directly to the slashless apex URL;
- all query strings were preserved;
- following that single redirect returned `200`, proving there was no second
  application redirect;
- all 76 sitemap URLs were fetched with the unique query and returned response
  `Date` values from `16:34:38–16:34:46 UTC` plus body-fingerprint evidence;
- HTML responses used `private, max-age=0, must-revalidate`;
- the live sitemap returned `200` with 76 URLs, 76 unique URLs, no non-apex
  hosts, no inner trailing slashes, and no duplicates.

These checks establish the current cache-busted production representation and
revalidation policy. They do not identify a release by build ID; the report
therefore makes no claim that unrelated unpublished changes are live.
Production currently has the canonical/redirect/sitemap fix live. Only the new
calculator application schema in this checklist is awaiting publish.
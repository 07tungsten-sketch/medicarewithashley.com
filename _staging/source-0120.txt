/**
 * The set of home FAQ question strings that have a matching entry in the
 * `answerJsxMap` object in Home.tsx (i.e. answers whose rendered body
 * includes a clickable <Link> to a provider page).
 *
 * This is exported as a plain TypeScript constant — no JSX — so that
 * homeFaqItems.test.ts can import it without requiring a JSX transform.
 *
 * KEEP THIS IN SYNC WITH answerJsxMap IN Home.tsx.
 * The homeFaqItems.test.ts CI guard will fail if a provider FAQ item in
 * homeFaqItems.ts (whose `a` contains "Learn more on the") is missing from
 * this list — catching the case where a developer adds a new provider entry
 * to the data file but forgets to add the JSX link in Home.tsx.
 */
export const ANSWER_JSX_QUESTION_KEYS = [
  "Does Sharp HealthCare accept Medicare Advantage?",
  "Does Scripps Health accept Medicare Advantage?",
  "Does UC San Diego Health accept Medicare Advantage?",
  "Does Kaiser Permanente work with Medicare Advantage?",
  "Does Palomar Health accept Medicare Advantage?",
  "Does Tri-City Medical Center accept Medicare Advantage?",
  "Does Paradise Valley Hospital accept Medicare Advantage?",
] as const;

export type AnswerJsxQuestionKey = (typeof ANSWER_JSX_QUESTION_KEYS)[number];

/**
 * The `href` value of the <Link> inside each answerJsxMap entry in Home.tsx.
 *
 * Exported as a plain data structure — no JSX — so that
 * home-faq-provider-links.test.ts can import it without a JSX transform.
 *
 * KEEP THIS IN SYNC WITH the <Link href="..."> values in answerJsxMap IN
 * Home.tsx.  The home-faq-provider-links.test.ts CI guard will fail if a href
 * here does not match any registered provider-page slug in providerPages.ts.
 */
export const ANSWER_JSX_HREFS: Record<AnswerJsxQuestionKey, string> = {
  "Does Sharp HealthCare accept Medicare Advantage?":
    "/sharp-healthcare-medicare-san-diego/",
  "Does Scripps Health accept Medicare Advantage?":
    "/scripps-health-medicare-san-diego/",
  "Does UC San Diego Health accept Medicare Advantage?":
    "/uc-san-diego-health-medicare/",
  "Does Kaiser Permanente work with Medicare Advantage?":
    "/kaiser-permanente-medicare-san-diego/",
  "Does Palomar Health accept Medicare Advantage?":
    "/palomar-health-medicare-san-diego/",
  "Does Tri-City Medical Center accept Medicare Advantage?":
    "/tri-city-medical-center-medicare/",
  "Does Paradise Valley Hospital accept Medicare Advantage?":
    "/paradise-valley-hospital-medicare/",
};

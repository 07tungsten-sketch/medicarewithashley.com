/**
 * Home page FAQ data (schema-safe, no JSX).
 *
 * Consumed by two places:
 *  1. Home.tsx — imports this and merges in the `answerJsx` React nodes.
 *  2. homeFaqItems.test.ts — imports this directly to guard the schema
 *     without requiring a JSX transform.
 *
 * ADDING A PROVIDER FAQ ENTRY?
 * If the answer text contains "Learn more on the" (i.e. it links to a
 * provider page), you MUST also supply a `schemaText` field whose value
 * contains the full canonical URL in the form:
 *   medicare-with-ashley.com/<provider-slug>/
 * The homeFaqItems.test.ts CI guard will fail if you forget.
 *
 * SYNC WITH PROVIDER PAGES
 * Named exports below (e.g. SHARP_HOME_FAQ_ANSWER_BASE) hold the base answer
 * text that is also expected to appear verbatim in the corresponding provider
 * page body HTML (providerBodyHtml.ts). The provider-home-faq-sync.test.ts test
 * verifies this. If you update factual claims here, update both the provider
 * body HTML and this constant — and vice versa.
 */

/**
 * Base answer text for the Sharp HealthCare Medicare Advantage home FAQ entry.
 *
 * This sentence is the single source of truth for the factual claim that
 * Sharp participates in many (but not all) Medicare Advantage plans. It is
 * used to build both the `a` and `schemaText` fields of the Sharp entry below,
 * AND it is expected to appear verbatim in the Sharp provider page body HTML
 * (providerBodyHtml.ts, `sharpHealthcareSanDiegoBodyHtml`).
 *
 * The provider-home-faq-sync.test.ts CI guard verifies this match. If you change
 * the factual claim here, also update the corresponding sentence in
 * providerBodyHtml.ts — and vice versa.
 *
 * When the Sharp provider page faqSchema is added (see open work item for
 * Sharp provider page FAQ schema), import this constant there too so the
 * structured-data answer uses the same wording.
 */
export const SHARP_HOME_FAQ_ANSWER_BASE =
  "Yes — Sharp HealthCare participates in many Medicare Advantage plans available to San Diego beneficiaries, but not every plan. " +
  "Sharp's hospitals and medical groups are in-network for several major carriers, while other plans may require you to use a different health system or pay out-of-network rates. " +
  "Before enrolling, I verify that your specific Sharp doctors and facilities are covered under the plan you're considering.";

/**
 * Base answer text for the Scripps Health Medicare Advantage home FAQ entry.
 *
 * This sentence is the single source of truth for the factual claim about
 * Scripps Clinic and Scripps Coastal Medical Group's Medicare Advantage
 * participation. It is used to build both the `a` and `schemaText` fields of
 * the Scripps entry below, AND it is expected to appear verbatim in the Scripps
 * provider page body HTML (providerBodyHtml.ts, `scrippsHealthSanDiegoBodyHtml`).
 *
 * The provider-home-faq-sync.test.ts CI guard verifies this match. If you change
 * the factual claim here, also update the corresponding sentence in
 * providerBodyHtml.ts — and vice versa.
 */
export const SCRIPPS_HOME_FAQ_ANSWER_BASE =
  "Scripps Clinic and Scripps Coastal Medical Group have stopped accepting most Medicare Advantage plans, which means many Advantage members can no longer use those Scripps physician groups for their care. " +
  "If keeping your Scripps doctors is important, Original Medicare paired with a Medigap plan is typically the most dependable path — Medigap doesn't use networks, so it lets you continue seeing Scripps providers who accept Medicare.";

/**
 * Base answer text for the UC San Diego Health Medicare Advantage home FAQ entry.
 *
 * This sentence is the single source of truth for the factual claim about
 * UCSD's narrowed Medicare Advantage participation. It is used to build both
 * the `a` and `schemaText` fields of the UCSD entry below, AND it is expected
 * to appear verbatim in the UCSD provider page body HTML
 * (providerBodyHtml.ts, `ucSanDiegoHealthMedicareBodyHtml`).
 *
 * The provider-home-faq-sync.test.ts CI guard verifies this match. If you change
 * the factual claim here, also update the corresponding sentence in
 * providerBodyHtml.ts — and vice versa.
 */
export const UCSD_HOME_FAQ_ANSWER_BASE =
  "UC San Diego Health accepts only a limited set of Medicare Advantage plans, and that access has been narrowing. " +
  "For 2026, UCSD's in-network Advantage access is significantly reduced — some plans that worked in prior years no longer provide the same access, and certain plans reach only specialty services rather than primary care. " +
  "If keeping UCSD is a priority, Original Medicare with a Medigap plan offers the broadest, most stable access.";

/**
 * Base answer text for the Kaiser Permanente Medicare Advantage home FAQ entry.
 *
 * This sentence is the single source of truth for the factual claim about
 * Kaiser's closed, integrated system structure on Medicare. It is used to build
 * both the `a` and `schemaText` fields of the Kaiser entry below, AND it is
 * expected to appear verbatim in the Kaiser provider page body HTML
 * (providerBodyHtml.ts, `kaiserPermanenteSanDiegoBodyHtml`).
 *
 * The provider-home-faq-sync.test.ts CI guard verifies this match. If you change
 * the factual claim here, also update the corresponding sentence in
 * providerBodyHtml.ts — and vice versa.
 */
export const KAISER_HOME_FAQ_ANSWER_BASE =
  "Kaiser Permanente is a closed, integrated system — its doctors, hospitals, and pharmacies work together within Kaiser's own network. " +
  "To continue receiving care at Kaiser on Medicare, you typically enroll in Kaiser's own Medicare Advantage HMO plan, Kaiser Permanente Senior Advantage. " +
  "Unlike Sharp or Scripps, Kaiser generally doesn't work with Medigap plans, so the core decision is whether staying inside the Kaiser system is right for you.";

/**
 * Base answer text for the Palomar Health Medicare Advantage home FAQ entry.
 *
 * This sentence is the single source of truth for the factual claim about
 * Palomar Health's shifting Medicare Advantage participation. It is used to
 * build both the `a` and `schemaText` fields of the Palomar entry below, AND
 * it is expected to appear verbatim in the Palomar provider page body HTML
 * (providerBodyHtml.ts, `palomarHealthMedicareSanDiegoBodyHtml`).
 *
 * The provider-home-faq-sync.test.ts CI guard verifies this match. If you change
 * the factual claim here, also update the corresponding sentence in
 * providerBodyHtml.ts — and vice versa.
 */
export const PALOMAR_HOME_FAQ_ANSWER_BASE =
  "Palomar Health participates in some Medicare Advantage networks but not others, and the plans it accepts have changed more than once in recent years — a plan that included Palomar before may not now. " +
  "Original Medicare with a Medigap plan offers the most stable access to Palomar facilities, while Advantage can still be a good fit for many inland North County residents if you confirm current participation first.";

/**
 * Base answer text for the Tri-City Medical Center Medicare Advantage home FAQ
 * entry. The matching text is expected to appear verbatim in
 * providerBodyHtml.ts (`triCityMedicalCenterMedicareBodyHtml`).
 */
export const TRI_CITY_HOME_FAQ_ANSWER_BASE =
  "Tri-City participates in a range of Medicare Advantage networks, but which plans include Tri-City — and which of its affiliated doctors — can vary and change each year. " +
  "Advantage can be a good fit, but confirm that your specific plan includes Tri-City before you rely on it.";

/**
 * Base answer text for the Paradise Valley Hospital Medicare Advantage home
 * FAQ entry. The matching text is expected to appear verbatim in
 * providerBodyHtml.ts (`paradiseValleyHospitalMedicareBodyHtml`).
 */
export const PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE =
  "Paradise Valley works with a number of Medicare Advantage plans, and it serves many South Bay residents who are enrolled in them. " +
  "As with any Advantage plan, the specific doctors and services covered depend on the plan's network, which can change each year — so confirm before you enroll.";

export interface HomeFaqItemData {
  /** Question shown to the user and in FAQ schema. */
  q: string;
  /** Plain-text answer used for the FAQ schema `text` field when no
   *  `schemaText` override is provided. */
  a: string;
  /**
   * Override for the FAQ schema `text` field.
   * Required for provider-linked answers so Google can surface the full
   * canonical URL in rich results.
   */
  schemaText?: string;
}

export const homeFaqItems: HomeFaqItemData[] = [
  {
    q: "Does it cost anything to work with a Medicare broker?",
    a: "Nothing at all. My services are completely free to you. I'm paid by insurance companies when I help someone enroll, and the commission is the same regardless of which plan you choose — so my only incentive is finding the plan that actually fits your situation. You never pay more by using a broker than enrolling directly.",
  },
  {
    q: "Do you represent only one insurance company?",
    a: "No — I'm an independent broker, which means I'm contracted with multiple insurance carriers, not tied to any single company. I can compare plans from many different insurers side by side and recommend the one that makes the most sense for you. If I only worked with one company, I could only show you their plans. That's not how I work.",
  },
  {
    q: "Can you review the Medicare plan I already have?",
    a: "Yes, absolutely. A lot of people I work with already have Medicare coverage but aren't sure if it's still the right fit — especially after a move, a health change, or when their plan changes its benefits at the start of a new year. I'll take a look at what you have and compare it with what else is available. There's no obligation to change anything.",
  },
  {
    q: "What if my current Medicare plan is already the best choice?",
    a: "Then I'll tell you to keep it. That happens more often than you might think. My goal isn't to move you to a different plan — it's to make sure you're in the right one. If what you have is already a good fit for your doctors, prescriptions, and budget, I'll say so.",
  },
  {
    q: "Do you only help people who are turning 65?",
    a: "Not at all. I help Medicare beneficiaries at every stage — people turning 65, people who lost employer coverage, people who want to review their existing plan, people dealing with a health change, and long-time Medicare members who just want a second opinion. If you have Medicare questions, I'm here.",
  },
  {
    q: "Can we meet in person if I live in San Diego County?",
    a: "Yes. I offer in-person appointments throughout San Diego County — at your home, a coffee shop, wherever is easiest for you. I also do phone and video calls, 7 days a week. Whatever is most comfortable for you works for me.",
  },
  {
    q: "When should I sign up for Medicare?",
    a: "Your Initial Enrollment Period is a 7-month window: the 3 months before your 65th birthday month, your birthday month, and the 3 months after. If you're still working at 65 with employer coverage from a company with 20+ employees, you may be able to delay without penalty. Missing your window without qualifying coverage can mean lifetime late penalties, so it's worth confirming your situation early.",
  },
  {
    q: "What's the difference between Medicare Advantage and a Medicare Supplement?",
    a: "Medicare Advantage (Part C) plans are offered by private insurers, often with $0 premiums, and usually include drug coverage and extras like dental and vision — but you typically use a network of doctors. Medicare Supplement (Medigap) plans work alongside Original Medicare, let you see any doctor nationwide who accepts Medicare, and have predictable costs, but come with a monthly premium and require a separate Part D drug plan. The right choice depends on your doctors, prescriptions, budget, and travel habits.",
  },
  {
    q: "What is the Medicare Annual Enrollment Period?",
    a: "The Annual Enrollment Period (AEP) runs October 15 through December 7 every year. During this window you can switch Medicare Advantage plans, move between Original Medicare and Medicare Advantage, or change Part D drug plans, with new coverage starting January 1. Plans change their benefits, networks, and drug lists every year, so an annual review is worth doing even if you're happy with your current plan.",
  },
  {
    q: "Do Medicare Advantage plans in San Diego really cost $0?",
    a: "Many San Diego County Medicare Advantage plans have a $0 monthly premium, but $0 premium doesn't mean $0 cost. You still pay your Part B premium, plus copays and coinsurance when you use care. The best plan for you depends on your doctors, your prescriptions, and how you use healthcare — which is exactly what I help you compare.",
  },
  {
    q: "Can I keep my doctor if I change Medicare plans?",
    a: "It depends on the plan type. With Original Medicare plus a Supplement, you can see any doctor in the U.S. who accepts Medicare. With Medicare Advantage, your doctors need to be in the plan's network. Before recommending any plan, I check that your doctors, hospitals, and prescriptions are covered — that's step one of every consultation.",
  },
  {
    q: "Which areas of San Diego do you serve?",
    a: "I work with Medicare beneficiaries throughout San Diego County, including San Diego, Chula Vista, El Cajon, Escondido, La Mesa, and National City. Consultations are free and can be done by phone, video, or in person.",
  },
  {
    q: "Does Sharp HealthCare accept Medicare Advantage?",
    a: `${SHARP_HOME_FAQ_ANSWER_BASE} Learn more on the Sharp HealthCare Medicare Advantage page.`,
    schemaText: `${SHARP_HOME_FAQ_ANSWER_BASE} For a full overview, visit the Sharp HealthCare Medicare Advantage page at medicare-with-ashley.com/sharp-healthcare-medicare-san-diego/.`,
  },
  {
    q: "Does Scripps Health accept Medicare Advantage?",
    a: `${SCRIPPS_HOME_FAQ_ANSWER_BASE} Learn more on the Scripps Health Medicare page.`,
    schemaText: `${SCRIPPS_HOME_FAQ_ANSWER_BASE} For a full overview, visit the Scripps Health Medicare page at medicare-with-ashley.com/scripps-health-medicare-san-diego/.`,
  },
  {
    q: "Does UC San Diego Health accept Medicare Advantage?",
    a: `${UCSD_HOME_FAQ_ANSWER_BASE} Learn more on the UC San Diego Health Medicare page.`,
    schemaText: `${UCSD_HOME_FAQ_ANSWER_BASE} For details, visit the UC San Diego Health Medicare page at medicare-with-ashley.com/uc-san-diego-health-medicare/.`,
  },
  {
    q: "Does Kaiser Permanente work with Medicare Advantage?",
    a: `${KAISER_HOME_FAQ_ANSWER_BASE} Learn more on the Kaiser Permanente Medicare page.`,
    schemaText: `${KAISER_HOME_FAQ_ANSWER_BASE} For details, visit the Kaiser Permanente Medicare page at medicare-with-ashley.com/kaiser-permanente-medicare-san-diego/.`,
  },
  {
    q: "Does Palomar Health accept Medicare Advantage?",
    a: `${PALOMAR_HOME_FAQ_ANSWER_BASE} Learn more on the Palomar Health Medicare page.`,
    schemaText: `${PALOMAR_HOME_FAQ_ANSWER_BASE} For details, visit the Palomar Health Medicare page at medicare-with-ashley.com/palomar-health-medicare-san-diego/.`,
  },
  {
    q: "Does Tri-City Medical Center accept Medicare Advantage?",
    a: `${TRI_CITY_HOME_FAQ_ANSWER_BASE} Learn more on the Tri-City Medical Center Medicare page.`,
    schemaText: `${TRI_CITY_HOME_FAQ_ANSWER_BASE} For details, visit the Tri-City Medical Center Medicare page at medicare-with-ashley.com/tri-city-medical-center-medicare/.`,
  },
  {
    q: "Does Paradise Valley Hospital accept Medicare Advantage?",
    a: `${PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE} Learn more on the Paradise Valley Hospital Medicare page.`,
    schemaText: `${PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE} For details, visit the Paradise Valley Hospital Medicare page at medicare-with-ashley.com/paradise-valley-hospital-medicare/.`,
  },
];

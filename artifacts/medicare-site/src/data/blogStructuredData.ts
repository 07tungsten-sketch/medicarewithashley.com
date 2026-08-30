const GLP1_BRIDGE_SLUG = "medicare-glp1-bridge-denied";
const FAMILY_PHARMACY_CENTER_SLUG = "family-pharmacy-center-san-diego";
const CAN_I_CHANGE_MY_MEDICARE_PLAN_SLUG =
  "can-i-change-my-medicare-plan-after-enrollment";
const DOES_MEDICARE_COVER_DENTAL_SLUG = "does-medicare-cover-dental-san-diego";
const HMO_VS_PPO_SLUG = "hmo-vs-ppo-medicare-plans-san-diego";
const MEDICARE_AND_MEDI_CAL_SLUG =
  "medicare-and-medi-cal-dual-coverage-california";
const MEDICARE_PART_D_PRESCRIPTION_COSTS_SLUG =
  "medicare-part-d-prescription-costs-california";
const SIMPLE_GUIDE_TO_MEDICARE_SLUG = "simple-guide-to-medicare-california";
const TURNING_65_MEDICARE_CHECKLIST_SLUG =
  "turning-65-medicare-checklist-san-diego";

const glp1BridgeArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Denied at the Pharmacy for the GLP-1 Bridge? Here's Why That's Usually Not a "No" — and How to Get Approved`,
  description: `That GLP-1 Bridge rejection at the pharmacy usually isn't a real denial. Why it happens, the fixable reasons behind a real "no," and how to get approved.`,
  url: "https://medicarewithashley.com/blog/medicare-glp1-bridge-denied/",
  mainEntityOfPage: "https://medicarewithashley.com/blog/medicare-glp1-bridge-denied/",
  datePublished: "2026-08-22",
  dateModified: "2026-08-22",
  author: {
    "@type": "Person",
    name: "Ashley Watson",
  },
  publisher: {
    "@type": "Organization",
    name: "Watson Insurance",
    alternateName: "Medicare with Ashley",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "San Diego County, California, US",
    },
  },
};

const glp1BridgeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why was I denied or rejected at the pharmacy for the GLP-1 Bridge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most first-time rejections are automatic and expected. When the pharmacy first runs a Bridge claim, it's rejected on purpose to trigger a prior authorization request that goes to your doctor. It usually isn't a real coverage denial — it means the authorization step hasn't happened yet. Call your doctor's office to confirm they received and submitted the form.",
      },
    },
    {
      "@type": "Question",
      name: "Does the Medicare GLP-1 Bridge really cost only $50 a month?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — the Bridge copay is a flat $50 for a 28- or 30-day supply, the same regardless of income. Because the program runs outside your regular Part D benefit, that $50 doesn't count toward your deductible or your yearly out-of-pocket maximum, and Extra Help and manufacturer coupons can't be applied to it.",
      },
    },
    {
      "@type": "Question",
      name: "How do I know if I qualify for the Bridge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eligibility is based on your BMI plus certain health conditions, and it's judged using your BMI at the time you started the medication — not your current weight. The exact thresholds and qualifying conditions are set by CMS and should be confirmed with your prescriber and on the official CMS page. If you have diabetes, moderate-to-severe sleep apnea, or certain heart or liver conditions, your medication may be covered through regular Part D instead of the Bridge.",
      },
    },
    {
      "@type": "Question",
      name: "Is there an application form I need to fill out for the Bridge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. There is no patient application, enrollment fee, or membership card. The only paperwork is a prior authorization that your doctor submits to Medicare's central processor. Anyone asking you to pay to \"sign up\" is running a scam — report it to 1-800-MEDICARE.",
      },
    },
    {
      "@type": "Question",
      name: "What if my prior authorization is actually denied?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most real denials are fixable — a claim routed to your Part D plan by mistake, an authorization filed too early, a BMI or condition not documented clearly, or the wrong drug formulation. Your prescriber can add the missing information and resubmit, which is usually faster than a formal appeal. If you can't resolve it, call 1-800-MEDICARE, and check the official CMS page, since appeal instructions were still being finalized in 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Can a Medicare broker enroll me in the GLP-1 Bridge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — the Bridge runs through Medicare and your doctor, not through a broker or insurance plan. What a broker can do is make sure you're enrolled in an eligible Part D or Medicare Advantage drug plan, since that coverage is required to use the Bridge, and help you understand whether the Bridge or the regular Part D path fits your situation.",
      },
    },
  ],
};

const canIChangeMyMedicarePlanFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many times can I change my Medicare plan per year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most people can make one change during the AEP and one during the MA Open Enrollment Period — plus additional changes if they qualify for a Special Enrollment Period.",
      },
    },
    {
      "@type": "Question",
      name: "Can I be denied when switching Medicare plans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Medicare Advantage plans cannot deny you enrollment during open enrollment periods. Medicare Supplement plans, however, can require medical underwriting outside of your initial 6-month open enrollment window — with some exceptions in California.",
      },
    },
    {
      "@type": "Question",
      name: "Will I have a gap in coverage when I switch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Changes made during the AEP take effect January 1, so your old plan covers you through December 31. There's typically no gap.",
      },
    },
  ],
};

const doesMedicareCoverDentalFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Medicare cover dentures?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Original Medicare does not. Some Medicare Advantage plans include denture coverage, though limits apply. It's worth comparing before you enroll.",
      },
    },
    {
      "@type": "Question",
      name: "Does Medicare cover dental implants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Original Medicare does not. A growing number of Medicare Advantage plans in San Diego are beginning to offer implant coverage, typically with an annual maximum benefit.",
      },
    },
    {
      "@type": "Question",
      name: "Can I add dental to my current Medicare plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you're on Original Medicare, you'd need to either switch to a Medicare Advantage plan during open enrollment, or purchase a standalone dental plan. During the Medicare Annual Enrollment Period (October 15 – December 7), you can switch plans and gain dental coverage.",
      },
    },
  ],
};

const hmoVsPpoFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I see a specialist without a referral on an HMO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally, no — HMO plans require a referral from your primary care physician for specialist visits. There are some exceptions (OB-GYN care, emergency visits), but for most specialist appointments, you'll need a referral first.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I use an out-of-network doctor on an HMO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For non-emergency care, it typically won't be covered. You'd be responsible for the full cost. This is why verifying your doctors' network participation before enrolling is so important.",
      },
    },
    {
      "@type": "Question",
      name: "Which costs less over a full year — HMO or PPO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on how much you use your coverage. HMOs usually have lower premiums and copays for in-network care. PPOs can be more cost-effective if you need a lot of out-of-network care. Ashley can help you run the numbers based on your actual health usage.",
      },
    },
  ],
};

const medicareAndMediCalFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Will having Medi-Cal affect my Medicare benefits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Having Medi-Cal does not reduce your Medicare benefits. It simply adds a layer of coverage that pays costs Medicare doesn't.",
      },
    },
    {
      "@type": "Question",
      name: "Do I have to choose between Medicare and Medi-Cal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You can have both at the same time. That's the whole point of dual eligibility.",
      },
    },
    {
      "@type": "Question",
      name: "How do I apply for Medi-Cal in San Diego?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can apply through the San Diego County Health and Human Services Agency, by mail, or online through CoveredCA.com. Ashley can help you prepare your application and understand what documentation you'll need.",
      },
    },
    {
      "@type": "Question",
      name: "What if I already have Medicare Advantage — can I still get Medi-Cal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. If you become Medi-Cal eligible while enrolled in a Medicare Advantage plan, you may be able to switch to a D-SNP, which is specifically designed for your situation. Ashley can help you evaluate whether a switch makes sense.",
      },
    },
  ],
};

const medicarePartDPrescriptionCostsFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Medicare Advantage cover prescriptions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most Medicare Advantage plans (called MAPD plans) include Part D drug coverage built in. If you enroll in one of these plans, you don't need a separate Part D plan.",
      },
    },
    {
      "@type": "Question",
      name: "Can I change my Part D plan if my medications change?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can change your Part D plan during the Annual Enrollment Period (October 15 – December 7) each year. If your medication needs change significantly mid-year, Ashley can review whether your current plan still makes sense and whether a Special Enrollment Period applies.",
      },
    },
    {
      "@type": "Question",
      name: "What if my drug isn't on the formulary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can request an exception or formulary exception from the plan. Your doctor may need to submit documentation. In some cases, switching plans during open enrollment is the better solution.",
      },
    },
  ],
};

const simpleGuideToMedicareFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Medicare cover everything?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Original Medicare covers most medically necessary care but has significant gaps — it pays 80% of most Part B costs (you pay 20%), has hospital deductibles, and generally doesn't cover routine dental, vision, or hearing care. Medigap plans and Medicare Advantage plans help fill these gaps.",
      },
    },
    {
      "@type": "Question",
      name: "Is Medicare free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Part A is usually free. Part B has a monthly premium ($185 in 2025). Medicare Advantage plans often have $0 additional premiums on top of Part B. Medigap plans add a monthly premium. So \"free\" depends on the choices you make.",
      },
    },
    {
      "@type": "Question",
      name: "Do I have to choose a plan, or does Medicare just happen automatically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You need to actively enroll. If you receive Social Security benefits before 65, you may be automatically enrolled in Parts A and B, but you still need to actively choose a Medicare Advantage or Part D plan if you want that coverage.",
      },
    },
  ],
};

const turning65MedicareChecklistFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need to sign up for Medicare if I have coverage through my spouse's employer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the size of your spouse's employer. If their company has 20 or more employees, you can usually delay Medicare without penalty. Smaller employers may make Medicare primary, meaning you should enroll on time.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get help at no cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Ashley Watson is a licensed, independent Medicare broker in San Diego who provides free consultations to anyone approaching Medicare. She's not tied to any carrier, so her only job is finding the right plan for you.",
      },
    },
    {
      "@type": "Question",
      name: "How long does enrollment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Signing up for Parts A and B through the Social Security Administration takes about 30 minutes online. Choosing and enrolling in a Medicare Advantage or Supplement plan typically takes one meeting with Ashley — usually under an hour.",
      },
    },
  ],
};

const familyPharmacyCenterArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Why We're Partnering with Family Pharmacy Center — A Local Pharmacy That Delivers, Right Here in San Diego County",
  description: "Medicare with Ashley is proud to partner with Family Pharmacy Center, a locally owned San Diego County pharmacy offering free prescription delivery, vaccinations, and Medicare-focused care.",
  url: "https://medicarewithashley.com/blog/family-pharmacy-center-san-diego",
  mainEntityOfPage: "https://medicarewithashley.com/blog/family-pharmacy-center-san-diego",
  datePublished: "2026-08-28",
  dateModified: "2026-08-28",
  author: {
    "@type": "Person",
    name: "Ashley Watson",
  },
  publisher: {
    "@type": "Organization",
    name: "Watson Insurance",
    alternateName: "Medicare with Ashley",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "San Diego County, California, US",
    },
  },
  about: {
    "@type": "Pharmacy",
    name: "Family Pharmacy Center",
    areaServed: "San Diego County, California",
  },
};

export function getBlogStructuredData(slug: string) {
  if (slug === CAN_I_CHANGE_MY_MEDICARE_PLAN_SLUG) {
    return {
      faqSchema: canIChangeMyMedicarePlanFaqSchema,
    };
  }

  if (slug === DOES_MEDICARE_COVER_DENTAL_SLUG) {
    return {
      faqSchema: doesMedicareCoverDentalFaqSchema,
    };
  }

  if (slug === HMO_VS_PPO_SLUG) {
    return {
      faqSchema: hmoVsPpoFaqSchema,
    };
  }

  if (slug === MEDICARE_AND_MEDI_CAL_SLUG) {
    return {
      faqSchema: medicareAndMediCalFaqSchema,
    };
  }

  if (slug === MEDICARE_PART_D_PRESCRIPTION_COSTS_SLUG) {
    return {
      faqSchema: medicarePartDPrescriptionCostsFaqSchema,
    };
  }

  if (slug === SIMPLE_GUIDE_TO_MEDICARE_SLUG) {
    return {
      faqSchema: simpleGuideToMedicareFaqSchema,
    };
  }

  if (slug === TURNING_65_MEDICARE_CHECKLIST_SLUG) {
    return {
      faqSchema: turning65MedicareChecklistFaqSchema,
    };
  }

  if (slug === FAMILY_PHARMACY_CENTER_SLUG) {
    return {
      articleSchema: familyPharmacyCenterArticleSchema,
    };
  }

  if (slug !== GLP1_BRIDGE_SLUG) return null;

  return {
    articleSchema: glp1BridgeArticleSchema,
    faqSchema: glp1BridgeFaqSchema,
  };
}
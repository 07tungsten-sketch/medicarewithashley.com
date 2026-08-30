import {
  sharpHealthcareSanDiegoBodyHtml,
  scrippsHealthSanDiegoBodyHtml,
  ucSanDiegoHealthMedicareBodyHtml,
  kaiserPermanenteSanDiegoBodyHtml,
  sanDiegoHospitalsMedicareBodyHtml,
  palomarHealthMedicareSanDiegoBodyHtml,
  triCityMedicalCenterMedicareBodyHtml,
  paradiseValleyHospitalMedicareBodyHtml,
  alvaradoHospitalMedicareBodyHtml,
  dvhSanDiegoBodyHtml,
} from "@/data/providerBodyHtml";

/** Shared config type for provider landing pages. */
export interface ProviderPageConfig {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  bodyHtml: string;
  /** Optional FAQPage JSON-LD injected into <head> for Google rich results */
  faqSchema?: object;
}

/**
 * All provider landing pages.
 *
 * This is the single source of truth for provider routes. Adding a new
 * provider page here automatically registers it in the router (App.tsx).
 * A corresponding sitemap.xml entry must also be added — the unit test
 * src/data/sitemap-provider-coverage.test.ts will fail if it's missing.
 */
export const providerPages: ProviderPageConfig[] = [
  {
    slug: "sharp-healthcare-medicare-san-diego",
    metaTitle: "Sharp HealthCare & Medicare in San Diego | Medicare with Ashley",
    metaDescription:
      "Wondering if your Medicare plan works with Sharp HealthCare? Learn how Original Medicare, Medigap, and Medicare Advantage handle Sharp doctors and hospitals in San Diego.",
    title: "Medicare and Sharp HealthCare in San Diego",
    bodyHtml: sharpHealthcareSanDiegoBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/sharp-healthcare-medicare-san-diego/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Sharp HealthCare accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sharp facilities generally accept Original Medicare. With a Medigap policy, you can see any provider that accepts Medicare, including Sharp. With a Medicare Advantage plan, coverage depends on that specific plan\u2019s network, so it\u2019s important to verify.",
            url: "https://medicarewithashley.com/sharp-healthcare-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Can I keep my Sharp doctor if I choose Medicare Advantage?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on whether that doctor participates in your plan\u2019s network, and networks can change each year. Always confirm your specific doctors before enrolling.",
            url: "https://medicarewithashley.com/sharp-healthcare-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "How do I check whether my plan covers Sharp?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can call the plan directly, search its online provider directory, or have a licensed broker verify your specific doctors and hospital for you.",
            url: "https://medicarewithashley.com/sharp-healthcare-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you review my networks?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the insurance carriers, so there\u2019s no charge to you for reviewing your options.",
            url: "https://medicarewithashley.com/sharp-healthcare-medicare-san-diego/",
          },
        },
      ],
    },
  },
  {
    slug: "scripps-health-medicare-san-diego",
    metaTitle: "Scripps Health & Medicare in San Diego | Medicare with Ashley",
    metaDescription:
      "Can you keep your Scripps doctors on Medicare? Learn how Original Medicare, Medigap, and Medicare Advantage work with Scripps Health in San Diego.",
    title: "Medicare and Scripps Health in San Diego",
    bodyHtml: scrippsHealthSanDiegoBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/scripps-health-medicare-san-diego/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Scripps accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Scripps accepts Original Medicare and Medicare Supplement (Medigap) plans. A Medigap plan lets you see Scripps providers who accept Medicare.",
            url: "https://medicarewithashley.com/scripps-health-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Does Scripps accept Medicare Advantage plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on which part of Scripps you use. Scripps hospitals remain in-network with many Medicare Advantage plans. It\u2019s Scripps Clinic and Scripps Coastal Medical Group \u2014 the outpatient and primary care locations \u2014 that have stepped back from Advantage. Some plans include Golden Physicians Medical Group, which can provide access to Scripps Clinic specialists. Always confirm your specific plan before relying on it.",
            url: "https://medicarewithashley.com/scripps-health-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "How can I keep my Scripps doctor on Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For most people, pairing Original Medicare with a Medigap plan is the most dependable way to keep access to Scripps. A licensed broker can review your specific doctors and options.",
            url: "https://medicarewithashley.com/scripps-health-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you review my options?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the insurance carriers, so there\u2019s no charge to you.",
            url: "https://medicarewithashley.com/scripps-health-medicare-san-diego/",
          },
        },
      ],
    },
  },
  {
    slug: "uc-san-diego-health-medicare",
    metaTitle: "UC San Diego Health & Medicare | Medicare with Ashley",
    metaDescription:
      "Wondering if your Medicare plan still covers UC San Diego Health in 2026? Learn how Original Medicare, Medigap, and Medicare Advantage work with UCSD.",
    title: "Medicare and UC San Diego Health",
    bodyHtml: ucSanDiegoHealthMedicareBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/uc-san-diego-health-medicare/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does UC San Diego Health accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "UCSD accepts Original Medicare and Medicare Supplement (Medigap) plans, plus a limited set of Medicare Advantage plans.",
            url: "https://medicarewithashley.com/uc-san-diego-health-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Does UCSD accept Medicare Advantage plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Only a narrower set, and it has been changing. For 2026, UCSD\u2019s in-network Advantage access is significantly reduced, so confirm your specific plan before enrolling.",
            url: "https://medicarewithashley.com/uc-san-diego-health-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "What\u2019s the most reliable way to keep UCSD on Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For most people, Original Medicare with a Medigap plan provides the broadest, most stable UCSD access.",
            url: "https://medicarewithashley.com/uc-san-diego-health-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you review my options?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the carriers, so there\u2019s no charge to you.",
            url: "https://medicarewithashley.com/uc-san-diego-health-medicare/",
          },
        },
      ],
    },
  },
  {
    slug: "kaiser-permanente-medicare-san-diego",
    metaTitle: "Kaiser Permanente & Medicare in San Diego | Medicare with Ashley",
    metaDescription:
      "How does Medicare work with Kaiser Permanente in San Diego? Learn why Kaiser is different and how to keep your Kaiser doctors on Medicare.",
    title: "Medicare and Kaiser Permanente in San Diego",
    bodyHtml: kaiserPermanenteSanDiegoBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/kaiser-permanente-medicare-san-diego/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Kaiser Permanente accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, through its own Medicare plan. To get care within the Kaiser system on Medicare, you typically enroll in Kaiser Permanente Senior Advantage, a Medicare Advantage HMO plan.",
            url: "https://medicarewithashley.com/kaiser-permanente-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Can I use a Medigap plan at Kaiser?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Generally no. Because Kaiser is a closed, integrated system, Medigap plans don\u2019t provide access to Kaiser doctors the way they do at other San Diego systems.",
            url: "https://medicarewithashley.com/kaiser-permanente-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "What if I want to keep my Kaiser doctors?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Staying with Kaiser usually means enrolling in a Kaiser Medicare plan. A licensed broker can walk you through whether that\u2019s the best fit for you.",
            url: "https://medicarewithashley.com/kaiser-permanente-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you help me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the carriers, so there\u2019s no charge to you.",
            url: "https://medicarewithashley.com/kaiser-permanente-medicare-san-diego/",
          },
        },
      ],
    },
  },
  {
    slug: "san-diego-hospitals-medicare",
    metaTitle: "San Diego Hospitals & Medicare | Keep Your Doctors | Medicare with Ashley",
    metaDescription:
      "How Medicare works with San Diego's major hospitals — Sharp, Scripps, UC San Diego Health, and Kaiser — and how to keep your doctors and hospitals.",
    title: "San Diego Hospitals and Medicare: Keeping Your Doctors",
    bodyHtml: sanDiegoHospitalsMedicareBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/san-diego-hospitals-medicare/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which San Diego hospitals accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "San Diego's major systems \u2014 including Sharp, Scripps, UC San Diego Health, Kaiser, Palomar Health, Tri-City Medical Center, Paradise Valley Hospital, and Alvarado Hospital (now UC San Diego Health East Campus) \u2014 all work with Medicare, but they accept different types of plans in different ways. The pages above explain each one.",
            url: "https://medicarewithashley.com/san-diego-hospitals-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Will my Medicare plan let me keep my current hospital?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on your plan type and the system. Original Medicare with a Medigap plan offers the broadest access, while Medicare Advantage depends on that plan's network, which can change each year.",
            url: "https://medicarewithashley.com/san-diego-hospitals-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "What's the most flexible way to keep my San Diego doctors?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For most people who want to move freely across San Diego systems, Original Medicare paired with a Medigap plan provides the most stable access. The right choice still depends on your specific situation.",
            url: "https://medicarewithashley.com/san-diego-hospitals-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you review my options?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the insurance carriers, so there's no charge to you.",
            url: "https://medicarewithashley.com/san-diego-hospitals-medicare/",
          },
        },
      ],
    },
  },
  {
    slug: "palomar-health-medicare-san-diego",
    metaTitle: "Palomar Health & Medicare | Escondido & Poway | Medicare with Ashley",
    metaDescription:
      "How does Medicare work with Palomar Health in Escondido and Poway? Learn how Original Medicare, Medigap, and Medicare Advantage handle Palomar doctors and hospitals.",
    title: "Medicare and Palomar Health",
    bodyHtml: palomarHealthMedicareSanDiegoBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/palomar-health-medicare-san-diego/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Palomar Health accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Palomar accepts Original Medicare, and a Medigap plan lets you see Palomar providers who accept Medicare.",
            url: "https://medicarewithashley.com/palomar-health-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Have Palomar\u2019s accepted insurance plans changed recently?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Medicare Advantage plans Palomar accepts have changed more than once in recent years, so it\u2019s important to confirm current participation for your specific plan before enrolling or renewing.",
            url: "https://medicarewithashley.com/palomar-health-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Does Palomar accept Medicare Advantage plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Palomar participates in some Medicare Advantage networks but not others, and this has changed recently. Confirm your specific plan before enrolling.",
            url: "https://medicarewithashley.com/palomar-health-medicare-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you review my options?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the carriers, so there\u2019s no charge to you.",
            url: "https://medicarewithashley.com/palomar-health-medicare-san-diego/",
          },
        },
      ],
    },
  },
  {
    slug: "tri-city-medical-center-medicare",
    metaTitle: "Tri-City Medical Center & Medicare | Oceanside | Medicare with Ashley",
    metaDescription:
      "Wondering if your Medicare plan works with Tri-City Medical Center? Learn how Original Medicare, Medigap, and Medicare Advantage handle Tri-City in coastal North County.",
    title: "Medicare and Tri-City Medical Center",
    bodyHtml: triCityMedicalCenterMedicareBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/tri-city-medical-center-medicare/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Tri-City Medical Center accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Tri-City is a Medicare-enrolled hospital and accepts Original Medicare. A Medigap plan lets you use Tri-City and other Medicare providers.",
            url: "https://medicarewithashley.com/tri-city-medical-center-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Does Tri-City accept Medicare Advantage plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It participates in a range of Advantage networks, but which plans include Tri-City can change yearly. Confirm your specific plan.",
            url: "https://medicarewithashley.com/tri-city-medical-center-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "What's the most flexible option?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For most people, Original Medicare with a Medigap plan provides the broadest, most stable access.",
            url: "https://medicarewithashley.com/tri-city-medical-center-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you help me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the carriers.",
            url: "https://medicarewithashley.com/tri-city-medical-center-medicare/",
          },
        },
      ],
    },
  },
  {
    slug: "paradise-valley-hospital-medicare",
    metaTitle: "Paradise Valley Hospital & Medicare | National City | Medicare with Ashley",
    metaDescription:
      "How does Medicare work with Paradise Valley Hospital in National City? Learn about Original Medicare, Medigap, Medicare Advantage, and Medicare with Medi-Cal.",
    title: "Medicare and Paradise Valley Hospital",
    bodyHtml: paradiseValleyHospitalMedicareBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/paradise-valley-hospital-medicare/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Paradise Valley Hospital accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. It's a Medicare-enrolled hospital and accepts Original Medicare. A Medigap plan lets you use Paradise Valley and other Medicare providers. For a full overview, visit our Paradise Valley Hospital Medicare page at https://medicarewithashley.com/paradise-valley-hospital-medicare/.",
            url: "https://medicarewithashley.com/paradise-valley-hospital-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Does Paradise Valley accept Medicare Advantage plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It works with a number of Advantage plans, but the specific coverage depends on the plan's network, which can change yearly. Confirm your plan.",
            url: "https://medicarewithashley.com/paradise-valley-hospital-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "What if I have both Medicare and Medi-Cal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "There are plans designed for people with both, and Paradise Valley serves many dual-eligible patients. A licensed broker can help you coordinate the two.",
            url: "https://medicarewithashley.com/paradise-valley-hospital-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you help me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the carriers.",
            url: "https://medicarewithashley.com/paradise-valley-hospital-medicare/",
          },
        },
      ],
    },
  },
  {
    slug: "alvarado-hospital-medicare",
    metaTitle:
      "Alvarado Hospital & Medicare | Now UC San Diego Health East Campus | Medicare with Ashley",
    metaDescription:
      "Alvarado Hospital is now UC San Diego Health East Campus Medical Center. Learn what that means for your Medicare coverage and how to keep your doctors.",
    title: "Medicare and Alvarado Hospital (now UC San Diego Health East Campus)",
    bodyHtml: alvaradoHospitalMedicareBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/alvarado-hospital-medicare/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Alvarado Hospital still open?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. It\u2019s now called UC San Diego Health East Campus Medical Center, part of UC San Diego Health as of December 2023, at the same Alvarado Road location.",
            url: "https://medicarewithashley.com/alvarado-hospital-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Does it still accept Medicare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. As part of UC San Diego Health, it accepts Original Medicare and Medigap plans, plus a limited set of Medicare Advantage plans.",
            url: "https://medicarewithashley.com/alvarado-hospital-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Will my Medicare Advantage plan still work there?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on your plan. UCSD\u2019s in-network Advantage acceptance narrowed for 2026, so confirm your specific plan before relying on it.",
            url: "https://medicarewithashley.com/alvarado-hospital-medicare/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a cost to have you review my options?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Independent brokers are paid by the carriers.",
            url: "https://medicarewithashley.com/alvarado-hospital-medicare/",
          },
        },
      ],
    },
  },
  {
    slug: "medicare-dental-vision-hearing-san-diego",
    metaTitle: "Medicare Dental, Vision & Hearing Plans | San Diego",
    metaDescription:
      "Original Medicare and Medigap don't cover routine dental, vision, or hearing. Compare two standalone DVH plans with a licensed San Diego County broker.",
    title: "Dental, Vision & Hearing Coverage in San Diego",
    bodyHtml: dvhSanDiegoBodyHtml,
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: "https://medicarewithashley.com/medicare-dental-vision-hearing-san-diego/",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does my Medicare Supplement cover dental, vision, or hearing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Original Medicare and Medicare Supplement (Medigap) plans don\u2019t cover routine dental, vision, or hearing care. A standalone Dental, Vision & Hearing plan is designed specifically to fill that gap.",
            url: "https://medicarewithashley.com/medicare-dental-vision-hearing-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Do I have to have Medicare to buy one of these plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, anyone can purchase this. These are standalone insurance plans, separate from Medicare.",
            url: "https://medicarewithashley.com/medicare-dental-vision-hearing-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Can I keep my own dentist?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Both plans let you use any dentist \u2014 you\u2019re never locked in. With either one you\u2019ll typically pay less at an in-network provider, since those dentists have agreed to discounted rates, but the choice is always yours.",
            url: "https://medicarewithashley.com/medicare-dental-vision-hearing-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Is there a waiting period before I can use my benefits?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on the plan and the type of service. Preventive care is often available right away, while major services may have a waiting period or increase in coverage over the first few years.",
            url: "https://medicarewithashley.com/medicare-dental-vision-hearing-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "How much do these plans cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Premiums depend on your age, the plan you choose, and your ZIP code, so it varies quite a bit \u2014 and it\u2019s often more affordable than people expect. I\u2019m happy to give you an exact quote on a quick call.",
            url: "https://medicarewithashley.com/medicare-dental-vision-hearing-san-diego/",
          },
        },
        {
          "@type": "Question",
          name: "Are these Medicare plans?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Dental, Vision & Hearing plans are separate insurance products \u2014 they are not Medicare, not part of the federal Medicare program, and not required for Medicare enrollment.",
            url: "https://medicarewithashley.com/medicare-dental-vision-hearing-san-diego/",
          },
        },
      ],
    },
  },
];

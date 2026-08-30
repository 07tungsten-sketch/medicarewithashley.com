import { type CityPageConfig } from "@/pages/CityLandingPage";
import {
  chulaVistaBodyHtml,
  nationalCityBodyHtml,
  elCajonBodyHtml,
  laMesaBodyHtml,
  santeeBodyHtml,
  escondidoBodyHtml,
  vistaBodyHtml,
  oceansideBodyHtml,
  southBayBodyHtml,
  sanMarcosBodyHtml,
  powayBodyHtml,
  laJollaBodyHtml,
  encinitasBodyHtml,
  carlsbadBodyHtml,
} from "@/data/cityBodyHtml";

/**
 * All city landing pages.
 *
 * This is the single source of truth for city routes. Adding a new city page
 * here automatically registers it in the router (App.tsx). A corresponding
 * sitemap.xml entry must also be added — the unit test in
 * src/data/sitemap-city-coverage.test.ts will fail loudly if the sitemap
 * entry is missing.
 */
export const cityPages: CityPageConfig[] = [
  {
    city: "Chula Vista",
    slug: "medicare-broker-chula-vista",
    region: "South Bay San Diego",
    metaTitle: "Medicare Broker in Chula Vista CA | Medicare with Ashley",
    metaDescription:
      "Looking for a Medicare broker in Chula Vista? Ashley Watson is a licensed independent Medicare broker serving Chula Vista and all of San Diego County. Free consultations. Call (619) 947-2325.",
    h1: "Medicare Broker in Chula Vista, CA",
    introParagraph:
      "If you're searching for a Medicare broker in Chula Vista, Ashley Watson is your local expert. As a licensed, independent Medicare broker serving the South Bay and all of San Diego County, Ashley helps Chula Vista residents find the Medicare coverage that fits their health needs, their budget, and their doctors — at no cost.",
    secondParagraph:
      "Chula Vista has a diverse and growing senior population, and Ashley understands the local Medicare landscape: which plans work best in the area, which providers are in-network, and how to navigate the process when you're turning 65 or switching plans.",
    bodyHtml: chulaVistaBodyHtml,
  },
  {
    city: "National City",
    slug: "medicare-broker-national-city",
    region: "South Bay San Diego",
    metaTitle: "Medicare Broker in National City CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in National City, CA — Ashley Watson helps National City seniors find the right Medicare plan for free. Independent, unbiased, and local. Call (619) 947-2325.",
    h1: "Medicare Broker in National City, CA",
    introParagraph:
      "Ashley Watson serves National City seniors as a licensed independent Medicare broker — helping residents find Medicare Advantage, Medigap, and Part D plans that match their needs and their doctors. Every consultation is free, and Ashley works for you, not any insurance company.",
    secondParagraph:
      "National City's senior community deserves clear, honest Medicare guidance without the pressure. Ashley takes the time to explain every option in plain English and follows up to make sure you're confident in your choice before you ever sign anything.",
    bodyHtml: nationalCityBodyHtml,
  },
  {
    city: "El Cajon",
    slug: "medicare-broker-el-cajon",
    region: "East County San Diego",
    metaTitle: "Medicare Broker in El Cajon CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in El Cajon, CA — Ashley Watson is a local, independent Medicare broker helping El Cajon residents compare Medicare plans for free. Call (619) 947-2325.",
    h1: "Medicare Broker in El Cajon, CA",
    introParagraph:
      "El Cajon residents looking for help with Medicare will find a trusted partner in Ashley Watson. As an independent Medicare broker serving East County San Diego, Ashley compares Medicare Advantage, Supplement, and Part D plans across all major carriers — and she never charges you a fee.",
    secondParagraph:
      "Whether you're a first-time Medicare enrollee turning 65 in El Cajon or you've been on Medicare for years and want to make sure you're still in the best plan, Ashley is available year-round by phone, video, or in person to help.",
    bodyHtml: elCajonBodyHtml,
  },
  {
    city: "La Mesa",
    slug: "medicare-broker-la-mesa",
    region: "East San Diego",
    metaTitle: "Medicare Broker in La Mesa CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in La Mesa, CA — Ashley Watson helps La Mesa residents navigate Medicare Advantage, Supplements, and Part D plans for free. Call (619) 947-2325.",
    h1: "Medicare Broker in La Mesa, CA",
    introParagraph:
      "La Mesa seniors deserve a Medicare broker who knows the local landscape. Ashley Watson is a licensed independent Medicare broker serving La Mesa and the greater East San Diego area — helping residents compare plans from every major carrier and enroll with confidence.",
    secondParagraph:
      "La Mesa's seniors often have specific needs around local doctors and specialist networks. Ashley takes the time to check your specific providers and medications before making any recommendation, ensuring your plan truly fits your life — not just the general market.",
    bodyHtml: laMesaBodyHtml,
  },
  {
    city: "Santee",
    slug: "medicare-broker-santee",
    region: "East County San Diego",
    metaTitle: "Medicare Broker in Santee CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in Santee, CA — Ashley Watson is your local independent Medicare broker in Santee and East County. Free Medicare help. Call (619) 947-2325.",
    h1: "Medicare Broker in Santee, CA",
    introParagraph:
      "Looking for a Medicare broker in Santee? Ashley Watson serves Santee and East County San Diego as a licensed independent Medicare broker. She compares Medicare Advantage, Medigap, and prescription drug plans from all major carriers — and consultations are always free.",
    secondParagraph:
      "Santee is a tight-knit community, and Ashley is proud to serve it. She understands that Santee residents value honesty, transparency, and a local advisor they can trust — which is exactly what she brings to every Medicare consultation.",
    bodyHtml: santeeBodyHtml,
  },
  {
    city: "Oceanside",
    slug: "medicare-broker-oceanside",
    region: "North Coastal San Diego",
    metaTitle: "Medicare Broker in Oceanside CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in Oceanside, CA — Ashley Watson helps Oceanside seniors compare Medicare plans for free. Independent broker, North San Diego County. Call (619) 947-2325.",
    h1: "Medicare Broker in Oceanside, CA",
    introParagraph:
      "Oceanside seniors looking for honest Medicare guidance can count on Ashley Watson. As a licensed independent Medicare broker serving North Coastal San Diego, Ashley helps Oceanside residents compare all available Medicare Advantage, Supplement, and Part D plans — at absolutely no cost.",
    secondParagraph:
      "Oceanside has a large military retiree community with unique Medicare needs. Ashley is experienced in helping veterans and military retirees understand how Medicare interacts with TRICARE and VA benefits, ensuring they get the coverage they deserve without overpaying.",
    bodyHtml: oceansideBodyHtml,
  },
  {
    city: "Vista",
    slug: "medicare-broker-vista",
    region: "North County San Diego",
    metaTitle: "Medicare Broker in Vista CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in Vista, CA — Ashley Watson helps Vista seniors compare Medicare plans for free. Independent broker, North San Diego County. Call (619) 947-2325.",
    h1: "Medicare Broker in Vista, CA",
    introParagraph:
      "Vista residents looking for honest Medicare guidance can count on Ashley Watson. As a licensed independent Medicare broker serving North County San Diego, Ashley helps Vista residents compare all available Medicare Advantage, Supplement, and Part D plans — at absolutely no cost.",
    secondParagraph:
      "Vista sits at the center of Tri-City Medical Center's service area, and many residents also receive care through Palomar Health or Scripps Coastal Medical Center in Carlsbad. Ashley verifies your specific providers across each plan's network before recommending anything, so you know your doctors are covered before you enroll.",
    bodyHtml: vistaBodyHtml,
  },
  {
    city: "Escondido",
    slug: "medicare-broker-escondido",
    region: "North County San Diego",
    metaTitle: "Medicare Broker in Escondido CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in Escondido, CA — Ashley Watson is your independent Medicare broker in Escondido and North County San Diego. Free consultations. Call (619) 947-2325.",
    h1: "Medicare Broker in Escondido, CA",
    introParagraph:
      "Escondido residents can find trusted Medicare guidance with Ashley Watson, a licensed independent Medicare broker serving North County San Diego. Ashley helps Escondido seniors compare Medicare Advantage, Medigap, and Part D plans from every major carrier — always free, always honest.",
    secondParagraph:
      "North County San Diego, including Escondido, has a growing senior population with access to excellent medical facilities. Ashley knows which local providers and medical groups participate in which plans, helping her clients in Escondido keep their existing doctors while getting the best coverage and value.",
    bodyHtml: escondidoBodyHtml,
  },
  {
    city: "San Marcos",
    slug: "medicare-broker-san-marcos",
    region: "North County San Diego",
    metaTitle: "Medicare Broker in San Marcos, CA | Medicare with Ashley",
    metaDescription:
      "Independent Medicare broker serving San Marcos & North County San Diego. Free, no-pressure help with Medicare Advantage, Supplement & Part D — in your home or by phone. Call (619) 947-2325.",
    h1: "Your Local Medicare Broker in San Marcos",
    introParagraph:
      "Hi, I'm Ashley Watson — an independent Medicare broker serving San Marcos and all of North County San Diego. I'm not tied to any single insurance company, so my only job is finding the plan that actually fits your doctors, your prescriptions, and your budget — then being here after you enroll to make sure it keeps working.",
    secondParagraph:
      "There's never a fee for my help, and I come to you. Prefer to handle everything by phone? That works too — a lot of my San Marcos clients do.",
    bodyHtml: sanMarcosBodyHtml,
    faqs: [
      {
        question: "Does it cost anything to work with a Medicare broker in San Marcos?",
        answer:
          "No. My help is completely free to you. Medicare brokers are paid by the insurance carriers, and it never changes the price of your plan — a plan costs the same whether you enroll through me or on your own.",
      },
      {
        question: "Can I keep my Graybill or Palomar doctors on Medicare?",
        answer:
          "In most cases, yes — but it depends on the plan. With a Medicare Supplement plan, you can see any provider that accepts Medicare, including Graybill/Palomar Health, Tri-City, Scripps Clinic, Scripps Coastal, and UC San Diego Health. With a Medicare Advantage plan, it depends on that plan's network, which is exactly what I verify with you before you enroll.",
      },
      {
        question: "Can you help me if I only want a Medicare Supplement plan?",
        answer:
          "Absolutely. I'm appointed with the major Medigap carriers and can compare Supplement plans side by side, including how their rates are likely to age over time — a detail most people never get explained.",
      },
      {
        question: "Do you meet in person in San Marcos?",
        answer:
          "Yes — I come to you anywhere in San Marcos and North County, whether that's your home or a coffee shop. Many clients prefer to do everything by phone or video, and that works just as well.",
      },
      {
        question: "When can I enroll or change my plan?",
        answer:
          "The main window is the Annual Enrollment Period, October 15 to December 7. If you're new to Medicare, you have your own 7-month Initial Enrollment Period around your 65th birthday. Certain life changes can open a Special Enrollment Period too — reach out and I'll tell you which applies to you.",
      },
    ],
  },
  {
    city: "Poway",
    slug: "medicare-broker-poway",
    region: "Inland North County San Diego",
    metaTitle: "Medicare Broker in Poway CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in Poway, CA — Ashley Watson helps Poway seniors compare Medicare plans and keep their Palomar doctors for free. Call (619) 947-2325.",
    h1: "Medicare Broker in Poway, CA",
    introParagraph:
      "Poway residents looking for trusted Medicare guidance can count on Ashley Watson, a licensed independent Medicare broker serving inland North County San Diego. Ashley helps Poway seniors compare Medicare Advantage, Medigap, and Part D plans from every major carrier — always free, always without pressure.",
    secondParagraph:
      "With Palomar Medical Center Poway close to home and access to doctors across multiple San Diego health systems, Poway residents need a plan that works for their actual care team. Ashley verifies your doctors, prescriptions, and preferred hospitals before you enroll.",
    bodyHtml: powayBodyHtml,
  },
  {
    city: "La Jolla",
    slug: "medicare-broker-la-jolla",
    region: "La Jolla / Coastal San Diego",
    metaTitle: "Medicare Broker in La Jolla CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in La Jolla, CA — Ashley Watson helps La Jolla residents keep their Scripps and UCSD doctors on Medicare. Free, independent, and local. Call (619) 947-2325.",
    h1: "Medicare Broker in La Jolla, CA",
    introParagraph:
      "La Jolla residents have access to two of San Diego's premier health systems — Scripps Health and UC San Diego Health — and protecting those relationships when transitioning to Medicare is what Ashley Watson specializes in. As a licensed, independent Medicare broker, Ashley helps La Jolla seniors choose between Medigap and Medicare Advantage based on their specific physicians, not generic network claims.",
    secondParagraph:
      "La Jolla's Medicare market is shaped by its healthcare landscape: Scripps Memorial Hospital La Jolla and UC San Diego Health's main campus both sit within the community, drawing patients who value academic and specialty medicine. The right Medicare plan for a La Jolla resident often looks different from the right plan for someone across the county — and Ashley brings that local knowledge to every consultation.",
    bodyHtml: laJollaBodyHtml,
  },
  {
    city: "Encinitas",
    slug: "medicare-broker-encinitas",
    region: "North Coastal San Diego",
    metaTitle: "Medicare Broker in Encinitas CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in Encinitas, CA — Ashley Watson helps Encinitas residents keep their Scripps doctors on Medicare. Free, independent, North County. Call (619) 947-2325.",
    h1: "Medicare Broker in Encinitas, CA",
    introParagraph:
      "Encinitas residents who want to keep their Scripps Encinitas physicians when they transition to Medicare need to choose their plan type carefully — and that's exactly where Ashley Watson helps. As a licensed, independent Medicare broker serving North Coastal San Diego, Ashley compares Medicare Advantage and Medigap plans based on your actual Scripps providers, not just which logos appear on a carrier's website.",
    secondParagraph:
      "Ashley serves clients throughout the Encinitas area, including Leucadia, Cardiff-by-the-Sea, and Olivenhain. She meets with clients by phone, video call, or in person — always free, always without pressure.",
    bodyHtml: encinitasBodyHtml,
  },
  {
    city: "Carlsbad",
    slug: "medicare-broker-carlsbad",
    region: "North Coastal San Diego",
    metaTitle: "Medicare Broker in Carlsbad CA | Medicare with Ashley",
    metaDescription:
      "Medicare broker in Carlsbad, CA — Ashley Watson helps Carlsbad residents keep their Scripps Coastal and Tri-City doctors on Medicare. Free consultations. Call (619) 947-2325.",
    h1: "Medicare Broker in Carlsbad, CA",
    introParagraph:
      "Carlsbad seniors looking for Medicare help often have a specific challenge: their care is split between Scripps Coastal Medical Center Carlsbad and Tri-City Medical Center in neighboring Oceanside — two systems with different Medicare Advantage network footprints. Ashley Watson is a licensed, independent Medicare broker who helps Carlsbad residents find plans that work for their whole care team, not just one system.",
    secondParagraph:
      "Ashley serves clients throughout Carlsbad — from the coastal communities near Carlsbad State Beach to the inland neighborhoods near Palomar Airport Road. Consultations are available by phone, video call, or in person, always free.",
    bodyHtml: carlsbadBodyHtml,
  },
  {
    city: "South Bay San Diego",
    slug: "medicare-help-south-bay-san-diego",
    region: "South Bay San Diego",
    metaTitle: "Medicare Help in South Bay San Diego | Medicare with Ashley",
    metaDescription:
      "Medicare broker serving all of South Bay San Diego — Chula Vista, National City, Imperial Beach, Lemon Grove, and surrounding communities. Free consultations. Call (619) 947-2325.",
    h1: "Medicare Help in South Bay San Diego",
    introParagraph:
      "The South Bay is one of the most diverse and fastest-growing regions of San Diego County — and it has some of the strongest Medicare Advantage plan competition in all of California. If you live in South Bay San Diego and need help understanding your Medicare options, Ashley Watson is a licensed, independent Medicare broker who serves the entire South Bay region at no cost to you.",
    secondParagraph:
      "Ashley meets with South Bay clients by phone, video call, or in person — seven days a week. Whether you're turning 65, reviewing an existing plan, or navigating dual Medicare and Medi-Cal coverage, she knows the South Bay's local healthcare landscape and will find the right plan for your situation.",
    bodyHtml: southBayBodyHtml,
  },
];

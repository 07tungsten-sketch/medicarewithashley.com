import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { ExternalLink, Phone, MapPin, ChevronRight } from "lucide-react";

type Resource = {
  name: string;
  description: string;
  url?: string;
  phone?: string;
  address?: string;
};

type Category = {
  title: string;
  emoji: string;
  description: string;
  resources: Resource[];
};

const categories: Category[] = [
  {
    title: "Medicare & Federal Resources",
    emoji: "🏛️",
    description: "Official government sources for Medicare information, enrollment, and plan comparison.",
    resources: [
      {
        name: "Medicare.gov",
        description: "Official U.S. government Medicare website — compare plans, check coverage, and find providers.",
        url: "https://www.medicare.gov/",
      },
      {
        name: "Medicare Plan Finder",
        description: "Compare Medicare Advantage, supplement, and Part D drug plans side by side.",
        url: "https://www.medicare.gov/plan-compare/",
      },
      {
        name: "Social Security Administration",
        description: "Enroll in Medicare, manage benefits, and apply for Social Security retirement.",
        url: "https://www.ssa.gov/",
      },
      {
        name: "Centers for Medicare & Medicaid Services (CMS)",
        description: "Medicare policy, regulations, and research from the federal agency that runs Medicare.",
        url: "https://www.cms.gov/",
      },
      {
        name: "Medicare Rights Center",
        description: "National nonprofit providing free counseling and education on Medicare rights.",
        url: "https://www.medicarerights.org/",
      },
    ],
  },
  {
    title: "California State Programs",
    emoji: "🌴",
    description: "State-funded programs for California seniors including free Medicare counseling and financial assistance.",
    resources: [
      {
        name: "California HICAP — Free Medicare Counseling",
        description: "Free, unbiased Medicare counseling from trained volunteers. The best place to start if you want neutral, no-sales-pressure advice on your options.",
        url: "https://www.aging.ca.gov/Programs_and_Services/Medicare_Counseling/",
        phone: "(800) 434-0222",
      },
      {
        name: "California Department of Aging",
        description: "State agency overseeing senior programs including Meals on Wheels, caregiver support, and adult day care.",
        url: "https://www.aging.ca.gov/",
      },
      {
        name: "Medi-Cal (California Medicaid)",
        description: "Many Medicare beneficiaries also qualify for Medi-Cal, which can eliminate your Part B premium and drug costs through Medicare Savings Programs.",
        url: "https://www.dhcs.ca.gov/services/medi-cal/",
      },
      {
        name: "CalFresh (Food Assistance / SNAP)",
        description: "California's food assistance program. Seniors on fixed incomes often qualify — even if you receive Medicare or Social Security.",
        url: "https://www.cdss.ca.gov/calfresh",
      },
      {
        name: "California Senior Legal Hotline",
        description: "Free legal advice for Californians age 60+ on Social Security, Medicare denials, housing, and consumer issues.",
        url: "https://www.seniorlegalhotline.org/",
        phone: "(800) 222-1753",
      },
    ],
  },
  {
    title: "San Diego County Services",
    emoji: "🏖️",
    description: "County-administered programs covering health, in-home care, and community support for San Diego seniors.",
    resources: [
      {
        name: "Aging & Independence Services (AIS)",
        description: "San Diego County's primary hub for senior services — connects residents to meals, transportation, caregiver support, and in-home care.",
        url: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ais.html",
        phone: "(800) 339-4661",
      },
      {
        name: "211 San Diego",
        description: "Free, 24/7 referral service for health, housing, food, and social services. Call 2-1-1 or visit their site to search by need.",
        url: "https://www.211sandiego.org/",
        phone: "211",
      },
      {
        name: "HICAP San Diego — Local Office",
        description: "In-person Medicare counseling appointments available throughout San Diego County at no cost.",
        url: "https://www.aging.ca.gov/Programs_and_Services/Medicare_Counseling/",
        phone: "(800) 434-0222",
      },
      {
        name: "Long-Term Care Ombudsman",
        description: "Advocates for residents of nursing homes, assisted living, and other long-term care facilities in San Diego County.",
        url: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ais/long_term_care_ombudsman_program.html",
        phone: "(800) 640-4661",
      },
      {
        name: "San Diego County HHSA",
        description: "Health and Human Services Agency overseeing public health, mental health, and social services for all county residents.",
        url: "https://www.sandiegocounty.gov/hhsa/",
      },
    ],
  },
  {
    title: "Local Senior Centers",
    emoji: "🤝",
    description: "Community centers across San Diego County offering activities, lunch programs, fitness, and social events for older adults.",
    resources: [
      {
        name: "City of San Diego Senior Services",
        description: "Parks & Recreation operates senior centers citywide with fitness, lunch, and social programming for adults 50+.",
        url: "https://www.sandiego.gov/parks-and-recreation/activities/senior",
        phone: "(619) 525-8300",
      },
      {
        name: "Chula Vista Senior Center",
        description: "South Bay senior center with wellness programs, fitness classes, and a daily lunch program.",
        url: "https://www.chulavistaca.gov/departments/parks-recreation/senior-services",
        phone: "(619) 691-5129",
      },
      {
        name: "El Cajon Senior Center",
        description: "East County senior center with health screenings, activities, and meals for residents 50+.",
        phone: "(619) 441-1676",
        address: "924 Magnolia Ave, El Cajon, CA 92020",
      },
      {
        name: "Escondido Senior Services",
        description: "North County programs and resources for older adults and caregivers.",
        url: "https://www.escondido.org/senior-services.aspx",
        phone: "(760) 839-4688",
      },
      {
        name: "National City Nutrition Center",
        description: "Hot lunch and social activities for seniors in National City.",
        phone: "(619) 336-4290",
        address: "1415 D Ave, National City, CA 91950",
      },
    ],
  },
  {
    title: "Transportation",
    emoji: "🚌",
    description: "Getting around San Diego without driving — medical trips, grocery runs, and daily errands.",
    resources: [
      {
        name: "FACT — Find A Ride San Diego",
        description: "Free coordination service connecting seniors and people with disabilities to volunteer driver programs across San Diego County.",
        url: "https://factsd.org/",
        phone: "(858) 279-3277",
      },
      {
        name: "MTS Access (ADA Paratransit)",
        description: "Door-to-door paratransit service for seniors and people with disabilities who cannot use fixed-route transit.",
        url: "https://www.sdmts.com/getting-around-mts/access-mts",
        phone: "(619) 231-1466",
      },
      {
        name: "MTS Senior Reduced Fare",
        description: "Seniors 65+ qualify for significantly reduced fares on all MTS buses and trolleys with a Senior Photo ID.",
        url: "https://www.sdmts.com/fares-passes/senior-disabled-medicare-id",
      },
      {
        name: "GoGoGrandparent",
        description: "On-demand rides (via Uber/Lyft) for seniors without smartphones — call to request a car, caregiver notifications included.",
        url: "https://gogograndparent.com/",
        phone: "(855) 464-6872",
      },
    ],
  },
  {
    title: "Food & Nutrition",
    emoji: "🥗",
    description: "Meal delivery, food pantries, and nutrition programs to help San Diego seniors eat well.",
    resources: [
      {
        name: "Meals on Wheels San Diego County",
        description: "Delivers nutritious hot and cold meals to homebound seniors throughout San Diego County, along with safety check-ins.",
        url: "https://www.meals-on-wheels.org/",
        phone: "(619) 260-6110",
      },
      {
        name: "Feeding San Diego",
        description: "Food bank network distributing millions of meals annually, with multiple senior-focused distribution sites.",
        url: "https://feedingsandiego.org/",
        phone: "(858) 452-3663",
      },
      {
        name: "San Diego Food Bank",
        description: "Operates food pantries across the county with dedicated senior distribution programs.",
        url: "https://www.sandiegofoodbank.org/",
        phone: "(858) 527-1419",
      },
      {
        name: "GetCalFresh.org",
        description: "Easy online application for CalFresh grocery benefits. Many Medicare recipients qualify but never apply.",
        url: "https://www.getcalfresh.org/",
      },
    ],
  },
  {
    title: "Legal & Financial Aid",
    emoji: "⚖️",
    description: "Free and low-cost legal help, benefits counseling, and financial guidance for San Diego seniors.",
    resources: [
      {
        name: "Legal Aid Society of San Diego",
        description: "Free civil legal services for low-income residents including seniors — covers housing, healthcare, consumer fraud, and more.",
        url: "https://www.lassd.org/",
        phone: "(877) 534-2524",
      },
      {
        name: "Senior Community Centers — Benefits Counseling",
        description: "Help enrolling in Medicare Savings Programs, CalFresh, Medi-Cal, and other benefits you may be entitled to.",
        url: "https://www.seniorcommunity.org/",
        phone: "(619) 235-6572",
      },
      {
        name: "HICAP — Medicare Savings Program Help",
        description: "Free counseling on Medicare Savings Programs that can eliminate your Part B premium ($174+/month) and reduce drug costs.",
        url: "https://www.aging.ca.gov/Programs_and_Services/Medicare_Counseling/",
        phone: "(800) 434-0222",
      },
      {
        name: "California Senior Legal Hotline",
        description: "Statewide free legal advice hotline for Californians 60+ on Social Security, Medicare disputes, elder abuse, and more.",
        url: "https://www.seniorlegalhotline.org/",
        phone: "(800) 222-1753",
      },
    ],
  },
  {
    title: "Health & Wellness",
    emoji: "❤️",
    description: "Fitness programs, mental health services, and wellness resources for San Diego older adults.",
    resources: [
      {
        name: "SilverSneakers",
        description: "Free gym and fitness class access included with many Medicare Advantage plans. Check if your plan covers it.",
        url: "https://www.silversneakers.com/",
      },
      {
        name: "San Diego County Behavioral Health Services",
        description: "Mental health and substance use services for San Diego County residents, including a 24/7 crisis line.",
        url: "https://www.sandiegocounty.gov/hhsa/programs/bhs/",
        phone: "(800) 479-3339",
      },
      {
        name: "Alzheimer's San Diego",
        description: "Local nonprofit providing support groups, education, and care navigation for people with dementia and their families.",
        url: "https://www.alzsd.org/",
        phone: "(858) 492-4400",
      },
      {
        name: "Family Caregiver Support Program",
        description: "San Diego County AIS program offering respite care, counseling, and training for caregivers of older adults.",
        url: "https://www.sandiegocounty.gov/content/sdc/hhsa/programs/ais.html",
        phone: "(800) 339-4661",
      },
      {
        name: "YMCA of San Diego County — Senior Programs",
        description: "Fitness classes, water aerobics, and social programs tailored for older adults at multiple locations countywide.",
        url: "https://www.ymcasd.org/",
      },
    ],
  },
];

export default function SeniorResources() {
  return (
    <div>
      <SEOHead
        title="San Diego Senior Resources | Medicare with Ashley"
        description="Free guide to senior resources in San Diego County — HICAP Medicare counseling, transportation, meals, legal aid, senior centers, and more."
        canonical="/san-diego-senior-resources/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2044] via-[#163570] to-[#1e4d9e] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#A3D136] inline-block"></span>
            San Diego County
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            San Diego Senior Resources
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            A free, curated directory of the most useful programs and services for seniors and caregivers in San Diego County — from Medicare counseling to meal delivery to free legal aid.
          </p>
          <p className="text-sm text-white/60">
            Have a Medicare question? Ashley can help.{" "}
            <Link href="/contact" className="text-[#A3D136] hover:underline">
              Get a free consultation →
            </Link>
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="bg-gray-50 border-b border-gray-200 py-4 px-4 sticky top-0 z-10 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-3 flex-nowrap min-w-max">
          {categories.map((cat) => (
            <a
              key={cat.title}
              href={`#${cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-xs font-medium text-gray-600 hover:text-[#0F2044] whitespace-nowrap px-3 py-1.5 rounded-full border border-gray-300 hover:border-[#0F2044] transition-colors"
            >
              {cat.emoji} {cat.title.split(" ")[0]} {cat.title.split(" ")[1]}
            </a>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {categories.map((cat) => (
          <div
            key={cat.title}
            id={cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            className="scroll-mt-16"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0F2044] flex items-center gap-3 mb-2">
                <span className="text-3xl" aria-hidden="true">{cat.emoji}</span>
                {cat.title}
              </h2>
              <p className="text-gray-600">{cat.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.resources.map((res) => (
                <div
                  key={res.name}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#A3D136] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-[#0F2044] text-sm leading-snug">
                      {res.url ? (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#A3D136] transition-colors inline-flex items-center gap-1"
                        >
                          {res.name}
                          <ExternalLink size={12} className="opacity-50 flex-shrink-0" />
                        </a>
                      ) : (
                        res.name
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{res.description}</p>
                  <div className="flex flex-col gap-1">
                    {res.phone && (
                      <a
                        href={`tel:${res.phone.replace(/\D/g, "")}`}
                        className="text-xs text-[#0F2044] hover:text-[#A3D136] transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <Phone size={11} />
                        {res.phone}
                      </a>
                    )}
                    {res.address && (
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPin size={11} />
                        {res.address}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-50 border-t border-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            This directory is provided as a free community resource. Medicare with Ashley is not affiliated with, endorsed by, or responsible for the organizations listed above. Contact information and program availability may change — always verify directly with the organization. Last reviewed June 2026.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0F2044] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Medicare Question?</h2>
          <p className="text-white/75 mb-8 text-lg">
            Ashley Watson is a licensed, independent Medicare broker serving all of San Diego County. Free consultations — no pressure, no sales pitch, just honest answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center gap-2 bg-[#A3D136] text-[#0F2044] font-bold px-8 py-3 rounded-full hover:bg-[#94be2e] transition-colors"
            >
              Schedule a Free Review
              <ChevronRight size={16} />
            </Link>
            <a
              href="tel:+16199472325"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone size={16} />
              (619) 947-2325
            </a>
          </div>
          <p className="text-white/50 text-xs mt-6">CA License #4052120</p>
        </div>
      </section>
    </div>
  );
}

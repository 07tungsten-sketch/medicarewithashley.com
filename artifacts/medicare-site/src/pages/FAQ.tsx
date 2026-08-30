import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "When should I sign up for Medicare?",
        a: "Most people should sign up during their Initial Enrollment Period — a 7-month window that starts 3 months before the month you turn 65, includes your birthday month, and ends 3 months after. Enrolling in the first 3 months ensures your coverage starts on your birthday. If you miss this window without qualifying coverage elsewhere, you could face lifetime penalties on your Part B premium.",
      },
      {
        q: "Do I have to sign up for Medicare at 65 if I'm still working?",
        a: "Not necessarily. If you have health insurance through your employer (or your spouse's employer) and that employer has 20 or more employees, you can typically delay Medicare without penalty. When that employer coverage ends, you get a Special Enrollment Period to sign up without penalty. However, the rules differ for smaller employers. Ashley can help you figure out the right timing for your situation.",
      },
      {
        q: "How do I actually enroll in Medicare?",
        a: "Most people are automatically enrolled in Medicare Part A and B when they begin collecting Social Security benefits. If you're not collecting Social Security yet, you'll need to actively enroll through Social Security — online at ssa.gov, by calling 1-800-772-1213, or by visiting a local Social Security office.",
      },
    ],
  },
  {
    category: "Coverage Questions",
    items: [
      {
        q: "Does Medicare cover dental, vision, and hearing?",
        a: "Original Medicare (Parts A and B) does not cover routine dental, vision, or hearing care. However, many Medicare Advantage (Part C) plans include these benefits. If you're on Original Medicare and want this coverage, you'd need to purchase separate dental, vision, or hearing insurance. Ashley can compare plans that offer these benefits in San Diego County.",
      },
      {
        q: "Does Medicare cover prescription drugs?",
        a: "Original Medicare does not cover most outpatient prescription drugs. To get drug coverage, you need to either enroll in a standalone Part D plan (if you have Original Medicare) or choose a Medicare Advantage plan that includes drug coverage. Ashley compares drug plans based on your specific medications to find the lowest total cost.",
      },
      {
        q: "Does Medicare cover care outside the United States?",
        a: "Original Medicare generally does not cover healthcare outside the U.S. However, some Medicare Supplement (Medigap) plans include limited foreign travel emergency coverage. Medicare Advantage plans vary — check the plan's Evidence of Coverage. If you travel internationally, this is an important factor to consider when choosing your coverage.",
      },
      {
        q: "What does Medicare not cover?",
        a: "Original Medicare does not cover: long-term custodial care (nursing home stays for daily living assistance), routine dental care, dentures, routine eye exams or glasses, hearing aids, most prescription drugs, cosmetic surgery, or most care outside the U.S. Understanding these gaps is exactly why many people add a Supplement plan, Medicare Advantage, or both Part D and a Medigap plan.",
      },
      {
        q: "Will my doctor accept Medicare?",
        a: "Most doctors in the U.S. accept Medicare — but not all. When using Original Medicare, you can see any doctor who accepts Medicare nationwide. Medicare Advantage plans typically have a network of providers; seeing someone outside that network may cost more or not be covered at all. Ashley always checks whether a plan covers your specific doctors before recommending it.",
      },
    ],
  },
  {
    category: "Costs and Finances",
    items: [
      {
        q: "How much does Medicare cost?",
        a: "Medicare Part A is premium-free for most people (if you or a spouse worked 10+ years paying Medicare taxes). Part B has a standard monthly premium (around $174 in 2024, higher for higher incomes). Add a Medicare Advantage plan (some have $0 premiums), a Supplement plan, and/or a Part D plan — each has its own premium. Ashley helps you model total annual costs so you can budget accurately.",
      },
      {
        q: "What is the IRMAA surcharge?",
        a: "IRMAA (Income-Related Monthly Adjustment Amount) is an extra premium added to Part B and Part D for people with higher incomes. It's based on your income from 2 years prior. If your income has recently dropped significantly (due to retirement or a life event), you can appeal the IRMAA surcharge using Social Security Form SSA-44.",
      },
      {
        q: "Is there financial assistance available for Medicare costs?",
        a: "Yes. Several programs help people with limited income pay for Medicare costs: Medicare Savings Programs (help pay Part B premiums, deductibles, and copays), Extra Help (a federal program that helps with Part D costs), and Medicaid (for those who qualify). Ashley can point you toward the right resources if cost is a concern.",
      },
    ],
  },
  {
    category: "Switching Plans",
    items: [
      {
        q: "Can I switch Medicare plans?",
        a: "Yes. During the Annual Open Enrollment Period (October 15 – December 7 each year), you can switch Medicare Advantage plans, switch from Medicare Advantage back to Original Medicare, or change your Part D drug plan. Changes take effect January 1 of the following year. There are also Special Enrollment Periods triggered by qualifying life events.",
      },
      {
        q: "Can I switch from Medicare Advantage back to Original Medicare?",
        a: "Yes, during Open Enrollment (Oct 15–Dec 7), you can return to Original Medicare. However, if you want to add a Medigap plan at that point, you may need to pass health underwriting (because your Medigap Open Enrollment has passed). This is one reason some people stay on Original Medicare with a Supplement from the start — it gives them more long-term flexibility.",
      },
      {
        q: "What is a Special Enrollment Period?",
        a: "A Special Enrollment Period (SEP) is a time outside the annual enrollment window when you're allowed to make Medicare changes. Common triggers include: losing employer coverage, moving out of your plan's service area, qualifying for or losing Medicaid, or your plan leaving the area. The SEP rules vary by the triggering event.",
      },
    ],
  },
  {
    category: "Local Providers & Hospitals",
    items: [
      {
        q: "Does Sharp HealthCare accept Medicare Advantage?",
        a: (<>Yes — Sharp HealthCare participates in many Medicare Advantage plans available to San Diego beneficiaries, but not every plan. Sharp's hospitals and medical groups are in-network for several major carriers, while other plans may require you to use a different health system or pay out-of-network rates. Before enrolling, Ashley verifies that your specific Sharp doctors and facilities are covered under the plan you're considering. For a full overview, visit the <Link href="/sharp-healthcare-medicare-san-diego" className="text-primary underline underline-offset-2 hover:text-primary/80">Sharp HealthCare Medicare Advantage</Link> page.</>),
        schemaText: "Yes — Sharp HealthCare participates in many Medicare Advantage plans available to San Diego beneficiaries, but not every plan. Sharp's hospitals and medical groups are in-network for several major carriers, while other plans may require you to use a different health system or pay out-of-network rates. Before enrolling, Ashley verifies that your specific Sharp doctors and facilities are covered under the plan you're considering. For a full overview, visit the Sharp HealthCare Medicare Advantage page at medicare-with-ashley.com/sharp-healthcare-medicare-san-diego/.",
      },
      {
        q: "Does Scripps Health accept Medicare Advantage?",
        a: (<>Scripps Clinic and Scripps Coastal Medical Group have stopped accepting most Medicare Advantage plans, which means many Advantage members can no longer use those Scripps physician groups for their care. If keeping your Scripps doctors is important, Original Medicare paired with a Medigap plan is typically the most dependable path — Medigap doesn't use networks, so it lets you continue seeing Scripps providers who accept Medicare. For a full overview, visit the <Link href="/scripps-health-medicare-san-diego" className="text-primary underline underline-offset-2 hover:text-primary/80">Scripps Health Medicare</Link> page.</>),
        schemaText: "Scripps Clinic and Scripps Coastal Medical Group have stopped accepting most Medicare Advantage plans, which means many Advantage members can no longer use those Scripps physician groups for their care. If keeping your Scripps doctors is important, Original Medicare paired with a Medigap plan is typically the most dependable path — Medigap doesn't use networks, so it lets you continue seeing Scripps providers who accept Medicare. For a full overview, visit the Scripps Health Medicare page at medicare-with-ashley.com/scripps-health-medicare-san-diego/.",
      },
      {
        q: "Does UC San Diego Health accept Medicare Advantage?",
        a: (<>UC San Diego Health accepts only a limited set of Medicare Advantage plans, and that access has been narrowing. For 2026, UCSD's in-network Advantage access is significantly reduced — some plans that worked in prior years no longer provide the same access, and certain plans reach only specialty services rather than primary care. If keeping UCSD is a priority, Original Medicare with a Medigap plan offers the broadest, most stable access. For details, visit the <Link href="/uc-san-diego-health-medicare" className="text-primary underline underline-offset-2 hover:text-primary/80">UC San Diego Health Medicare</Link> page.</>),
        schemaText: "UC San Diego Health accepts only a limited set of Medicare Advantage plans, and that access has been narrowing. For 2026, UCSD's in-network Advantage access is significantly reduced — some plans that worked in prior years no longer provide the same access, and certain plans reach only specialty services rather than primary care. If keeping UCSD is a priority, Original Medicare with a Medigap plan offers the broadest, most stable access. For details, visit the UC San Diego Health Medicare page at medicare-with-ashley.com/uc-san-diego-health-medicare/.",
      },
      {
        q: "Does Kaiser Permanente work with Medicare Advantage?",
        a: (<>Kaiser Permanente is a closed, integrated system — its doctors, hospitals, and pharmacies work together within Kaiser's own network. To continue receiving care at Kaiser on Medicare, you typically enroll in Kaiser's own Medicare Advantage HMO plan, Kaiser Permanente Senior Advantage. Unlike Sharp or Scripps, Kaiser generally doesn't work with Medigap plans, so the core decision is whether staying inside the Kaiser system is right for you. For a full overview, visit the <Link href="/kaiser-permanente-medicare-san-diego" className="text-primary underline underline-offset-2 hover:text-primary/80">Kaiser Permanente Medicare</Link> page.</>),
        schemaText: "Kaiser Permanente is a closed, integrated system — its doctors, hospitals, and pharmacies work together within Kaiser's own network. To continue receiving care at Kaiser on Medicare, you typically enroll in Kaiser's own Medicare Advantage HMO plan, Kaiser Permanente Senior Advantage. Unlike Sharp or Scripps, Kaiser generally doesn't work with Medigap plans, so the core decision is whether staying inside the Kaiser system is right for you. For a full overview, visit the Kaiser Permanente Medicare page at medicare-with-ashley.com/kaiser-permanente-medicare-san-diego/.",
      },
      {
        q: "Does Palomar Health accept Medicare Advantage?",
        a: (<>Palomar Health participates in some Medicare Advantage networks but not others, and the plans it accepts have changed more than once in recent years — a plan that included Palomar before may not now. Original Medicare with a Medigap plan offers the most stable access to Palomar facilities, while Advantage can still be a good fit for many inland North County residents if you confirm current participation first. For a full overview, visit the <Link href="/palomar-health-medicare-san-diego" className="text-primary underline underline-offset-2 hover:text-primary/80">Palomar Health Medicare</Link> page.</>),
        schemaText: "Palomar Health participates in some Medicare Advantage networks but not others, and the plans it accepts have changed more than once in recent years — a plan that included Palomar before may not now. Original Medicare with a Medigap plan offers the most stable access to Palomar facilities, while Advantage can still be a good fit for many inland North County residents if you confirm current participation first. For a full overview, visit the Palomar Health Medicare page at medicare-with-ashley.com/palomar-health-medicare-san-diego/.",
      },
    ],
  },
  {
    category: "Working with Ashley",
    items: [
      {
        q: "How does Ashley get paid?",
        a: "Ashley is paid directly by the insurance carriers — not by you. Her services are always free to Medicare beneficiaries. This is how independent Medicare brokers work nationwide. You pay the same monthly premium whether you enroll through a broker or directly through the insurance company.",
      },
      {
        q: "Is Ashley independent — can she recommend any plan?",
        a: "Yes. Ashley is an independent broker, meaning she is not employed by or committed to any single insurance company. She can recommend plans from any carrier she's contracted with, and her only obligation is to find the plan that's best for you. She'll tell you honestly if your current plan is a good fit.",
      },
      {
        q: "What happens after I enroll?",
        a: "Ashley doesn't disappear after enrollment. She's available year-round to help you with billing questions, claims issues, finding in-network providers, and any other Medicare concerns. She also proactively reviews your plan each fall to make sure it still meets your needs.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div>
      <SEOHead
        title="Medicare FAQ San Diego | Common Questions Answered | Medicare with Ashley"
        description="Get answers to common Medicare questions from San Diego broker Ashley Watson. Medicare costs, enrollment windows, plan types, and more. Free consultations in San Diego County. Call 619-947-2325."
        canonical="/faq/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.flatMap(group =>
            group.items.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": (item as any).schemaText ?? item.a
              }
            }))
          )
        })}</script>
      </Helmet>
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="faq-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Frequently Asked Questions</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Your Medicare Questions, Answered
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Plain-English answers to the questions Ashley hears most often from San Diego seniors and their families.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">
            {faqs.map((group, gi) => (
              <div key={gi} data-testid={`faq-group-${gi}`}>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border">
                  {group.category}
                </h2>
                <div className="space-y-3">
                  {group.items.map((item, i) => (
                    <details
                      key={i}
                      className="group border border-border rounded-xl px-6 bg-card shadow-sm"
                      data-testid={`faq-item-${gi}-${i}`}
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden">
                        <span className="font-serif font-semibold text-foreground text-lg text-left">{item.q}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                      </summary>
                      <p className="text-foreground/80 text-base pb-5 leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-accent/40 rounded-2xl p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Don't See Your Question?</h2>
            <p className="text-foreground/80 text-lg mb-6 leading-relaxed">
              Ashley is happy to answer any Medicare question you have — no question is too basic. Call, email, or schedule a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule">
                <Button className="rounded-full bg-primary text-primary-foreground px-8 py-3 h-auto text-base">
                  Ask Ashley a Question
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+16199472325">
                <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-accent px-8 py-3 h-auto text-base">
                  Call (619) 947-2325
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

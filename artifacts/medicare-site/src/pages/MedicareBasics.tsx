import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, AlertCircle } from "lucide-react";

export const faqs = [
  {
    q: "What does Medicare Part A cover?",
    a: "Medicare Part A is your hospital insurance. It helps pay for inpatient hospital stays, care in a skilled nursing facility after a hospital stay, hospice care, and some home health services. Most people don't pay a premium for Part A if they (or their spouse) worked and paid Medicare taxes for at least 10 years.",
  },
  {
    q: "What does Medicare Part B cover?",
    a: "Medicare Part B covers outpatient medical care — doctor visits and consultations, outpatient hospital care and surgery, preventive services such as flu shots and annual wellness visits, medical equipment like wheelchairs and walkers, and mental health care. Part B has a monthly premium set by Medicare each year, plus an annual deductible. After meeting your deductible, Medicare typically pays 80% and you pay 20%.",
  },
  {
    q: "What is Medicare Advantage (Part C)?",
    a: "Medicare Advantage (Part C) is an all-in-one alternative to Original Medicare offered by private insurers approved by Medicare. These plans bundle Part A, Part B, and usually Part D coverage together. Many Medicare Advantage plans have $0 premiums beyond your Part B premium, and often include dental, vision, hearing, gym memberships, or transportation — though they use provider networks and may have different cost-sharing than Original Medicare.",
  },
  {
    q: "What is Medicare Part D?",
    a: "Medicare Part D is standalone prescription drug coverage you can add to Original Medicare. Original Medicare does not cover most prescription drugs. Each Part D plan has a monthly premium, annual deductible, and copays or coinsurance for your medications. The specific costs depend on which drugs you take and the plan's formulary.",
  },
  {
    q: "What is a Medicare Supplement (Medigap) plan?",
    a: "Medigap plans are sold by private insurers to help cover the 'gaps' in Original Medicare — costs that Medicare doesn't pay, like copays, coinsurance, and deductibles. They can cover Part A and Part B deductibles, Part A and Part B coinsurance, hospital costs beyond Medicare's limit, and some international emergency care. You pay a monthly premium to the private insurer in addition to your Part B premium.",
  },
  {
    q: "When can I first enroll in Medicare?",
    a: "Your Initial Enrollment Period (IEP) is a 7-month window: the 3 months before your 65th birthday month, the birthday month itself, and the 3 months after. This is your first and best chance to enroll — signing up on time avoids late enrollment penalties.",
  },
  {
    q: "What is the Medicare Open Enrollment Period?",
    a: "The Annual Open Enrollment Period (OEP) runs October 15 through December 7 each year. During this time you can switch Medicare Advantage plans, return to Original Medicare, or change your Part D drug plan. New coverage takes effect January 1 of the following year.",
  },
  {
    q: "What happens if I miss my Medicare Initial Enrollment Period?",
    a: "If you miss your Initial Enrollment Period and don't have qualifying coverage elsewhere, you can enroll during the General Enrollment Period (January 1 – March 31 each year), but you may pay higher premiums due to late enrollment penalties. Part B penalties add 10% to your premium for each 12-month period you were eligible but didn't enroll — and those penalties last for life.",
  },
];


const parts = [
  {
    label: "Part A",
    title: "Hospital Insurance",
    color: "bg-blue-50 border-blue-100",
    accent: "bg-[#6aaa00]",
    body: "Medicare Part A is your hospital insurance. It helps pay for inpatient hospital stays, care in a skilled nursing facility after a hospital stay, hospice care, and some home health services.",
    covers: [
      "Inpatient hospital care (after a deductible)",
      "Skilled nursing facility care (up to 100 days)",
      "Hospice care for terminal illness",
      "Some home health services",
    ],
    cost: "Most people don't pay a premium for Part A if they (or their spouse) worked and paid Medicare taxes for at least 10 years.",
  },
  {
    label: "Part B",
    title: "Medical Insurance",
    color: "bg-blue-50 border-blue-200",
    accent: "bg-blue-600",
    body: "Medicare Part B covers your outpatient medical care — the services you receive when you're not admitted to a hospital. It's where most of your doctor visits and routine care fall.",
    covers: [
      "Doctor visits and consultations",
      "Outpatient hospital care and surgery",
      "Preventive services (flu shots, screenings, annual wellness visits)",
      "Medical equipment (wheelchairs, walkers)",
      "Mental health care",
    ],
    cost: "Part B has a monthly premium (set by Medicare each year), plus an annual deductible. After meeting your deductible, Medicare typically pays 80% and you pay 20%.",
  },
  {
    label: "Part C",
    title: "Medicare Advantage",
    color: "bg-cyan-50 border-cyan-200",
    accent: "bg-cyan-600",
    body: "Medicare Advantage (also called Part C) is an all-in-one alternative to Original Medicare. These plans are offered by private insurers approved by Medicare and bundle your Part A, Part B, and usually Part D coverage together.",
    covers: [
      "Everything Original Medicare covers",
      "Often includes prescription drug coverage",
      "Many plans include dental, vision, and hearing",
      "Some include gym memberships or transportation",
    ],
    cost: "Many Medicare Advantage plans have $0 premiums beyond your Part B premium. However, they often use provider networks and may have different cost-sharing than Original Medicare.",
  },
  {
    label: "Part D",
    title: "Prescription Drug Plans",
    color: "bg-sky-50 border-sky-200",
    accent: "bg-sky-600",
    body: "Original Medicare does not cover most prescription drugs. Part D is a standalone drug plan you can add to Original Medicare to help pay for the medications you take.",
    covers: [
      "Prescription drugs on the plan's formulary",
      "Medications at preferred pharmacies",
      "Specialty and brand-name drugs (varies by plan)",
    ],
    cost: "Each Part D plan has a monthly premium, annual deductible, and copays or coinsurance for your medications. The specific costs depend heavily on which drugs you take.",
  },
  {
    label: "Supplement",
    title: "Medicare Supplement (Medigap)",
    color: "bg-blue-50 border-blue-100",
    accent: "bg-[#0F2044]",
    body: "Medigap plans are sold by private insurers to help cover the 'gaps' in Original Medicare — the costs that Medicare doesn't pay, like copays, coinsurance, and deductibles.",
    covers: [
      "Part A and Part B deductibles",
      "Part A and Part B coinsurance",
      "Hospital costs beyond Medicare's limit",
      "Some international emergency care",
    ],
    cost: "You pay a monthly premium to the private insurer in addition to your Part B premium. Premiums vary by plan type, insurer, and your location.",
  },
];

const enrollmentPeriods = [
  {
    name: "Initial Enrollment Period (IEP)",
    timing: "7 months: 3 months before your 65th birthday, the month of, and 3 months after",
    note: "This is your first chance to enroll. Signing up on time avoids late enrollment penalties.",
  },
  {
    name: "General Enrollment Period (GEP)",
    timing: "January 1 – March 31 each year",
    note: "If you missed your IEP, you can enroll here — but you may pay higher premiums.",
  },
  {
    name: "Open Enrollment Period (OEP)",
    timing: "October 15 – December 7 each year",
    note: "You can switch Medicare Advantage plans or return to Original Medicare each fall.",
  },
  {
    name: "Special Enrollment Period (SEP)",
    timing: "Triggered by qualifying life events",
    note: "If you delayed Medicare because you had employer coverage, you have a Special Enrollment Period when that coverage ends.",
  },
];

export default function MedicareBasics() {
  return (
    <div>
      <SEOHead
        title="Medicare Basics San Diego | What Is Medicare? | Medicare with Ashley"
        description="Learn Medicare basics from San Diego's trusted broker Ashley Watson. Plain-English explanations of Medicare Part A, B, C, and D. Free help for seniors in San Diego County. Call 619-947-2325."
        canonical="/medicare-basics/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}</script>
      </Helmet>
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="basics-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Medicare Education</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Medicare Basics — Explained Simply
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Medicare can seem overwhelming at first. Here's a plain-English guide to the different parts and what they cover — no insurance jargon required.
          </p>
        </div>
      </section>

      {/* Parts */}
      <section className="py-20 bg-background" data-testid="medicare-parts-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {parts.map((part) => (
              <Card key={part.label} className={`border-2 ${part.color}`} data-testid={`part-card-${part.label.toLowerCase()}`}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`shrink-0 ${part.accent} text-white rounded-xl px-4 py-2 text-sm font-bold font-sans`}>
                      {part.label}
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">{part.title}</h2>
                  </div>
                  <p className="text-foreground/80 text-lg leading-relaxed mb-5">{part.body}</p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">What it covers:</h3>
                      <ul className="space-y-2">
                        {part.covers.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/80">
                            <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4">
                      <h3 className="font-semibold text-foreground mb-2">Cost overview:</h3>
                      <p className="text-foreground/70 leading-relaxed text-sm">{part.cost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Periods */}
      <section className="py-20 bg-accent/30" data-testid="enrollment-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Medicare Enrollment Periods</h2>
          <p className="text-foreground/80 text-lg mb-10 leading-relaxed">
            Knowing <em>when</em> to enroll is just as important as knowing <em>what</em> to enroll in. Missing a deadline can mean paying higher premiums for life.
          </p>
          <div className="space-y-5">
            {enrollmentPeriods.map((ep, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-border" data-testid={`enrollment-period-${i}`}>
                <h3 className="font-serif font-semibold text-foreground text-xl mb-1">{ep.name}</h3>
                <p className="text-primary font-medium text-sm mb-2">{ep.timing}</p>
                <p className="text-foreground/70 leading-relaxed">{ep.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Timing matters more than people think</p>
              <p className="text-amber-800 leading-relaxed mb-3">
                Late enrollment penalties can increase your Part B premium by 10% for each 12-month period you were eligible but didn't enroll — and those penalties last for life. Ashley can help you figure out the right time to enroll based on your specific situation.
              </p>
              <Link href="/part-b-penalty-calculator" className="inline-flex items-center gap-1.5 text-amber-900 font-semibold text-sm underline underline-offset-2 hover:text-amber-700 transition-colors">
                Calculate your Part B penalty →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white" data-testid="basics-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
            Common Medicare Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-border rounded-xl p-6 bg-slate-50">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground" data-testid="basics-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">Still Have Questions?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Ashley is happy to walk through any of this with you at no charge. No question is too basic.
          </p>
          <Link href="/schedule">
            <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
              Talk to Ashley for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

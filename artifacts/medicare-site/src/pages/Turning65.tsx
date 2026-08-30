import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, ChevronRight, Clock } from "lucide-react";

export const faqs = [
  {
    q: "When should I enroll in Medicare when turning 65?",
    a: "Your Initial Enrollment Period (IEP) opens 3 months before your 65th birthday month and closes 3 months after — a 7-month window total. Enrolling in the 3 months before your birthday ensures your coverage starts the month you turn 65. If you enroll during or after your birthday month, your start date may be delayed.",
  },
  {
    q: "What happens if I miss my Medicare enrollment window at 65?",
    a: "If you don't sign up during your 7-month Initial Enrollment Period and don't have qualifying coverage elsewhere, you may face lifetime premium penalties and gaps in coverage. Part B penalties add 10% to your monthly premium for each 12-month period you were eligible but didn't enroll — and those penalties never go away.",
  },
  {
    q: "Do I have to take Medicare when I turn 65 if I still have employer coverage?",
    a: "No — if you're still working and have employer health coverage through an active employer (yours or your spouse's), you may be able to delay Medicare without penalty. The rules depend on the size of your employer. Once that employer coverage ends, you have a Special Enrollment Period of 8 months to sign up without penalty. Retiree coverage and COBRA do not protect you from penalties.",
  },
  {
    q: "Should I choose Original Medicare or Medicare Advantage when I turn 65?",
    a: "The right choice depends on your situation. Medicare Advantage (Part C) bundles hospital, medical, and often drug coverage in one plan, frequently with $0 premiums, but uses provider networks. Original Medicare lets you see any doctor who accepts Medicare nationwide and can be paired with a Medigap supplement and Part D drug plan. Comparing your doctors, medications, and how often you use care is essential before choosing.",
  },
  {
    q: "What is the Medigap enrollment window when turning 65?",
    a: "You have a guaranteed right to buy any Medicare Supplement (Medigap) plan during the first 6 months after you're enrolled in Part B. During this window, insurers cannot deny you or charge more based on your health history. After this window closes, insurers can medically underwrite you — meaning they can deny coverage or charge higher premiums based on pre-existing conditions.",
  },
  {
    q: "Is Medicare free when you turn 65?",
    a: "Part A is usually premium-free if you (or your spouse) worked and paid Medicare taxes for at least 10 years. However, Part B has a monthly premium set by Medicare each year. Even with Medicare, you'll have deductibles, copays, and coinsurance. Planning for these out-of-pocket costs is an important part of your Medicare decision.",
  },
  {
    q: "How do I pick the right Part D drug plan when turning 65?",
    a: "Each Part D plan has a formulary — a list of covered medications. Before choosing a plan, check that all your current prescriptions are on the plan's formulary, compare the copays or coinsurance for those drugs, and confirm your preferred pharmacy is in-network. Choosing a plan based on premium alone can result in paying far more than expected for your medications.",
  },
];


const steps = [
  {
    month: "3–6 Months Before Your Birthday",
    title: "Start Learning and Planning",
    items: [
      "Research the difference between Original Medicare and Medicare Advantage",
      "List all your current doctors and medications",
      "Think about your health priorities and how often you use medical care",
      "Contact Ashley Watson for a free, no-pressure consultation",
      "Check if your employer coverage ends when you turn 65",
    ],
  },
  {
    month: "3 Months Before Your Birthday",
    title: "Your Enrollment Window Opens",
    items: [
      "Your Initial Enrollment Period (IEP) begins 3 months before your 65th birthday month",
      "You can now sign up for Medicare Part A and Part B through Social Security",
      "This is the best time to enroll to ensure your coverage starts on your birthday",
      "Begin comparing Medicare Advantage or Supplement plans with Ashley",
    ],
  },
  {
    month: "The Month You Turn 65",
    title: "Coverage Can Begin",
    items: [
      "If you enrolled early, your Medicare coverage starts this month",
      "Confirm your Medicare card has arrived in the mail",
      "Finalize your Medicare Advantage or Supplement plan selection",
      "Enroll in a Part D drug plan if using Original Medicare",
    ],
  },
  {
    month: "After You're Enrolled",
    title: "Settle In and Stay Informed",
    items: [
      "Inform your doctors of your new Medicare plan",
      "Review your Explanation of Benefits (EOB) statements",
      "Mark your calendar for open enrollment each fall (Oct 15 – Dec 7)",
      "Call Ashley anytime with billing or claims questions",
    ],
  },
];

const mistakes = [
  {
    title: "Missing your Initial Enrollment Period",
    description: "If you don't sign up during your 7-month IEP and don't have qualifying coverage elsewhere, you may face lifetime premium penalties and gaps in coverage.",
  },
  {
    title: "Assuming you have to take Medicare at 65",
    description: "If you're still working and have employer health coverage, you may be able to delay Medicare without penalty. The rules depend on the size of your employer. Ashley can help you figure out your specific situation.",
  },
  {
    title: "Choosing a plan based on premium alone",
    description: "A low-premium plan can end up costing more in out-of-pocket expenses. It's important to look at the total picture — including deductibles, copays, and whether your doctors are in-network.",
  },
  {
    title: "Not checking if your drugs are covered",
    description: "Each drug plan has a formulary — a list of covered medications. If your prescriptions aren't on the list, you could pay far more than expected. Always check your medications before choosing a plan.",
  },
  {
    title: "Forgetting about Medigap enrollment rules",
    description: "You have a guaranteed right to buy a Medicare Supplement (Medigap) plan during your first 6 months on Part B. After that, insurers can deny you or charge more based on your health history. This window is critically important.",
  },
  {
    title: "Thinking Medicare is free",
    description: "While Part A is usually premium-free, Part B has a monthly premium. And even with Medicare, you'll have deductibles, copays, and coinsurance. Planning for these costs is essential.",
  },
];

const checklist = [
  "Request your Social Security statement to confirm your work history",
  "Decide between Original Medicare vs. Medicare Advantage",
  "Compare Medicare Supplement plans if using Original Medicare",
  "Compare Part D drug plans based on your current medications",
  "Confirm your preferred doctors accept Medicare",
  "Set up a My Medicare account at Medicare.gov",
  "Review your current prescriptions with Ashley for drug plan comparison",
  "Understand the coordination of benefits if you have other insurance",
  "Schedule your free 'Welcome to Medicare' preventive visit after enrolling",
];

export default function Turning65() {
  return (
    <div>
      <SEOHead
        title="Turning 65 & Medicare in San Diego | Free Enrollment Help | Medicare with Ashley"
        description="Turning 65 in San Diego, Chula Vista, El Cajon, or Escondido? Get free Medicare enrollment help from Ashley Watson. Avoid late penalties and find the right plan. Call 619-947-2325."
        canonical="/turning-65/"
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
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="t65-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Turning 65</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Turning 65? Here's What You Need to Know About Medicare
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Your 65th birthday is a Medicare milestone. This guide walks you through what to do, when to do it, and the common mistakes that catch people off guard.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-background" data-testid="steps-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Step-by-Step Timeline</h2>
          <p className="text-foreground/80 text-lg mb-10 leading-relaxed">
            Here's a practical roadmap for the months around your 65th birthday.
          </p>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5" data-testid={`step-${i}`}>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-full bg-border mt-2 min-h-8" />}
                </div>
                <Card className="flex-1 border border-border shadow-sm mb-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium text-sm">{step.month}</span>
                    </div>
                    <h3 className="font-serif font-semibold text-foreground text-xl mb-4">{step.title}</h3>
                    <ul className="space-y-2">
                      {step.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-foreground/80">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-20 bg-accent/30" data-testid="checklist-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Turning 65 Medicare Checklist</h2>
          <p className="text-foreground/80 text-lg mb-8 leading-relaxed">
            Use this checklist to make sure you haven't missed anything important.
          </p>
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-8">
              <ul className="space-y-4">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-3" data-testid={`checklist-item-${i}`}>
                    <div className="w-5 h-5 border-2 border-primary rounded shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground/80 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-muted-foreground text-sm italic">Ashley can walk through this entire checklist with you in a single free consultation — usually less than an hour.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mistakes */}
      <section className="py-20 bg-background" data-testid="mistakes-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Common Medicare Mistakes to Avoid</h2>
          <p className="text-foreground/80 text-lg mb-10 leading-relaxed">
            These are the mistakes Ashley sees most often — and that are entirely avoidable with a little planning.
          </p>
          <div className="space-y-5">
            {mistakes.map((m, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4" data-testid={`mistake-${i}`}>
                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 text-lg mb-1">{m.title}</h3>
                  <p className="text-amber-800 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white" data-testid="t65-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
            Common Questions About Turning 65 and Medicare
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

      <section className="py-20 bg-primary text-primary-foreground" data-testid="t65-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">Turning 65 Soon?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Don't navigate this alone. Ashley offers free consultations specifically for people approaching their 65th birthday — with no pressure to buy anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
                Schedule a Free Consultation
              </Button>
            </Link>
            <Link href="/medicare-basics">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-10 py-4 h-auto rounded-full bg-transparent">
                Read Medicare Basics
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

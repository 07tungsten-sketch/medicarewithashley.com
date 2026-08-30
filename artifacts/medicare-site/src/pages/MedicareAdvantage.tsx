import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, X, ChevronRight, Info } from "lucide-react";

const pros = [
  "Low or $0 monthly premiums (beyond Part B premium)",
  "All-in-one convenience — A, B, and often D together",
  "Extra benefits like dental, vision, hearing, and fitness",
  "Annual out-of-pocket maximum protects you from catastrophic costs",
  "Coordinated care often built into the plan design",
  "Many plans include transportation and meal programs",
];

const cons = [
  "Usually requires you to use a network of doctors and hospitals",
  "Referrals may be required to see specialists",
  "Coverage is limited to your plan's service area",
  "Benefits and networks change annually",
  "Prior authorization may be required for certain procedures",
  "May not be accepted by all specialists or facilities nationwide",
];

const planTypes = [
  {
    name: "HMO (Health Maintenance Organization)",
    description: "You must use doctors and hospitals in the plan's network. A primary care doctor coordinates all your care and provides referrals to specialists. Usually the lowest-cost option.",
  },
  {
    name: "PPO (Preferred Provider Organization)",
    description: "You can see any doctor, but pay less when you use in-network providers. No referrals needed for specialists. More flexibility but typically higher premiums.",
  },
  {
    name: "PFFS (Private Fee-for-Service)",
    description: "The plan decides how much it pays doctors. You can see any Medicare-approved provider who agrees to the plan's terms. Less common today.",
  },
  {
    name: "SNP (Special Needs Plans)",
    description: "Designed for people with specific chronic conditions, dual Medicare-Medicaid eligibility, or who live in institutions. Tailored benefits for specific health needs.",
  },
];

const goodFor = [
  "People who want an all-in-one plan with one ID card",
  "Those who want extra benefits like dental and vision",
  "People comfortable with using in-network providers",
  "Those looking for lower out-of-pocket monthly costs",
  "People in good health who don't use many specialist services",
];

const notIdealFor = [
  "Frequent travelers who need nationwide access to providers",
  "People with complex health conditions requiring specialist access",
  "Those who strongly prefer to choose any doctor nationwide",
  "People who want predictable, consistent costs for serious illness",
];

export default function MedicareAdvantage() {
  return (
    <div>
      <SEOHead
        title="Medicare Advantage Plans San Diego County | Free Comparison | Medicare with Ashley"
        description="Compare Medicare Advantage plans in San Diego, Chula Vista, El Cajon, and Escondido. Ashley Watson is an independent broker — she finds the best plan for your doctors and budget. Free consultation."
        canonical="/medicare-advantage/"
      />
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="advantage-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Medicare Part C</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Medicare Advantage — Is It Right for You?
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Medicare Advantage plans are the most popular alternative to Original Medicare. Here's an honest look at what they offer — and where they fall short.
          </p>
        </div>
      </section>

      {/* What Is It */}
      <section className="py-20 bg-background" data-testid="what-is-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">What Is Medicare Advantage?</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed mb-8">
            <p>
              Medicare Advantage (Part C) plans are offered by private insurance companies approved by Medicare. Instead of getting your Medicare benefits directly from the federal government, you get them through the private insurer.
            </p>
            <p>
              By law, Medicare Advantage plans must cover everything that Original Medicare (Parts A and B) covers. Most plans also include Part D prescription drug coverage and many offer extra benefits — like dental, vision, hearing, and fitness programs — that Original Medicare doesn't cover.
            </p>
            <p>
              In San Diego County, there are typically dozens of Medicare Advantage plans available each year. Ashley compares all of them to help you find the one that works best for your specific doctors, medications, and budget.
            </p>
          </div>
          <div className="bg-accent/40 rounded-2xl p-8 flex gap-4">
            <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground/80 text-lg leading-relaxed">
              <strong>Important:</strong> Even on a Medicare Advantage plan, you still pay your monthly Part B premium to Medicare. The "free" or low-cost premiums you see advertised are in addition to — not instead of — your Part B premium.
            </p>
          </div>
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="py-20 bg-accent/20" data-testid="pros-cons-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10">Honest Pros and Cons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-7">
                <h3 className="font-serif font-semibold text-foreground text-xl mb-5 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-[#5d8a00]" /> Advantages
                </h3>
                <ul className="space-y-3">
                  {pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80" data-testid={`pro-${i}`}>
                      <CheckCircle className="h-5 w-5 text-[#5d8a00] shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-7">
                <h3 className="font-serif font-semibold text-foreground text-xl mb-5 flex items-center gap-2">
                  <X className="h-6 w-6 text-amber-600" /> Limitations
                </h3>
                <ul className="space-y-3">
                  {cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80" data-testid={`con-${i}`}>
                      <X className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plan Types */}
      <section className="py-20 bg-background" data-testid="plan-types-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Types of Medicare Advantage Plans</h2>
          <p className="text-foreground/80 text-lg mb-8 leading-relaxed">
            Not all Medicare Advantage plans work the same way. Here are the main types:
          </p>
          <div className="space-y-5">
            {planTypes.map((pt, i) => (
              <div key={i} className="bg-accent/30 rounded-xl p-6 border border-accent" data-testid={`plan-type-${i}`}>
                <h3 className="font-serif font-semibold text-foreground text-xl mb-2">{pt.name}</h3>
                <p className="text-foreground/80 leading-relaxed">{pt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's Good For */}
      <section className="py-20 bg-accent/20" data-testid="good-for-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10">Is Medicare Advantage Right for You?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground text-xl mb-4 text-[#0F2044]">May be a good fit if you...</h3>
              <ul className="space-y-3">
                {goodFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80" data-testid={`good-for-${i}`}>
                    <CheckCircle className="h-5 w-5 text-[#5d8a00] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-xl mb-4 text-amber-700">May not be ideal if you...</h3>
              <ul className="space-y-3">
                {notIdealFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/80" data-testid={`not-ideal-${i}`}>
                    <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 text-foreground/70 text-base italic leading-relaxed">
            The "right" choice depends entirely on your health situation, budget, and preferences. Ashley can compare your specific options — including which plans cover your doctors and medications — completely free of charge.
          </p>
        </div>
      </section>

      {/* San Diego Health System Callout */}
      <section className="py-20 bg-background" data-testid="sd-health-system-callout">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Check Your San Diego Health System</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed mb-10">
            <p>
              One of the most important questions when choosing a Medicare Advantage plan in San Diego is whether your preferred health system participates in the plan's network. Not every plan contracts with every hospital system — and that can change from year to year.
            </p>
            <p>
              Before enrolling in any Medicare Advantage plan, it's worth confirming that your preferred doctors and facilities are in-network — and understanding what out-of-network care would cost if your needs change.
            </p>
          </div>
          <div className="space-y-6">
            {/* Sharp */}
            <div className="bg-accent/40 rounded-2xl p-8" data-testid="sharp-callout">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Sharp HealthCare</h3>
              <p className="text-foreground/80 text-lg leading-relaxed mb-5">
                Sharp is San Diego's largest integrated health system, with eight hospitals and hundreds of affiliated physicians. Whether a Medicare Advantage plan includes Sharp in its network varies by insurer and plan type — and can change each year. Always confirm your specific doctors before enrolling.
              </p>
              <Link href="/sharp-healthcare-medicare-san-diego">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-semibold rounded-full px-6">
                  Sharp HealthCare &amp; Medicare Advantage
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Scripps */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8" data-testid="scripps-callout">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Scripps Health — Important Network Change</h3>
              <p className="text-foreground/80 text-lg leading-relaxed mb-5">
                <strong>Scripps Clinic and Scripps Coastal Medical Group have stopped accepting most Medicare Advantage plans.</strong> Many Advantage members can no longer use those Scripps physician groups for their care. If keeping your Scripps doctors is important, this is the kind of change you don't want to discover after enrolling. For most people who want to stay with Scripps, Original Medicare paired with a Medigap plan is now the more dependable path.
              </p>
              <Link href="/scripps-health-medicare-san-diego">
                <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50 font-semibold rounded-full px-6">
                  Scripps Health &amp; Medicare — Full Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* UCSD */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8" data-testid="ucsd-callout">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">UC San Diego Health — Narrowing Advantage Access</h3>
              <p className="text-foreground/80 text-lg leading-relaxed mb-5">
                UCSD accepts only a limited set of Medicare Advantage plans, and that set has been shrinking. For 2026, its in-network Advantage access is significantly reduced — some plans that worked before no longer provide the same access, and certain plans cover only specialty services rather than primary care. Verifying your specific plan before you enroll is essential.
              </p>
              <Link href="/uc-san-diego-health-medicare">
                <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50 font-semibold rounded-full px-6">
                  UC San Diego Health &amp; Medicare — Full Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/schedule">
              <Button className="bg-primary text-primary-foreground font-semibold rounded-full px-8">
                Check Your Plan's Network with Ashley
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground" data-testid="advantage-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">Want to See What's Available in San Diego?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Ashley can run a free side-by-side comparison of Medicare Advantage plans available in your area — based on your doctors and medications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
                Get a Free Plan Comparison
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/carriers">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Compare Medicare Advantage carriers
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

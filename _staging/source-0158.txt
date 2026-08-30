import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronRight, Info } from "lucide-react";

const popularPlans = [
  {
    name: "Plan G",
    popular: true,
    description: "The most comprehensive Medigap plan available to new Medicare enrollees. Covers almost everything except the Part B deductible. Very popular for predictable healthcare costs.",
    covers: ["Part A deductible", "Part A coinsurance", "Part B coinsurance", "Part B excess charges", "Skilled nursing coinsurance", "Foreign travel emergency (up to limits)"],
  },
  {
    name: "Plan N",
    popular: true,
    description: "A lower-premium alternative to Plan G. You pay small copays for some office visits and emergency room visits, but enjoy broad coverage otherwise.",
    covers: ["Part A deductible", "Part A coinsurance", "Part B coinsurance (with small copays)", "Skilled nursing coinsurance", "Foreign travel emergency (up to limits)"],
  },
  {
    name: "Plan K",
    popular: false,
    description: "Covers a portion (50%) of many Medicare costs. Lower premiums but higher potential out-of-pocket costs. Has an annual out-of-pocket maximum.",
    covers: ["50% of Part A deductible", "50% of coinsurance costs", "Annual out-of-pocket limit once reached"],
  },
  {
    name: "Plan F (grandfathered)",
    popular: false,
    description: "Was the most comprehensive plan available. Only available to people who became Medicare eligible before January 1, 2020. Covers Part B deductible.",
    covers: ["Everything Plan G covers, plus the Part B deductible"],
  },
];

const advantages = [
  "Visit any doctor or hospital in the U.S. that accepts Medicare — no networks",
  "Your costs are predictable — you know exactly what you'll pay",
  "No referrals needed to see specialists",
  "Coverage works everywhere in the country — great for travelers",
  "Plans are standardized — the same letter plan has the same benefits regardless of insurer",
  "No prior authorization requirements",
];

const considerations = [
  "Monthly premiums in addition to your Part B premium",
  "Does not include prescription drug coverage — you'll need a separate Part D plan",
  "Not available if you enroll in Medicare Advantage",
  "Premiums can increase over time as you age",
  "Applying after your Medigap Open Enrollment may require health underwriting",
];

export default function MedicareSupplements() {
  return (
    <div>
      <SEOHead
        title="Medicare Supplement Plans San Diego | Medigap Broker | Medicare with Ashley"
        description="Find the best Medicare Supplement (Medigap) plan in San Diego County. Ashley Watson compares plans from multiple carriers to find the lowest premium. Free, no-pressure consultation. Call 619-947-2325."
        canonical="/medicare-supplements/"
      />
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="supplements-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Medigap Plans</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Medicare Supplement Plans — Filling the Gaps
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Original Medicare doesn't cover everything. Medicare Supplement plans (also called Medigap) help pick up costs that Medicare leaves behind.
          </p>
        </div>
      </section>

      {/* What Is Medigap */}
      <section className="py-20 bg-background" data-testid="what-is-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">What Is a Medicare Supplement Plan?</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed mb-8">
            <p>
              With Original Medicare, you typically pay 20% of most medical costs after your deductible — with no cap on how much that 20% could add up to. A Medicare Supplement plan pays some or all of that remaining 20%, depending on the plan type you choose.
            </p>
            <p>
              Medigap plans are sold by private insurance companies but are standardized by the federal government. This means a Plan G from one insurer covers exactly the same things as a Plan G from another insurer — the only difference is the monthly premium and the company's reputation for service.
            </p>
            <p>
              In San Diego, Ashley compares Medigap premiums from multiple carriers to find you the same coverage at the lowest possible price.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
            <Info className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-900 leading-relaxed">
              <strong>Critical timing alert:</strong> You have a guaranteed right to buy any Medigap plan during your 6-month Medigap Open Enrollment Period — which starts the month you turn 65 and are enrolled in Part B. After this window, insurers can deny coverage or charge more based on your health. Don't miss it.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Plans */}
      <section className="py-20 bg-accent/20" data-testid="plans-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Most Common Medigap Plans</h2>
          <p className="text-foreground/80 text-lg mb-10 leading-relaxed">
            There are 10 standardized Medigap plans (labeled A through N). Here are the most popular ones:
          </p>
          <div className="space-y-6">
            {popularPlans.map((plan, i) => (
              <Card key={i} className={`border-2 ${plan.popular ? "border-primary/40 bg-white" : "border-border bg-white"} shadow-sm`} data-testid={`plan-${plan.name.toLowerCase().replace(" ", "-")}`}>
                <CardContent className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary text-primary-foreground font-bold rounded-lg px-4 py-1.5 text-sm">
                      {plan.name}
                    </span>
                    {plan.popular && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium rounded-full px-3 py-1">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/80 text-lg leading-relaxed mb-5">{plan.description}</p>
                  <h4 className="font-semibold text-foreground mb-3">What it covers:</h4>
                  <ul className="space-y-2">
                    {plan.covers.map((c, j) => (
                      <li key={j} className="flex items-start gap-3 text-foreground/80">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages & Considerations */}
      <section className="py-20 bg-background" data-testid="advantages-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10">Advantages &amp; Considerations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-md bg-blue-50 border-blue-100">
              <CardContent className="p-7">
                <h3 className="font-serif font-semibold text-foreground text-xl mb-5">Why People Love Medigap</h3>
                <ul className="space-y-3">
                  {advantages.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80" data-testid={`advantage-${i}`}>
                      <CheckCircle className="h-5 w-5 text-[#5d8a00] shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md bg-white">
              <CardContent className="p-7">
                <h3 className="font-serif font-semibold text-foreground text-xl mb-5">Things to Consider</h3>
                <ul className="space-y-3">
                  {considerations.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80" data-testid={`consideration-${i}`}>
                      <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground" data-testid="supplements-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">Compare Medigap Plans in San Diego</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            The same Plan G from 10 different companies — Ashley finds you the lowest premium. Free, no-obligation comparison.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
                Get a Free Medigap Comparison
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/carriers">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Compare Medicare Supplement carriers
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DVH-CROSSLINK-SUPPLEMENT-START */}
      <section className="py-12 bg-accent/50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Medigap doesn&rsquo;t cover dental, vision, or hearing</h2>
          <p className="text-foreground/80 leading-relaxed mb-5">
            Original Medicare and your Medicare Supplement leave out routine dental, vision, and hearing care &mdash; no cleanings, no glasses, no hearing aids. A standalone plan can fill that gap. Here&rsquo;s how the two options I work with compare.
          </p>
          <Link href="/medicare-dental-vision-hearing-san-diego">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 py-3 h-auto rounded-full">
              Explore Dental, Vision &amp; Hearing coverage &rarr;
            </Button>
          </Link>
        </div>
      </section>
      {/* DVH-CROSSLINK-SUPPLEMENT-END */}
    </div>
  );
}

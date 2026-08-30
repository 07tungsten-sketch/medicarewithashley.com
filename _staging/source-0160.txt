import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, ChevronRight, Info } from "lucide-react";

const phases = [
  {
    name: "Deductible Phase",
    description: "At the start of the year, you pay 100% of your drug costs until you meet the plan's annual deductible. Not all plans have a deductible.",
    cost: "Up to $590 in 2025 (varies by plan)",
  },
  {
    name: "Initial Coverage Phase",
    description: "After meeting your deductible, you share costs with the plan through copays or coinsurance for each prescription.",
    cost: "Your copay or coinsurance per drug tier",
  },
  {
    name: "Catastrophic Coverage Phase",
    description: "Once your total drug spending (what you and the plan pay) reaches a threshold, you enter catastrophic coverage and pay a small copay or coinsurance for the rest of the year.",
    cost: "Small copay or coinsurance for the rest of the year",
  },
];

const tips = [
  {
    title: "Compare based on your actual medications",
    body: "Each Part D plan has a formulary — a list of covered drugs. The best plan for you depends entirely on which drugs you take. A plan with a $0 premium could still cost you thousands if your medications aren't covered well.",
  },
  {
    title: "Check your preferred pharmacy",
    body: "Part D plans often have preferred pharmacy networks. Using a preferred pharmacy can significantly lower your out-of-pocket costs. Ashley checks whether plans work with your preferred pharmacy.",
  },
  {
    title: "Don't skip Part D if you're healthy",
    body: "Even if you don't take many prescriptions now, enrolling in Part D when you're first eligible avoids a late enrollment penalty — 1% of the national base premium for every month you delayed.",
  },
  {
    title: "Review your plan every year",
    body: "Drug plans change their formularies, copays, and premiums each year. Ashley reviews your coverage each fall to make sure you're still in the best plan for your medications.",
  },
];

export default function PrescriptionDrugPlans() {
  return (
    <div>
      <SEOHead
        title="Medicare Part D Drug Plans San Diego County | Medicare with Ashley"
        description="Find the best Medicare Part D prescription drug plan in San Diego County. Ashley Watson compares plans based on your specific medications. Free, no-pressure consultation. Call 619-947-2325."
        canonical="/prescription-drug-plans/"
      />
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="partd-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Medicare Part D</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Prescription Drug Plans — What You Need to Know
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Original Medicare doesn't cover most prescription drugs. Part D fills that gap — but choosing the right plan for your specific medications matters a lot.
          </p>
        </div>
      </section>

      {/* What Is Part D */}
      <section className="py-20 bg-background" data-testid="what-is-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">What Is Medicare Part D?</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed mb-8">
            <p>
              Medicare Part D is voluntary prescription drug coverage offered by private insurance companies that contract with Medicare. It helps pay for prescription medications at pharmacies and sometimes by mail order.
            </p>
            <p>
              You can get Part D coverage two ways: as a standalone plan added to Original Medicare, or bundled into a Medicare Advantage plan that includes drug coverage (called MA-PD plans). Either way, the coverage is administered by a private insurer.
            </p>
            <p>
              In San Diego County, there are typically many Part D standalone plans available each year. Ashley compares all of them using your actual drug list to find you the lowest total annual cost — not just the lowest premium.
            </p>
            <p>
              If you are trying to understand how the Medicare GLP-1 Bridge fits alongside Part D coverage, read our guide to <Link href="/blog/medicare-glp1-bridge-denied" className="text-primary font-medium underline underline-offset-2 hover:text-primary/80">why an initial pharmacy rejection is usually not a coverage denial</Link>.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Don't delay enrollment</p>
              <p className="text-amber-800 leading-relaxed mb-3">
                If you don't enroll in Part D when you're first eligible and you don't have other creditable drug coverage, you may pay a late enrollment penalty for as long as you have Medicare Part D. The penalty adds 1% of the national base premium for each month you went without coverage.
              </p>
              <Link href="/part-d-penalty-calculator" className="inline-flex items-center gap-1.5 text-amber-900 font-semibold text-sm underline underline-offset-2 hover:text-amber-700 transition-colors">
                Calculate your penalty →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-accent/20" data-testid="how-it-works-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">How Part D Coverage Works</h2>
          <p className="text-foreground/80 text-lg mb-10 leading-relaxed">
            Part D coverage is divided into phases. Your total costs depend on how expensive your medications are and which phase you're in.
          </p>
          <div className="space-y-5">
            {phases.map((phase, i) => (
              <Card key={i} className="border border-border shadow-sm bg-white" data-testid={`phase-${i}`}>
                <CardContent className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground text-xl mb-2">{phase.name}</h3>
                      <p className="text-foreground/80 leading-relaxed mb-3">{phase.description}</p>
                      <div className="inline-flex items-center gap-2 bg-accent rounded-lg px-4 py-2">
                        <span className="text-primary font-medium text-sm">{phase.cost}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulary Explained */}
      <section className="py-20 bg-background" data-testid="formulary-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Understanding Drug Tiers and Formularies</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed mb-8">
            <p>
              Each Part D plan has a formulary — a list of covered drugs organized into tiers. Generic drugs are typically in lower tiers with lower copays. Brand-name and specialty drugs are in higher tiers and cost more.
            </p>
            <p>
              Before choosing a plan, it's essential to check that your specific medications are on the formulary and at what tier. A plan with a low premium might charge you significantly more for your drugs than a plan with a slightly higher premium.
            </p>
          </div>
          <div className="bg-accent/40 rounded-xl p-6 flex gap-4">
            <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <p className="text-foreground/80 text-lg leading-relaxed">
              <strong>This is where Ashley's help is most valuable.</strong> She enters your actual medications into a plan comparison tool and shows you the real annual cost of each plan — premium + copays combined. This often reveals that the "cheap" plan is actually more expensive.
            </p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-20 bg-accent/20" data-testid="tips-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-10">Smart Part D Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tips.map((tip, i) => (
              <Card key={i} className="border-0 shadow-md bg-white" data-testid={`tip-${i}`}>
                <CardContent className="p-7">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <h3 className="font-serif font-semibold text-foreground text-lg">{tip.title}</h3>
                  </div>
                  <p className="text-foreground/80 leading-relaxed pl-9">{tip.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground" data-testid="partd-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">Find the Right Drug Plan for Your Medications</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Share your current medication list with Ashley and she'll find the Part D plan that covers your drugs at the lowest total annual cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
                Get a Free Drug Plan Review
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/carriers">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Compare Part D carriers
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

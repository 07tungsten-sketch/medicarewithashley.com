import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, ChevronDown, Info, Phone } from "lucide-react";

const faqItems = [
  {
    q: "Can I have both Medicare and Medi-Cal?",
    a: "Yes. People who qualify for both are called 'dual eligible,' and the combination can dramatically reduce healthcare costs. Medi-Cal acts as secondary coverage — it fills in gaps that Medicare leaves, such as copays, deductibles, and premiums. Ashley helps San Diego County residents determine if they qualify and how to coordinate both programs.",
  },
  {
    q: "What is Extra Help and how do I apply in San Diego?",
    a: "Extra Help (also called the Low Income Subsidy) is a federal program that helps pay Medicare Part D prescription drug costs — including premiums, deductibles, and copays at the pharmacy. People who qualify for both Medicare and Medi-Cal, or for a Medicare Savings Program, often qualify for Extra Help automatically. Others can apply through the Social Security Administration. Ashley checks Extra Help eligibility at no cost as part of every consultation.",
  },
  {
    q: "Do I need to pay a broker to help with dual coverage?",
    a: "No. Ashley's services are 100% free to you. She is paid by the insurance carriers she represents, and her commission is the same regardless of which plan you choose — so her only incentive is finding what genuinely fits your situation. There is no charge for her help with dual-eligible options, Extra Help eligibility checks, or IRMAA appeal guidance.",
  },
  {
    q: "What is a D-SNP plan?",
    a: "A Dual Special Needs Plan (D-SNP) is a type of Medicare Advantage plan designed specifically for people who have both Medicare and Medi-Cal. D-SNPs coordinate care across both programs and often include additional benefits beyond standard Medicare Advantage. Because benefits and plan availability change each year, Ashley reviews available options annually to make sure each client is enrolled in a plan that still fits their needs.",
  },
];

const mspPrograms = [
  {
    name: "Qualified Medicare Beneficiary (QMB)",
    desc: "Pays your Part A and Part B premiums, deductibles, and copays. QMB status also automatically qualifies you for Extra Help with Part D prescription costs.",
  },
  {
    name: "Specified Low-Income Medicare Beneficiary (SLMB)",
    desc: "Pays your Medicare Part B premium only.",
  },
  {
    name: "Qualifying Individual (QI)",
    desc: "Pays most of your Medicare Part B premium.",
  },
];

const localResources = [
  {
    name: "HICAP — Health Insurance Counseling and Advocacy Program",
    desc: "California's State Health Insurance Assistance Program (SHIP). HICAP provides free, unbiased Medicare counseling through trained volunteer counselors. San Diego County residents can contact the local HICAP office to schedule an appointment at no cost.",
  },
  {
    name: "San Diego County Health and Human Services Agency (HHSA)",
    desc: "The county agency that processes Medi-Cal applications for San Diego residents. You can apply in person, by mail, or online. Ashley can help you prepare your application and gather the documentation you'll need.",
  },
  {
    name: "Social Security Administration (SSA)",
    desc: "Handles Extra Help (LIS) applications and IRMAA appeals. You can apply online at ssa.gov, by phone, or in person at a local SSA office.",
  },
];

export default function DualEligible() {
  return (
    <div>
      <SEOHead
        title="Medicare and Medi-Cal Help in San Diego | Dual Eligible & Extra Help"
        description="Ashley Watson helps San Diego County residents who qualify for both Medicare and Medi-Cal understand their options — including D-SNPs, Extra Help, and Medicare Savings Programs. Free consultations. Call (619) 947-2325."
        canonical="/medicare-medi-cal-dual-eligible-san-diego/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a,
            },
          })),
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="dual-eligible-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Dual Eligible &amp; Extra Help</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            Medicare + Medi-Cal in San Diego: Help for Dual-Eligible Residents
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Ashley Watson specializes in helping San Diego County residents who qualify for both Medicare and Medi-Cal understand how the two programs work together — including residents of Chula Vista, National City, and South Bay.
          </p>
        </div>
      </section>

      {/* What dual eligible means */}
      <section className="py-20 bg-background" data-testid="what-dual-eligible-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">What Does "Dual Eligible" Mean in Plain English?</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
            <p>
              "Dual eligible" simply means you qualify for both Medicare and Medi-Cal at the same time. Medicare is the federal health insurance program for people 65 and older, and for certain people with disabilities. Medi-Cal is California's Medicaid program, which provides health coverage based on income and assets.
            </p>
            <p>
              When you have both, Medi-Cal typically acts as a secondary payer — it fills in costs that Medicare doesn't cover, such as copays, deductibles, and Part B premiums. For many San Diego County residents, this combination results in very low or zero out-of-pocket healthcare costs.
            </p>
            <p>
              Many people don't realize they may qualify — especially those on a fixed income, receiving Supplemental Security Income (SSI), or with limited assets. California has relatively generous Medi-Cal eligibility thresholds, and Ashley checks current eligibility as part of every consultation.
            </p>
          </div>
        </div>
      </section>

      {/* How Medi-Cal works alongside Medicare */}
      <section className="py-20 bg-accent/20" data-testid="msp-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">How Medi-Cal Works Alongside Medicare in California</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed mb-8">
            <p>
              With full dual eligibility, Medi-Cal can cover your Medicare Part B premium, deductibles, and copays for Medicare-covered services. The extent of that coverage depends on your specific Medi-Cal eligibility level.
            </p>
            <p>
              Even if you don't qualify for full Medi-Cal, you may qualify for a <strong>Medicare Savings Program (MSP)</strong> — a state program that helps pay some or all of your Medicare costs:
            </p>
          </div>
          <div className="space-y-4 mb-8">
            {mspPrograms.map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-border">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-foreground/70 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
            <Info className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-900 leading-relaxed">
              <strong>Income limits change periodically.</strong> Ashley checks current thresholds as part of every consultation. If you're on a fixed income, it's worth asking even if you've been told you don't qualify before — the rules have changed in recent years.
            </p>
          </div>
        </div>
      </section>

      {/* D-SNPs */}
      <section className="py-20 bg-background" data-testid="dsnp-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Dual Special Needs Plans (D-SNPs) — General Overview</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
            <p>
              If you're dual eligible, you may be able to enroll in a <strong>Dual Special Needs Plan (D-SNP)</strong> — a type of Medicare Advantage plan specifically designed for people who have both Medicare and Medi-Cal. D-SNPs are intended to coordinate care across both programs, which can simplify the process of using both types of coverage.
            </p>
            <p>
              D-SNP features can include coordinated care management, low or no premiums, and supplemental benefits beyond what standard Medicare covers. Because D-SNP benefits and plan availability change year to year, Ashley reviews available options for each client annually to ensure continued fit.
            </p>
            <p>
              Not every dual-eligible person is best served by a D-SNP. For some clients — particularly those with established relationships with specialists who don't participate in Advantage networks — Original Medicare with Medi-Cal acting as secondary coverage may be a better fit. Ashley evaluates each situation individually.
            </p>
          </div>
        </div>
      </section>

      {/* Extra Help */}
      <section className="py-20 bg-accent/20" data-testid="extra-help-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">The Extra Help Program for Prescription Costs</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed mb-6">
            <p>
              Extra Help — also called the Low Income Subsidy (LIS) — is a federal program that helps people with Medicare pay for Part D prescription drug costs, including the annual deductible, monthly premiums, and copays at the pharmacy.
            </p>
            <p>
              People who qualify for both Medicare and Medi-Cal, or for a Medicare Savings Program, typically qualify for Extra Help automatically. Others can apply directly through the Social Security Administration. Ashley checks Extra Help eligibility for every client she works with, and she helps eligible clients understand how it applies to their specific plan enrollment — at no charge.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
            <p className="text-blue-900 leading-relaxed">
              <strong>No cost to check:</strong> Determining Extra Help eligibility and navigating the application is part of Ashley's free consultation service for San Diego County residents.
            </p>
          </div>
        </div>
      </section>

      {/* IRMAA */}
      <section className="py-20 bg-background" data-testid="irmaa-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">IRMAA and Medicare Premium Adjustments</h2>
          <div className="text-foreground/80 text-lg leading-relaxed">
            <p>
              Some Medicare beneficiaries with higher incomes pay more for their Part B and Part D premiums through an Income-Related Monthly Adjustment Amount (IRMAA). IRMAA is calculated based on your income from two years prior, which can create hardship when income has recently decreased — for example, due to retirement, the death of a spouse, or another qualifying life event. If your income has dropped, you may be able to appeal your IRMAA determination using Form SSA-44. Ashley can walk you through when an appeal makes sense and what documentation a successful appeal typically requires.
            </p>
          </div>
        </div>
      </section>

      {/* Free local resources */}
      <section className="py-20 bg-accent/20" data-testid="local-resources-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Free Local Resources in San Diego County</h2>
          <p className="text-foreground/80 text-lg leading-relaxed mb-8">
            San Diego County residents have access to several free, unbiased resources in addition to working with Ashley:
          </p>
          <div className="space-y-4">
            {localResources.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <h3 className="font-serif font-semibold text-foreground text-lg mb-2">{item.name}</h3>
                <p className="text-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background" data-testid="dual-eligible-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group border border-border rounded-xl px-6 bg-card shadow-sm"
                data-testid={`dual-faq-${i}`}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-serif font-semibold text-foreground text-lg leading-snug">{item.q}</h3>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-foreground/80 text-base pb-5 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="dual-eligible-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">
            Find Out If You Qualify — Free Help Available
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            If you're a San Diego County resident on Medicare with a limited income, you may be leaving significant benefits on the table. Ashley can help you determine whether you qualify for Medi-Cal, a Medicare Savings Program, Extra Help, or a D-SNP — at absolutely no cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full shadow-md">
                Schedule a Free Review
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:+16199472325">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-10 py-4 h-auto rounded-full bg-transparent">
                <Phone className="mr-2 h-5 w-5" />
                Call (619) 947-2325
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CMS Disclaimer */}
      <section className="py-10 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            We do not offer every plan available in your area. Currently, we represent 8 organizations which offer 75 products in your area. Please contact{" "}
            <a href="https://www.medicare.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/80">Medicare.gov</a>,{" "}
            1-800-MEDICARE, or your local State Health Insurance Assistance Program (SHIP) to get information on all of your options.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is a proprietary website and is not associated, endorsed or authorized by the Social Security Administration, the Department of Health and Human Services or the Center for Medicare and Medicaid Services. This site contains decision-support content and information about Medicare, services related to Medicare and services for people with Medicare. If you would like to find more information about the Medicare program please visit the Official U.S. Government Site for People with Medicare at{" "}
            <a href="https://www.medicare.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/80">www.medicare.gov</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

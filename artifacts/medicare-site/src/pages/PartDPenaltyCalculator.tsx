import { useState } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, ChevronRight, Calculator, Phone } from "lucide-react";
import {
  buildCalculatorApplicationSchema,
  buildCalculatorFaqSchema,
} from "@/lib/calculatorStructuredData";

const BASE_PREMIUM_2026 = 38.99;
const BASE_PREMIUM_YEAR = 2026;
const EXAMPLE_MONTHS = 14;

function calcPenalty(months: number): { monthly: number; annual: number } {
  const raw = 0.01 * BASE_PREMIUM_2026 * months;
  const monthly = Math.round(raw * 10) / 10;
  return { monthly, annual: Math.round(monthly * 12 * 100) / 100 };
}

const EXAMPLE_RAW = 0.01 * BASE_PREMIUM_2026 * EXAMPLE_MONTHS;
const EXAMPLE_MONTHLY = calcPenalty(EXAMPLE_MONTHS).monthly;

export const faqs = [
  {
    q: "What counts as 'creditable' drug coverage?",
    a: "Coverage is creditable if it's expected to pay at least as much as Medicare's standard Part D plan. This includes most employer/union plans, TRICARE, VA coverage, FEHB, and Indian Health Service coverage. Your plan must send you a notice each year confirming whether it's creditable.",
  },
  {
    q: "When does the penalty start?",
    a: "The penalty clock starts the month after your Initial Enrollment Period ends if you don't have creditable coverage. It continues until you enroll in a Part D plan.",
  },
  {
    q: "Is the penalty permanent?",
    a: "Yes — you pay the penalty for as long as you have Medicare drug coverage. It does not go away after a certain number of years.",
  },
  {
    q: "Does the penalty amount change each year?",
    a: "Yes. Because the penalty is tied to the national base beneficiary premium (which CMS sets annually), your penalty dollar amount can change slightly each year even though your number of uncovered months stays fixed.",
  },
  {
    q: "Can I appeal or have the penalty waived?",
    a: "In limited cases — for example, if you can prove you had creditable coverage that wasn't correctly reported. You can request a reconsideration through Medicare. Ashley can walk you through whether an appeal makes sense in your situation.",
  },
];

const canonicalUrl = "https://medicarewithashley.com/part-d-penalty-calculator";
const faqSchema = buildCalculatorFaqSchema(faqs, canonicalUrl);
const applicationSchema = buildCalculatorApplicationSchema({
  name: "Medicare Part D Late Enrollment Penalty Calculator",
  description:
    "Free browser-based calculator that estimates the Medicare Part D late enrollment penalty using the 2026 national base beneficiary premium.",
  url: canonicalUrl,
});

export default function PartDPenaltyCalculator() {
  const [months, setMonths] = useState("");
  const [result, setResult] = useState<{ monthly: number; annual: number } | null>(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    const val = parseInt(months, 10);
    if (!months || isNaN(val) || val < 0) {
      setError("Please enter a valid number of months (0 or more).");
      setResult(null);
      return;
    }
    if (val > 600) {
      setError("Please enter a realistic number of months (max 600).");
      setResult(null);
      return;
    }
    setError("");
    setResult(calcPenalty(val));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleCalculate();
  }

  return (
    <div>
      <SEOHead
        title="Medicare Part D Penalty Calculator San Diego | Medicare with Ashley"
        description="Calculate your Medicare Part D late enrollment penalty instantly. Free tool from Ashley Watson, San Diego's independent Medicare broker. Find out how much you owe — and how to avoid it. Serving Chula Vista, El Cajon, Escondido & all of San Diego County."
        canonical="/part-d-penalty-calculator/"
        schemaJson={applicationSchema}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2044] via-[#163570] to-[#1e4d9e] text-white py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Free Tool
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Medicare Part D Penalty Calculator
          </h1>
          <p className="text-white/85 text-xl leading-relaxed max-w-2xl mx-auto">
            Find out how much you may owe in late enrollment penalties — and what it will cost you each month for the rest of your Medicare coverage.
          </p>
        </div>
      </section>

      {/* Calculator + Explainer */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Calculator card */}
            <div>
              <Card className="border-2 border-[#0F2044]/10 shadow-xl bg-white">
                <CardContent className="p-8">
                  <h2 className="font-serif text-2xl font-bold text-[#0F2044] mb-2">
                    Calculate Your Penalty
                    <span className="rates-badge">✓ Updated for 2026</span>
                  </h2>
                  <p className="text-muted-foreground text-sm mb-7 leading-relaxed">
                    Enter the number of full months you went without Medicare Part D or other creditable drug coverage after your Initial Enrollment Period ended.
                  </p>

                  <label htmlFor="months-input" className="block text-sm font-semibold text-foreground mb-2">
                    Months without creditable drug coverage
                  </label>
                  <div className="flex gap-3 mb-2">
                    <input
                      id="months-input"
                      type="number"
                      min="0"
                      max="600"
                      value={months}
                      onChange={(e) => { setMonths(e.target.value); setError(""); setResult(null); }}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. 18"
                      className="flex-1 border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0F2044] focus:border-transparent"
                      aria-describedby={error ? "months-error" : undefined}
                    />
                    <Button
                      onClick={handleCalculate}
                      className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold px-6 py-3 rounded-lg text-base h-auto"
                    >
                      Calculate
                    </Button>
                  </div>
                  {error && (
                    <p id="months-error" className="text-red-600 text-sm mt-1 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {error}
                    </p>
                  )}

                  {/* Result */}
                  {result !== null && (
                    <div className="mt-6">
                      {result.monthly === 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <div>
                            <p className="font-semibold text-green-800 text-base">No penalty!</p>
                            <p className="text-green-700 text-sm mt-1 leading-relaxed">
                              You had 0 months without coverage — no late enrollment penalty applies.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="font-semibold text-amber-900 text-base">Estimated penalty based on {months} months</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 text-center border border-amber-100">
                              <p className="text-3xl font-bold text-[#0F2044] font-serif">${result.monthly.toFixed(2)}</p>
                              <p className="text-muted-foreground text-xs mt-1 font-medium uppercase tracking-wide">Per Month</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-amber-100">
                              <p className="text-3xl font-bold text-[#0F2044] font-serif">${result.annual.toFixed(2)}</p>
                              <p className="text-muted-foreground text-xs mt-1 font-medium uppercase tracking-wide">Per Year</p>
                            </div>
                          </div>
                          <p className="text-amber-800 text-xs mt-4 leading-relaxed">
                            This penalty is added to your monthly Part D premium <strong>permanently</strong> and recalculated each year when CMS updates the national base beneficiary premium.
                          </p>
                        </div>
                      )}

                      {/* CTA after result */}
                      <div className="mt-5 bg-[#0F2044]/5 rounded-xl p-5">
                        <p className="text-sm font-semibold text-[#0F2044] mb-1">Not sure what to do next?</p>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          Ashley can review your coverage history, confirm whether a penalty applies, and help you enroll in the right plan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href="/schedule">
                            <Button className="bg-[#0F2044] text-white hover:bg-[#0F2044]/90 rounded-full font-semibold text-sm px-5 py-2.5 h-auto w-full sm:w-auto">
                              Schedule a Free Review
                            </Button>
                          </Link>
                          <a href="tel:+16199472325">
                            <Button variant="outline" className="border-[#0F2044] text-[#0F2044] hover:bg-[#0F2044]/5 rounded-full font-semibold text-sm px-5 py-2.5 h-auto w-full sm:w-auto">
                              <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                              (619) 947-2325
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-muted-foreground/60 text-xs mt-6 leading-relaxed">
                    * Estimate uses the {BASE_PREMIUM_YEAR} national base beneficiary premium of ${BASE_PREMIUM_2026}/month. This tool is for educational purposes only and may not reflect your exact penalty. Consult Medicare or a licensed broker to confirm.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Explainer */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0F2044] mb-3">
                  What Is the Part D Late Enrollment Penalty?
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  If you don't sign up for Medicare Part D (prescription drug coverage) when you're first eligible, and you go 63 or more days in a row without creditable drug coverage, Medicare adds a permanent late enrollment penalty to your monthly Part D premium.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  The penalty is calculated as <strong>1% of the national base beneficiary premium multiplied by the number of full months</strong> you went without Part D or other creditable drug coverage.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-[#0F2044] mb-3 text-base">The Formula</h3>
                <div className="bg-slate-50 rounded-lg px-5 py-4 font-mono text-sm text-center text-[#0F2044] border border-slate-200">
                  1% × ${BASE_PREMIUM_2026} × [months without coverage]
                </div>
                <p className="text-muted-foreground text-xs mt-3 leading-relaxed">
                  The result is rounded to the nearest $0.10 and added to your monthly premium. CMS updates the base premium each year, so your penalty amount can shift slightly.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-[#0F2044] mb-4 text-base">Example</h3>
                <div className="space-y-2 text-sm text-foreground/80">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Months without coverage</span>
                    <span className="font-semibold text-foreground">{EXAMPLE_MONTHS} months</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Calculation</span>
                    <span className="font-semibold text-foreground">1% × ${BASE_PREMIUM_2026} × {EXAMPLE_MONTHS}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Raw result</span>
                    <span className="font-semibold text-foreground">${EXAMPLE_RAW.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Penalty (rounded to nearest $0.10)</span>
                    <span className="font-bold text-[#0F2044] text-base">${EXAMPLE_MONTHLY.toFixed(2)}/month</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#A3D136]/15 rounded-xl border border-[#A3D136]/30 p-6">
                <h3 className="font-semibold text-[#0F2044] mb-2 text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#6a9b00]" aria-hidden="true" />
                  How to Avoid the Penalty
                </h3>
                <ul className="text-sm text-foreground/80 space-y-2">
                  {[
                    "Enroll in Part D during your Initial Enrollment Period (3 months before to 3 months after your 65th birthday month)",
                    "Keep creditable drug coverage through an employer, union, VA, TRICARE, or FEHB plan",
                    "Enroll in a Medicare Advantage plan that includes drug coverage (MAPD)",
                    "If you lose creditable coverage, enroll in Part D within 63 days",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#6a9b00] mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#0F2044] mb-8 text-center">
            Common Part D Penalty Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-border rounded-xl p-6 bg-slate-50">
                <h3 className="font-semibold text-[#0F2044] mb-2">{faq.q}</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0F2044] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Not Sure If a Penalty Applies to You?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Ashley reviews your specific situation for free — no pressure, no obligation. She'll confirm your coverage history, explain your options, and help you get enrolled in the right plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold text-lg px-8 py-4 h-auto rounded-full shadow-md">
                Schedule a Free Review
              </Button>
            </Link>
            <Link href="/prescription-drug-plans">
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Learn About Part D Plans
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/part-b-penalty-calculator">
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Part B Penalty Calculator
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/medicare-irmaa-calculator-san-diego">
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                IRMAA Calculator
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

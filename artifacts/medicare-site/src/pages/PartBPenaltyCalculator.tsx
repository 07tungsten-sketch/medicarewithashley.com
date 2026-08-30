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

const PART_B_PREMIUM_2026 = 202.90;
const PART_B_YEAR = 2026;

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/**
 * Build the year choices around the current calendar year at render time.
 * Accepting a date makes the Jan 1 rollover behavior explicit and testable.
 */
export function getEnrollmentYears(referenceDate = new Date()): number[] {
  const currentYear = referenceDate.getFullYear();
  return Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);
}

function calcPenalty(delayMonths: number): {
  periods: number;
  penaltyPct: number;
  monthlyPenalty: number;
  totalMonthly: number;
} {
  const periods = Math.floor(delayMonths / 12);
  const penaltyPct = periods * 10;
  const monthlyPenalty = Math.round(PART_B_PREMIUM_2026 * penaltyPct / 100 * 100) / 100;
  const totalMonthly = Math.round((PART_B_PREMIUM_2026 + monthlyPenalty) * 100) / 100;
  return { periods, penaltyPct, monthlyPenalty, totalMonthly };
}

const EXAMPLE_DELAY_MONTHS = 30;
const examplePenalty = calcPenalty(EXAMPLE_DELAY_MONTHS);

export const faqs = [
  {
    q: "Who is exempt from the Part B penalty?",
    a: "You're exempt if you had coverage through an employer or union based on active employment (yours or your spouse's) when you first became eligible. Once that coverage ends, you get a Special Enrollment Period of 8 months to sign up without penalty. Retiree coverage, COBRA, or marketplace plans do NOT count — only active employment coverage.",
  },
  {
    q: "When does the Part B penalty clock start?",
    a: "The clock starts the month after your Initial Enrollment Period ends — typically 3 months after you turn 65. If you're delaying because of active employer coverage, the clock doesn't start until that coverage ends.",
  },
  {
    q: "How long do I pay the Part B penalty?",
    a: "For as long as you have Medicare Part B — the penalty never goes away. That's why enrolling on time is so important. A 2-year delay means a 20% higher premium for the rest of your life.",
  },
  {
    q: "Does the penalty dollar amount stay the same?",
    a: "No — the penalty percentage stays fixed (e.g., 20% for a 2-year delay), but because it's applied to the standard Part B premium, the dollar amount changes each year when CMS adjusts the premium.",
  },
  {
    q: "Can I appeal the Part B penalty?",
    a: "Yes, in certain circumstances — for example, if you were given incorrect information by a federal employee, or if you had creditable employer coverage that wasn't properly documented. Ashley can help you understand whether an appeal or Equitable Relief request makes sense for your situation.",
  },
];

const canonicalUrl = "https://medicarewithashley.com/part-b-penalty-calculator";
const faqSchema = buildCalculatorFaqSchema(faqs, canonicalUrl);
const applicationSchema = buildCalculatorApplicationSchema({
  name: "Medicare Part B Late Enrollment Penalty Calculator",
  description:
    "Free browser-based calculator that estimates the Medicare Part B late enrollment penalty using the 2026 standard Part B premium.",
  url: canonicalUrl,
});

export default function PartBPenaltyCalculator() {
  const enrollmentYears = getEnrollmentYears();
  const [eligMonth, setEligMonth] = useState("");
  const [eligYear, setEligYear] = useState("");
  const [enrollMonth, setEnrollMonth] = useState("");
  const [enrollYear, setEnrollYear] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calcPenalty> | null>(null);
  const [delayMonths, setDelayMonths] = useState(0);
  const [error, setError] = useState("");

  function handleCalculate() {
    if (!eligMonth || !eligYear || !enrollMonth || !enrollYear) {
      setError("Please fill in both dates.");
      setResult(null);
      return;
    }
    const eligDate = new Date(parseInt(eligYear), parseInt(eligMonth));
    const enrollDate = new Date(parseInt(enrollYear), parseInt(enrollMonth));
    const diffMs = enrollDate.getTime() - eligDate.getTime();
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));

    if (diffMonths < 0) {
      setError("Enrollment date must be after your eligibility date.");
      setResult(null);
      return;
    }
    if (diffMonths > 360) {
      setError("Please enter a realistic date range.");
      setResult(null);
      return;
    }
    setError("");
    setDelayMonths(diffMonths);
    setResult(calcPenalty(diffMonths));
  }

  return (
    <div>
      <SEOHead
        title="Medicare Part B Late Enrollment Penalty Calculator San Diego | Medicare with Ashley"
        description="Calculate your Medicare Part B late enrollment penalty instantly. Free tool from Ashley Watson, San Diego's independent Medicare broker. See how much the penalty costs — and how to avoid it. Call (619) 947-2325."
        canonical="/part-b-penalty-calculator/"
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
            Free Tool — San Diego Medicare Help
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Medicare Part B Penalty Calculator
          </h1>
          <p className="text-white/85 text-xl leading-relaxed max-w-2xl mx-auto">
            Find out exactly how much the Part B late enrollment penalty adds to your monthly premium — permanently — and what it means for San Diego residents turning 65.
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
                    Enter the month you first became eligible for Part B and the month you actually enrolled. The calculator determines how many full 12-month periods you delayed.
                  </p>

                  {/* Eligibility date */}
                  <fieldset className="mb-5">
                    <legend className="block text-sm font-semibold text-foreground mb-2">
                      When did you first become eligible for Part B?
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="elig-month" className="sr-only">Eligibility month</label>
                        <select
                          id="elig-month"
                          value={eligMonth}
                          onChange={(e) => { setEligMonth(e.target.value); setError(""); setResult(null); }}
                          className="w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2044] bg-white"
                        >
                          <option value="">Month</option>
                          {MONTHS.map((m, i) => (
                            <option key={m} value={i}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="elig-year" className="sr-only">Eligibility year</label>
                        <select
                          id="elig-year"
                          value={eligYear}
                          onChange={(e) => { setEligYear(e.target.value); setError(""); setResult(null); }}
                          className="w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2044] bg-white"
                        >
                          <option value="">Year</option>
                          {enrollmentYears.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  {/* Enrollment date */}
                  <fieldset className="mb-6">
                    <legend className="block text-sm font-semibold text-foreground mb-2">
                      When did (or will) you enroll in Part B?
                    </legend>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="enroll-month" className="sr-only">Enrollment month</label>
                        <select
                          id="enroll-month"
                          value={enrollMonth}
                          onChange={(e) => { setEnrollMonth(e.target.value); setError(""); setResult(null); }}
                          className="w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2044] bg-white"
                        >
                          <option value="">Month</option>
                          {MONTHS.map((m, i) => (
                            <option key={m} value={i}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="enroll-year" className="sr-only">Enrollment year</label>
                        <select
                          id="enroll-year"
                          value={enrollYear}
                          onChange={(e) => { setEnrollYear(e.target.value); setError(""); setResult(null); }}
                          className="w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2044] bg-white"
                        >
                          <option value="">Year</option>
                          {enrollmentYears.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  {error && (
                    <p className="text-red-600 text-sm mb-4 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {error}
                    </p>
                  )}

                  <Button
                    onClick={handleCalculate}
                    className="w-full bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold py-3 rounded-lg text-base h-auto"
                  >
                    Calculate My Penalty
                  </Button>

                  {/* Result */}
                  {result !== null && (
                    <div className="mt-6">
                      {result.periods === 0 ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <div>
                            <p className="font-semibold text-green-800 text-base">No penalty!</p>
                            <p className="text-green-700 text-sm mt-1 leading-relaxed">
                              {delayMonths === 0
                                ? "You enrolled during your Initial Enrollment Period — no late penalty applies."
                                : `You delayed ${delayMonths} month${delayMonths !== 1 ? "s" : ""}, which is less than one full 12-month period — no penalty yet.`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                            <p className="font-semibold text-amber-900 text-base">
                              {result.periods} full 12-month period{result.periods !== 1 ? "s" : ""} delayed → {result.penaltyPct}% penalty
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
                              <p className="text-2xl font-bold text-[#0F2044] font-serif">{result.penaltyPct}%</p>
                              <p className="text-muted-foreground text-xs mt-1 leading-tight">Penalty</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
                              <p className="text-2xl font-bold text-[#0F2044] font-serif">+${result.monthlyPenalty.toFixed(2)}</p>
                              <p className="text-muted-foreground text-xs mt-1 leading-tight">Added/mo</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
                              <p className="text-2xl font-bold text-[#0F2044] font-serif">${result.totalMonthly.toFixed(2)}</p>
                              <p className="text-muted-foreground text-xs mt-1 leading-tight">Total/mo</p>
                            </div>
                          </div>
                          <p className="text-amber-800 text-xs leading-relaxed">
                            Your monthly Part B premium increases from <strong>${PART_B_PREMIUM_2026.toFixed(2)}</strong> to <strong>${result.totalMonthly.toFixed(2)}</strong> — permanently. This penalty is recalculated each year when CMS updates the standard premium.
                          </p>
                        </div>
                      )}

                      {/* CTA after result */}
                      <div className="mt-5 bg-[#0F2044]/5 rounded-xl p-5">
                        <p className="text-sm font-semibold text-[#0F2044] mb-1">Have questions about your situation?</p>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          Ashley serves San Diego County residents — Chula Vista, El Cajon, Escondido, and everywhere in between. She'll review your coverage history and help you get enrolled correctly.
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
                    * Estimate uses the {PART_B_YEAR} standard Part B premium of ${PART_B_PREMIUM_2026.toFixed(2)}/month. This tool is for educational purposes only and may not reflect your exact penalty. Contact Medicare or a licensed broker to confirm.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Explainer */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0F2044] mb-3">
                  What Is the Part B Late Enrollment Penalty?
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Medicare Part B covers doctor visits, outpatient care, preventive services, and medical equipment. Most people pay a monthly premium for it. If you don't sign up when you're first eligible — and you don't have qualifying employer coverage — Medicare adds a permanent penalty to your premium.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  The penalty is <strong>10% of the standard Part B premium for each full 12-month period</strong> you were eligible but didn't enroll. Unlike Part D, the penalty is calculated in full-year increments, not month by month.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-[#0F2044] mb-3 text-base">The Formula</h3>
                <div className="bg-slate-50 rounded-lg px-5 py-4 font-mono text-sm text-center text-[#0F2044] border border-slate-200">
                  10% × ${PART_B_PREMIUM_2026.toFixed(2)} × [full years delayed]
                </div>
                <p className="text-muted-foreground text-xs mt-3 leading-relaxed">
                  Only <em>full</em> 12-month periods count. An 11-month delay = 0 penalty periods. A 13-month delay = 1 penalty period (10%).
                </p>
              </div>

              <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="font-semibold text-[#0F2044] mb-4 text-base">Example — 2.5 Year Delay</h3>
                <div className="space-y-2 text-sm text-foreground/80">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Months without Part B</span>
                    <span className="font-semibold text-foreground">30 months</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Full 12-month periods</span>
                    <span className="font-semibold text-foreground">2 periods</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Penalty percentage</span>
                    <span className="font-semibold text-foreground">20%</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span>Monthly penalty added</span>
                    <span className="font-semibold text-foreground">${examplePenalty.monthlyPenalty.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>New monthly premium</span>
                    <span className="font-bold text-[#0F2044] text-base">${examplePenalty.totalMonthly.toFixed(2)}/mo — forever</span>
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
                    "Enroll during your Initial Enrollment Period — starting 3 months before the month you turn 65",
                    "If you have active employer coverage (yours or a spouse's), you can delay without penalty — but enroll within 8 months of losing that coverage",
                    "Retiree coverage, COBRA, and marketplace plans do NOT protect you from the penalty",
                    "Contact Ashley to review your situation before your IEP window closes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#6a9b00] mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-border p-5">
                <p className="text-sm font-semibold text-[#0F2044] mb-1">Also worried about Part D?</p>
                <p className="text-muted-foreground text-sm mb-3">Part D (drug coverage) has its own separate late enrollment penalty.</p>
                <Link href="/part-d-penalty-calculator" className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline">
                  Use the Part D Penalty Calculator <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#0F2044] mb-8 text-center">
            Common Part B Penalty Questions
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
            Not Sure If the Penalty Applies to You?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            San Diego Medicare broker Ashley Watson reviews your situation for free. She'll confirm your enrollment window, explain whether a penalty applies, and help you get signed up on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold text-lg px-8 py-4 h-auto rounded-full shadow-md">
                Schedule a Free Review
              </Button>
            </Link>
            <Link href="/medicare-basics">
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Learn Medicare Basics
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

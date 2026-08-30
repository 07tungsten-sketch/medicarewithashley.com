import { useState } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Calculator, Phone } from "lucide-react";

// === SINGLE SOURCE OF TRUTH — do not hardcode these values elsewhere ===
export const IRMAA_2026 = {
  year: 2026,
  cmsReleaseDate: "November 14, 2025",
  cmsSourceUrl: "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
  partBStandard: 202.90,
  partBDeductible: 283,
  // Each tier's income value is the INCLUSIVE UPPER bound of that tier.
  // Compare MAGI with <=, top tier is Infinity.
  tiers: [
    { singleMax: 109000,    jointMax: 218000,    partBTotal: 202.90, partBSurcharge: 0,      partDSurcharge: 0     },
    { singleMax: 137000,    jointMax: 274000,    partBTotal: 284.10, partBSurcharge: 81.20,  partDSurcharge: 14.50 },
    { singleMax: 171000,    jointMax: 342000,    partBTotal: 405.80, partBSurcharge: 202.90, partDSurcharge: 37.50 },
    { singleMax: 205000,    jointMax: 410000,    partBTotal: 527.50, partBSurcharge: 324.60, partDSurcharge: 60.40 },
    { singleMax: 499999.99, jointMax: 749999.99, partBTotal: 649.20, partBSurcharge: 446.30, partDSurcharge: 83.30 },
    { singleMax: Infinity,  jointMax: Infinity,  partBTotal: 689.90, partBSurcharge: 487.00, partDSurcharge: 91.00 },
  ],
  // Married Filing Separately (lived with spouse) — special 3-row schedule
  mfs: [
    { max: 109000,    partBTotal: 202.90, partBSurcharge: 0,      partDSurcharge: 0     },
    { max: 390999.99, partBTotal: 649.20, partBSurcharge: 446.30, partDSurcharge: 83.30 },
    { max: Infinity,  partBTotal: 689.90, partBSurcharge: 487.00, partDSurcharge: 91.00 },
  ],
};

export function formatIncomeRange(max: number, previousMax?: number): string {
  const upperBound = Number.isFinite(max) ? Math.floor(max) : null;

  if (previousMax === undefined) {
    return `≤ $${fmtWhole(upperBound ?? 0)}`;
  }

  const lowerBound = Math.floor(previousMax) + 1;
  return upperBound === null
    ? `$${fmtWhole(lowerBound)}+`
    : `$${fmtWhole(lowerBound)} – $${fmtWhole(upperBound)}`;
}

// Display metadata layered on top of the config (labels + derived income ranges)
export const TIER_DISPLAY = IRMAA_2026.tiers.map((tier, index) => ({
  label: ["Standard — No IRMAA Surcharge", "Tier 1 IRMAA", "Tier 2 IRMAA", "Tier 3 IRMAA", "Tier 4 IRMAA", "Tier 5 IRMAA"][index],
  singleRange: formatIncomeRange(tier.singleMax, IRMAA_2026.tiers[index - 1]?.singleMax),
  jointRange: formatIncomeRange(tier.jointMax, IRMAA_2026.tiers[index - 1]?.jointMax),
}));
export const MFS_DISPLAY = IRMAA_2026.mfs.map((tier, index) => ({
  label: ["Standard — No IRMAA Surcharge", "Tier 4 IRMAA (MFS)", "Tier 5 IRMAA (MFS)"][index],
  range: formatIncomeRange(tier.max, IRMAA_2026.mfs[index - 1]?.max),
}));

// Keep the explanatory example tied to the same tier data used by the calculator.
const IRMAA_EXAMPLE_TIER_INDEX = 2;
const IRMAA_EXAMPLE_TIER = IRMAA_2026.tiers[IRMAA_EXAMPLE_TIER_INDEX];
const IRMAA_EXAMPLE_PREVIOUS_TIER = IRMAA_2026.tiers[IRMAA_EXAMPLE_TIER_INDEX - 1];
const IRMAA_EXAMPLE_LOWER_BOUND = IRMAA_EXAMPLE_PREVIOUS_TIER.singleMax + 1;
const IRMAA_EXAMPLE_MAGI = Math.floor(
  (IRMAA_EXAMPLE_LOWER_BOUND + IRMAA_EXAMPLE_TIER.singleMax) / 2,
);
const IRMAA_EXAMPLE_COMBINED_MONTHLY =
  IRMAA_EXAMPLE_TIER.partBSurcharge + IRMAA_EXAMPLE_TIER.partDSurcharge;
const IRMAA_EXAMPLE_ANNUAL = Math.round(IRMAA_EXAMPLE_COMBINED_MONTHLY * 12);

// FAQ data — drives both static HTML and FAQPage JSON-LD
const faqs = [
  {
    q: "What is IRMAA?",
    a: "IRMAA (Income-Related Monthly Adjustment Amount) is an extra amount higher-income Medicare beneficiaries pay on top of their standard Part B and Part D premiums. About 8% of beneficiaries pay it.",
  },
  {
    q: "What income does Medicare use for my 2026 IRMAA?",
    a: "Your MAGI from two years prior - your 2024 tax return sets your 2026 premiums. MAGI is your AGI plus tax-exempt interest.",
  },
  {
    q: "Is IRMAA a cliff?",
    a: "Yes. Going one dollar over a threshold moves your entire surcharge up a full tier for the whole year - it is not phased in.",
  },
  {
    q: "Can I appeal my IRMAA?",
    a: "Yes, if you had a qualifying life-changing event (retirement, work reduction, marriage, divorce, death of a spouse, loss of pension or income-producing property). You file Form SSA-44 with the Social Security Administration.",
  },
  {
    q: "Does the Part D surcharge replace my drug plan premium?",
    a: "No. The Part D IRMAA is added on top of your plan's premium and is paid directly to Medicare.",
  },
];

type FilingStatus = "single" | "joint" | "mfs";

interface TierResult {
  label: string;
  range: string;
  partBTotal: number;
  partBSurcharge: number;
  partDSurcharge: number;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtWhole(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function parseMagi(s: string): number {
  return parseFloat(s.replace(/[$,\s]/g, ""));
}

export function getTier(magi: number, status: FilingStatus): TierResult | null {
  if (status === "mfs") {
    const idx = IRMAA_2026.mfs.findIndex((t) => magi <= t.max);
    if (idx === -1) return null;
    const t = IRMAA_2026.mfs[idx];
    const d = MFS_DISPLAY[idx];
    return { label: d.label, range: d.range, partBTotal: t.partBTotal, partBSurcharge: t.partBSurcharge, partDSurcharge: t.partDSurcharge };
  }
  const idx = IRMAA_2026.tiers.findIndex((t) =>
    status === "single" ? magi <= t.singleMax : magi <= t.jointMax
  );
  if (idx === -1) return null;
  const t = IRMAA_2026.tiers[idx];
  const d = TIER_DISPLAY[idx];
  return {
    label: d.label,
    range: status === "single" ? d.singleRange : d.jointRange,
    partBTotal: t.partBTotal,
    partBSurcharge: t.partBSurcharge,
    partDSurcharge: t.partDSurcharge,
  };
}

export default function IRMAACalculator() {
  const [status, setStatus] = useState<FilingStatus>("single");
  const [magi, setMagi] = useState("");
  const [bothSpouses, setBothSpouses] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [agi, setAgi] = useState("");
  const [taxExempt, setTaxExempt] = useState("");
  const [tier, setTier] = useState<TierResult | null>(null);
  const [error, setError] = useState("");

  function calculate() {
    const val = parseMagi(magi);
    if (!magi.trim() || isNaN(val) || val < 0) {
      setError("Please enter a valid income amount.");
      setTier(null);
      return;
    }
    setError("");
    setTier(getTier(val, status));
  }

  function applyHelper() {
    const a = parseFloat(agi.replace(/[$,\s]/g, "")) || 0;
    const t = parseFloat(taxExempt.replace(/[$,\s]/g, "")) || 0;
    setMagi((a + t).toLocaleString("en-US", { maximumFractionDigits: 0 }));
    setShowHelper(false);
    setTier(null);
  }

  function handleMagiChange(v: string) { setMagi(v); setError(""); setTier(null); }
  function handleStatusChange(s: FilingStatus) { setStatus(s); setError(""); setTier(null); }

  const combinedMonthlySurcharge = tier ? tier.partBSurcharge + tier.partDSurcharge : 0;

  return (
    <div>
      <SEOHead
        title="2026 Medicare IRMAA Calculator | Watson Insurance – San Diego"
        description="Free 2026 Medicare IRMAA calculator. Enter your 2024 income to see your Part B and Part D surcharges. Verified against official CMS figures. Serving San Diego County."
        canonical="/medicare-irmaa-calculator-san-diego/"
      />
      <Helmet>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is IRMAA?", "acceptedAnswer": { "@type": "Answer", "text": "IRMAA (Income-Related Monthly Adjustment Amount) is an extra amount higher-income Medicare beneficiaries pay on top of their standard Part B and Part D premiums. About 8% of beneficiaries pay it." } },
    { "@type": "Question", "name": "What income does Medicare use for my 2026 IRMAA?", "acceptedAnswer": { "@type": "Answer", "text": "Your MAGI from two years prior - your 2024 tax return sets your 2026 premiums. MAGI is your AGI plus tax-exempt interest." } },
    { "@type": "Question", "name": "Is IRMAA a cliff?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Going one dollar over a threshold moves your entire surcharge up a full tier for the whole year - it is not phased in." } },
    { "@type": "Question", "name": "Can I appeal my IRMAA?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, if you had a qualifying life-changing event (retirement, work reduction, marriage, divorce, death of a spouse, loss of pension or income-producing property). You file Form SSA-44 with the Social Security Administration." } },
    { "@type": "Question", "name": "Does the Part D surcharge replace my drug plan premium?", "acceptedAnswer": { "@type": "Answer", "text": "No. The Part D IRMAA is added on top of your plan's premium and is paid directly to Medicare." } }
  ]
}`}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2044] via-[#163570] to-[#1e4d9e] text-white py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Free Tool
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4">
            2026 Medicare IRMAA Calculator
          </h1>
          <div className="inline-flex items-center gap-2 bg-[#A3D136]/20 border border-[#A3D136]/40 rounded-full px-4 py-1.5 mb-3 text-sm font-semibold text-[#d4f16a]">
            ✓ Updated for 2026
          </div>
          <p className="text-white/70 text-sm mb-6">
            Figures verified against the{" "}
            <a
              href={IRMAA_2026.cmsSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white"
            >
              CMS 2026 Parts B &amp; D premium release
            </a>{" "}
            published {IRMAA_2026.cmsReleaseDate}.
          </p>
          <p className="text-white/85 text-lg leading-relaxed max-w-2xl mx-auto">
            Enter your 2024 income to instantly see your 2026 Part B and Part D IRMAA surcharges — verified against official CMS figures.
          </p>
        </div>
      </section>

      {/* Calculator + Reference tables */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Calculator card */}
            <div>
              <Card className="border-2 border-[#0F2044]/10 shadow-xl bg-white">
                <CardContent className="p-8">
                  <h2 className="font-serif text-2xl font-bold text-[#0F2044] mb-6">
                    Calculate Your 2026 IRMAA
                  </h2>

                  {/* Filing status */}
                  <fieldset className="mb-6">
                    <legend className="block text-sm font-semibold text-foreground mb-3">
                      2024 Tax Filing Status
                    </legend>
                    <div className="space-y-2.5">
                      {(
                        [
                          { value: "single", label: "Single / Head of household" },
                          { value: "joint",  label: "Married filing jointly" },
                          { value: "mfs",    label: "Married filing separately" },
                        ] as { value: FilingStatus; label: string }[]
                      ).map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
                          <input
                            type="radio"
                            name="filing-status"
                            value={value}
                            checked={status === value}
                            onChange={() => handleStatusChange(value)}
                            className="w-5 h-5 accent-[#0F2044] shrink-0"
                          />
                          <span className="text-sm text-foreground group-hover:text-[#0F2044] transition-colors">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* MAGI input */}
                  <div className="mb-5">
                    <label htmlFor="magi-input" className="block text-sm font-semibold text-foreground mb-1.5">
                      Your 2024 Modified Adjusted Gross Income (MAGI)
                    </label>
                    <p id="magi-hint" className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      MAGI = your Adjusted Gross Income + any tax-exempt interest, from your 2024 tax return. Your 2024 income determines your 2026 premiums.
                    </p>
                    <div className="relative flex items-center mb-2">
                      <span className="absolute left-3.5 text-muted-foreground font-medium text-sm select-none pointer-events-none" aria-hidden="true">$</span>
                      <input
                        id="magi-input"
                        type="text"
                        inputMode="numeric"
                        value={magi}
                        onChange={(e) => handleMagiChange(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && calculate()}
                        placeholder="e.g. 125,000"
                        autoComplete="off"
                        className="w-full border border-border rounded-lg pl-7 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0F2044] focus:border-transparent"
                        aria-describedby={error ? "magi-error" : "magi-hint"}
                      />
                    </div>

                    {/* MAGI helper expander */}
                    <button
                      type="button"
                      onClick={() => setShowHelper(!showHelper)}
                      className="flex items-center gap-1.5 text-xs text-[#163570] hover:underline font-medium mb-2"
                      aria-expanded={showHelper}
                      aria-controls="magi-helper"
                    >
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${showHelper ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                      Help me calculate MAGI
                    </button>

                    {showHelper && (
                      <div id="magi-helper" className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-3 space-y-3">
                        <div>
                          <label htmlFor="agi-input" className="block text-xs font-semibold text-foreground mb-1">
                            Adjusted Gross Income (AGI) — Form 1040, line 11
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-muted-foreground text-sm select-none pointer-events-none" aria-hidden="true">$</span>
                            <input
                              id="agi-input"
                              type="text"
                              inputMode="numeric"
                              value={agi}
                              onChange={(e) => setAgi(e.target.value)}
                              placeholder="e.g. 120,000"
                              className="w-full border border-border rounded-lg pl-6 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2044]/50"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="tax-exempt-input" className="block text-xs font-semibold text-foreground mb-1">
                            Tax-exempt interest — Form 1040, line 2a
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-muted-foreground text-sm select-none pointer-events-none" aria-hidden="true">$</span>
                            <input
                              id="tax-exempt-input"
                              type="text"
                              inputMode="numeric"
                              value={taxExempt}
                              onChange={(e) => setTaxExempt(e.target.value)}
                              placeholder="e.g. 5,000 (or 0)"
                              className="w-full border border-border rounded-lg pl-6 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2044]/50"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={applyHelper}
                          className="bg-[#0F2044] text-white hover:bg-[#0F2044]/90 text-xs font-semibold px-4 py-2.5 h-auto rounded-lg w-full"
                        >
                          Apply to MAGI field (AGI + tax-exempt interest)
                        </Button>
                      </div>
                    )}

                    {error && (
                      <p id="magi-error" role="alert" className="text-red-600 text-sm flex items-center gap-1.5 mt-1">
                        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Both-spouses checkbox — joint only */}
                  {status === "joint" && (
                    <div className="mb-5">
                      <label htmlFor="both-spouses" className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                        <input
                          id="both-spouses"
                          type="checkbox"
                          checked={bothSpouses}
                          onChange={(e) => { setBothSpouses(e.target.checked); setTier(null); }}
                          className="w-5 h-5 accent-[#0F2044] shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-foreground leading-snug">
                          Both spouses are enrolled in Medicare
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            Shows combined couple totals in the results
                          </span>
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Calculate button */}
                  <Button
                    onClick={calculate}
                    className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold px-6 py-3 rounded-lg text-base h-auto w-full"
                  >
                    Calculate My IRMAA
                  </Button>

                  {/* Results */}
                  {tier !== null && (
                    <div className="mt-6" role="region" aria-label="IRMAA calculation results" aria-live="polite">
                      {tier.partBSurcharge === 0 ? (
                        /* Standard tier — no surcharge */
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="font-semibold text-green-800 text-base">Good news — no IRMAA surcharge!</p>
                              <p className="text-green-700 text-xs mt-0.5">{tier.range} MAGI</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-green-100">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-foreground/80">Monthly Part B premium</span>
                              <span data-testid="irmaa-result-part-b" className="text-2xl font-bold text-[#0F2044] font-serif">${fmt(tier.partBTotal)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                              You pay the standard 2026 Part B premium. No IRMAA surcharges apply to your Part B or Part D.
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* IRMAA surcharge tier */
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <p className="font-semibold text-amber-900 text-base">{tier.label}</p>
                              <p className="text-amber-700 text-xs mt-0.5">{tier.range} MAGI</p>
                            </div>
                          </div>

                          <div className="space-y-0 text-sm mb-4 border border-amber-200 rounded-xl overflow-hidden bg-white">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-amber-100">
                              <span className="text-foreground/80">Total monthly Part B premium</span>
                              <span data-testid="irmaa-result-part-b" className="font-bold text-[#0F2044]">${fmt(tier.partBTotal)}/mo</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 border-b border-amber-100 bg-amber-50/50">
                              <span className="text-foreground/70 pl-3">↳ Part B IRMAA surcharge</span>
                              <span className="font-semibold text-foreground">+${fmt(tier.partBSurcharge)}/mo</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 border-b border-amber-100">
                              <span className="text-foreground/80">
                                Part D IRMAA surcharge
                                <span className="block text-xs text-muted-foreground">added on top of your Part D plan premium</span>
                              </span>
                              <span data-testid="irmaa-result-part-d" className="font-semibold text-foreground">+${fmt(tier.partDSurcharge)}/mo</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 border-b border-amber-200 bg-amber-100/60">
                              <span className="font-semibold text-foreground">Combined monthly IRMAA</span>
                              <span className="font-bold text-[#0F2044]">${fmt(combinedMonthlySurcharge)}/mo</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 bg-[#0F2044]/5">
                              <span className="font-semibold text-foreground">Combined annual IRMAA</span>
                              <span className="font-bold text-[#0F2044] text-lg">${fmt(combinedMonthlySurcharge * 12)}/yr</span>
                            </div>
                          </div>

                          {/* Couple totals */}
                          {status === "joint" && bothSpouses && (
                            <div className="mt-3 border border-[#0F2044]/20 bg-[#0F2044]/5 rounded-xl p-4">
                              <p className="text-xs font-semibold text-[#0F2044] uppercase tracking-wide mb-3">
                                Combined couple totals — both spouses enrolled in Medicare
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg p-3 text-center border border-[#0F2044]/10">
                                  <p className="text-xl font-bold text-[#0F2044] font-serif">${fmt(combinedMonthlySurcharge * 2)}</p>
                                  <p className="text-muted-foreground text-xs mt-1">Per month (couple)</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center border border-[#0F2044]/10">
                                  <p className="text-xl font-bold text-[#0F2044] font-serif">${fmt(combinedMonthlySurcharge * 24)}</p>
                                  <p className="text-muted-foreground text-xs mt-1">Per year (couple)</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Disclaimer */}
                      <div className="mt-4 bg-slate-100 rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">
                        This calculator uses the official 2026 Medicare Part B and Part D IRMAA figures published by CMS. Your 2026 premiums are based on your 2024 income. The Social Security Administration makes the final determination and will notify you by mail. If your income has dropped due to a life-changing event, you may be able to appeal using Form SSA-44. This tool is for educational purposes and is not tax, legal, or financial advice.
                      </div>

                      {/* In-result CTA */}
                      <div className="mt-5 bg-[#0F2044]/5 rounded-xl p-5">
                        <p className="text-sm font-semibold text-[#0F2044] mb-1">Not sure how IRMAA affects your Medicare choices?</p>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          I come to you anywhere in San Diego County — let's talk it through. No pressure, no obligation.
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
                </CardContent>
              </Card>
            </div>

            {/* Reference tables + explainer */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0F2044] mb-3">
                  2026 IRMAA Thresholds at a Glance
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-1 text-sm">
                  Your 2026 IRMAA tier is set by your 2024 MAGI. Because IRMAA is a cliff, one dollar over a threshold moves your entire surcharge up a full tier for the whole year.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The standard 2026 Part B premium is ${fmt(IRMAA_2026.partBStandard)} per month, with an annual deductible of ${fmtWhole(IRMAA_2026.partBDeductible)}.{" "}
                  <a
                    href={IRMAA_2026.cmsSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#163570] underline underline-offset-2 hover:text-[#0F2044]"
                  >
                    See the official CMS release
                  </a>{" "}
                  (published {IRMAA_2026.cmsReleaseDate}).
                </p>
              </div>

              {/* Individual table */}
              <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-[#0F2044] text-white">
                  <p className="text-sm font-semibold">Individual / Head of Household — 2024 MAGI</p>
                </div>
                <div className="overflow-x-auto">
                  <table data-testid="irmaa-reference-table-single" className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-muted-foreground border-b border-slate-200">
                        <th scope="col" className="text-left px-4 py-2.5 font-medium">2024 MAGI</th>
                        <th scope="col" className="text-right px-4 py-2.5 font-medium">Part B / mo</th>
                        <th scope="col" className="text-right px-4 py-2.5 font-medium">Part D surcharge / mo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {IRMAA_2026.tiers.map((t, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 text-foreground/80">{TIER_DISPLAY[i].singleRange}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">${fmt(t.partBTotal)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                            {t.partDSurcharge === 0 ? "—" : `+$${fmt(t.partDSurcharge)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Joint table */}
              <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-[#163570] text-white">
                  <p className="text-sm font-semibold">Married Filing Jointly — 2024 MAGI</p>
                </div>
                <div className="overflow-x-auto">
                  <table data-testid="irmaa-reference-table-joint" className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-muted-foreground border-b border-slate-200">
                        <th scope="col" className="text-left px-4 py-2.5 font-medium">2024 MAGI</th>
                        <th scope="col" className="text-right px-4 py-2.5 font-medium">Part B / mo</th>
                        <th scope="col" className="text-right px-4 py-2.5 font-medium">Part D surcharge / mo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {IRMAA_2026.tiers.map((t, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 text-foreground/80">{TIER_DISPLAY[i].jointRange}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">${fmt(t.partBTotal)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                            {t.partDSurcharge === 0 ? "—" : `+$${fmt(t.partDSurcharge)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Married Filing Separately table */}
              <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-[#0F2044] text-white">
                  <p className="text-sm font-semibold">Married Filing Separately (lived with spouse) — 2024 MAGI</p>
                </div>
                <div className="overflow-x-auto">
                  <table data-testid="irmaa-reference-table-mfs" className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-muted-foreground border-b border-slate-200">
                        <th scope="col" className="text-left px-4 py-2.5 font-medium">2024 MAGI</th>
                        <th scope="col" className="text-right px-4 py-2.5 font-medium">Part B / mo</th>
                        <th scope="col" className="text-right px-4 py-2.5 font-medium">Part D surcharge / mo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {IRMAA_2026.mfs.map((t, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5 text-foreground/80">{MFS_DISPLAY[i].range}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">${fmt(t.partBTotal)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                            {t.partDSurcharge === 0 ? "—" : `+$${fmt(t.partDSurcharge)}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MFS callout */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
                <p className="font-semibold mb-1">Married Filing Separately (lived with spouse):</p>
                <p>
                  MFS filers face a compressed 3-tier schedule — standard ({MFS_DISPLAY[0].range}), then jumping directly to Tier&nbsp;4 ({MFS_DISPLAY[1].range}), then Tier&nbsp;5 ({MFS_DISPLAY[2].range}). Filing separately typically results in significantly higher IRMAA than filing jointly.
                </p>
              </div>

              {/* Appeal callout */}
              <div className="bg-[#A3D136]/15 rounded-xl border border-[#A3D136]/30 p-5">
                <h3 className="font-semibold text-[#0F2044] mb-2 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#6a9b00] shrink-0" aria-hidden="true" />
                  Did Your Income Drop? You Can Appeal.
                </h3>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Qualifying life-changing events — retirement, reduced work hours, marriage, divorce, or death of a spouse — allow you to request a lower IRMAA determination by filing <strong>Form SSA-44</strong> with the Social Security Administration. Ashley can walk you through whether an appeal makes sense in your situation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How IRMAA Is Calculated — static pre-rendered HTML */}
      <section className="py-14 bg-white" aria-labelledby="how-calculated-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="how-calculated-heading" className="font-serif text-3xl font-bold text-[#0F2044] mb-6">
            How IRMAA Is Calculated
          </h2>

          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              IRMAA is not based on your current income. Medicare looks at your income from{" "}
              <strong className="text-foreground">two years earlier</strong> — so your 2026 Part B and Part D premiums are set by
              the income reported on your 2024 federal tax return. This two-year lookback is the single
              biggest source of surprise I see with clients: a one-time bump in 2024 income can raise
              premiums in 2026, even if your income has since come back down.
            </p>

            <p>Here is how the process works, step by step:</p>
            <ol className="list-decimal list-outside pl-6 space-y-2">
              <li>The IRS shares your Modified Adjusted Gross Income (MAGI) from two years ago with the Social Security Administration.</li>
              <li>SSA compares that number to the year's income brackets and places you in a tier.</li>
              <li>If you land above the first threshold, a surcharge is added to both your Part B premium and your{" "}
                <Link href="/part-d-penalty-calculator" className="text-[#163570] underline underline-offset-2 hover:text-[#0F2044]">Part D premium</Link>.
              </li>
              <li>SSA mails you a notice explaining the adjustment and how it was determined.</li>
            </ol>

            <p>
              Two features of this system catch people off guard. First, IRMAA is a{" "}
              <strong className="text-foreground">cliff, not a slope</strong>: going a single dollar over a threshold moves your
              entire surcharge up a full tier for the whole year — there is no gradual phase-in. Second,
              the surcharge is charged <strong className="text-foreground">per person</strong>, so a married couple who are both on
              Medicare and cross a bracket together pay it twice.
            </p>

            <p>
              The surcharge amounts themselves are set each year by the Centers for Medicare &amp;
              Medicaid Services. The idea behind IRMAA is that most beneficiaries pay about 25% of the
              true cost of their coverage, while higher-income beneficiaries pay a larger share — from
              roughly 35% up to 85% at the top tier. Only about 8% of Medicare beneficiaries pay any
              IRMAA at all.
            </p>

            <p>
              Your Part B surcharge is usually deducted directly from your Social Security check.
              Your Part D IRMAA is billed separately and paid directly to Medicare — not to your drug
              plan. IRMAA is also re-evaluated every year, so if your income drops, your premiums
              generally come back down two years later without you doing anything.
            </p>

            <p>
              If your income fell because of a specific life event — you retired, cut back your
              hours, lost a pension, got married or divorced, or lost a spouse — you don't have to wait
              out the two years. You can ask SSA to use your more recent income by filing{" "}
              <strong className="text-foreground">Form SSA-44</strong>.{" "}
              {/* [OPTIONAL: Ashley, insert a real 1–2 sentence client example here — e.g. a client who retired and successfully appealed. Your real experience is what sets this page apart. Delete this comment if you'd rather not.] */}
            </p>
          </div>
        </div>
      </section>

      {/* MAGI Explainer — static pre-rendered HTML */}
      <section className="py-14 bg-slate-50" aria-labelledby="magi-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="magi-heading" className="font-serif text-3xl font-bold text-[#0F2044] mb-6">
            MAGI for Medicare: What Income Counts
          </h2>

          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              The income figure Medicare uses for IRMAA is your{" "}
              <strong className="text-foreground">Modified Adjusted Gross Income (MAGI)</strong>. For IRMAA, the formula is straightforward:
            </p>

            <p className="text-center font-bold text-foreground text-base bg-white border border-border rounded-xl py-4 px-6 my-2">
              MAGI = Adjusted Gross Income (AGI) + Tax-Exempt Interest
            </p>

            <p>
              Your AGI is the number near the bottom of the first page of your tax return, and
              tax-exempt interest is mainly the interest from municipal bonds. Add those two together
              and you have the figure that decides your IRMAA tier.
            </p>

            <div>
              <h3 className="font-semibold text-[#0F2044] text-lg mb-3">Income that counts toward MAGI</h3>
              <ul className="list-disc list-outside pl-6 space-y-1.5">
                <li>Wages and self-employment income</li>
                <li>Pension and annuity income</li>
                <li>Withdrawals from traditional IRAs and 401(k)s</li>
                <li>Roth <em>conversions</em> (the amount you convert is taxable income that year)</li>
                <li>Capital gains, including from selling a home or investments</li>
                <li>Dividends and interest, including tax-exempt municipal bond interest</li>
                <li>The taxable portion of your Social Security benefits</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#0F2044] text-lg mb-3">Income that does NOT count</h3>
              <ul className="list-disc list-outside pl-6 space-y-1.5">
                <li>Qualified withdrawals from a Roth IRA (already taxed, so they don't add to MAGI)</li>
                <li>The non-taxable portion of your Social Security benefits</li>
                <li>Money moved by a Qualified Charitable Distribution (QCD) from an IRA</li>
              </ul>
            </div>

            <p>
              This distinction is where most Medicare cost planning happens. Because the income you
              realize this year sets your premiums two years from now, choices like the size of a Roth
              conversion, when you sell an appreciated asset, or whether you use a QCD to satisfy a
              required minimum distribution can all move you into — or keep you out of — a higher IRMAA
              tier.
            </p>

            <p>
              <strong className="text-foreground">A quick example.</strong> Say you're a single filer and your 2024 MAGI was{" "}
              ${fmtWhole(IRMAA_EXAMPLE_MAGI)}. That falls in the ${fmtWhole(IRMAA_EXAMPLE_LOWER_BOUND)}–${fmtWhole(IRMAA_EXAMPLE_TIER.singleMax)} bracket, so in 2026 you'd pay ${fmt(IRMAA_EXAMPLE_TIER.partBTotal)} a
              month for Part B plus a ${fmt(IRMAA_EXAMPLE_TIER.partDSurcharge)} Part D surcharge — about ${fmt(IRMAA_EXAMPLE_COMBINED_MONTHLY)} a month more than the
              standard premium, or roughly ${fmtWhole(IRMAA_EXAMPLE_ANNUAL)} over the year. If you had kept your 2024 MAGI at
              ${fmtWhole(IRMAA_EXAMPLE_PREVIOUS_TIER.singleMax)} or below, you'd have paid the next tier down. That's the kind of margin worth
              planning around, and exactly what the calculator above is for.
            </p>

            <p className="text-sm text-muted-foreground border-t border-border pt-5 mt-2">
              See also:{" "}
              <Link href="/part-b-penalty-calculator" className="text-[#163570] underline underline-offset-2 hover:text-[#0F2044]">
                Part B late enrollment penalty calculator
              </Link>{" "}
              and{" "}
              <Link href="/part-d-penalty-calculator" className="text-[#163570] underline underline-offset-2 hover:text-[#0F2044]">
                Part D penalty calculator
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* IRMAA Appeal — static pre-rendered HTML */}
      <section className="py-14 bg-white" aria-labelledby="appeal-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="appeal-heading" className="font-serif text-3xl font-bold text-[#0F2044] mb-6">
            How to Appeal Your IRMAA (Form SSA-44)
          </h2>

          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              An IRMAA determination is not always final. Because Medicare uses your income from two
              years ago, the surcharge can reflect a year that no longer matches your situation — most
              often because you've since retired. If a specific life event lowered your income, you can
              ask the Social Security Administration to use your more recent income instead by filing{" "}
              <a
                href="https://www.ssa.gov/forms/ssa-44.pdf"
                target="_blank"
                rel="noopener"
                className="text-[#163570] underline underline-offset-2 hover:text-[#0F2044]"
              >
                Form SSA-44
              </a>.
            </p>

            <div>
              <h3 className="font-semibold text-[#0F2044] text-lg mb-3">Qualifying life-changing events</h3>
              <p className="mb-3">SSA recognizes eight events that let you request a reduction:</p>
              <ul className="list-disc list-outside pl-6 space-y-1.5">
                <li>Marriage</li>
                <li>Divorce or annulment</li>
                <li>Death of a spouse</li>
                <li>Work stoppage (including retirement)</li>
                <li>Work reduction (cutting back your hours)</li>
                <li>Loss of income-producing property (through no fault of your own)</li>
                <li>Loss or reduction of certain pension income</li>
                <li>An employer settlement payment due to bankruptcy or closure</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#0F2044] text-lg mb-3">What does NOT qualify</h3>
              <p>
                Not every drop in income opens the door to an appeal. A one-time income event that
                simply won't repeat — selling a house, realizing capital gains, or doing a Roth
                conversion — does not qualify for SSA-44. In those cases, your premium comes back down
                on its own two years later, once that income rolls off the tax return Medicare is
                looking at.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#0F2044] text-lg mb-3">How to file</h3>
              <ol className="list-decimal list-outside pl-6 space-y-2">
                <li>Complete Form SSA-44, which asks for the life-changing event, the date it happened, and an estimate of your reduced income for the current year.</li>
                <li>Attach evidence of the event — for retirement or reduced hours, a signed statement is often enough; other events may need documents like a marriage certificate, death certificate, or a letter from a former employer.</li>
                <li>Submit it to your local Social Security office, by mail, in person, or by fax.</li>
              </ol>
            </div>

            <p>
              Decisions usually come back within a few weeks. If approved, the reduction applies to
              both your Part B and Part D premiums and is generally retroactive to the start of the
              year the change applies. For a couple sitting in the first tier, a successful appeal can
              be worth well over $2,000 for the year — a strong return on a two-page form.
            </p>

            <p>
              If you're not sure whether your situation qualifies, or you want a second set of eyes
              on the form before you send it, that's exactly the kind of thing I help San Diego County
              clients with — and there's no cost to talk it through.{" "}
              {/* [OPTIONAL: Ashley, insert a brief real example here — e.g. a recently retired client whose SSA-44 was approved and what it saved them. A real outcome is the strongest trust signal on this page. Delete this comment if you'd rather not.] */}
            </p>

            {/* Inline CTA */}
            <div className="bg-[#0F2044]/5 rounded-xl p-5 mt-2">
              <p className="text-sm font-semibold text-[#0F2044] mb-1">Not sure if your situation qualifies for an appeal?</p>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                I help San Diego County clients with SSA-44 questions at no cost. Let's talk it through before you submit anything.
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
        </div>
      </section>

      {/* FAQ — rendered as real HTML for crawlability and rich results eligibility */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#0F2044] mb-8 text-center">
            Frequently Asked Questions
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

      {/* Full-width CTA */}
      <section className="py-16 bg-[#0F2044] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Not Sure How IRMAA Affects Your Medicare Choices?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-2 max-w-xl mx-auto">
            I come to you anywhere in San Diego County — let's talk it through. No pressure, no obligation.
          </p>
          <a
            href="tel:+16199472325"
            className="inline-block text-[#A3D136] font-semibold text-xl hover:underline mb-8"
          >
            (619) 947-2325
          </a>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold text-lg px-8 py-4 h-auto rounded-full shadow-md">
                Schedule a Free Review
              </Button>
            </Link>
            <Link href="/medicare-advantage">
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Medicare Advantage Plans
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/medicare-supplements">
              <Button variant="outline" className="border-white/60 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Medicare Supplements
                <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

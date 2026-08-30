import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Phone, ChevronRight } from "lucide-react";

/**
 * Return the AEP year for the current date (called at render time, not module
 * load time, so that a long-running SSR process always returns the live value).
 *
 * AEP opens October 15.  Before that date the most-recent enrollment cycle
 * (prior year) is still the relevant one to display; on or after Oct 15 the
 * current-year cycle becomes active.
 *
 * All comparisons use America/Los_Angeles time because the site serves
 * San Diego, CA.
 */
export function getAepYear(): number {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)!.value, 10);
  const year = get("year");
  const month = get("month"); // 1–12
  const day = get("day");
  // On/after October 15 → current year's AEP; before → previous year's AEP
  return month > 10 || (month === 10 && day >= 15) ? year : year - 1;
}

const SCHEDULING_LINK = "https://link.agent-crm.com/widget/booking/L3wahsCgYNk6lKg3Vo40";
const DUAL_ELIGIBLE_URL = "/medicare-medi-cal-dual-eligible-san-diego/";

export default function AnnualEnrollmentPeriod() {
  // Computed inside the component so every SSR render call gets the live date
  // (module-level constants are frozen at import time in a long-running server).
  const AEP_YEAR = getAepYear();
  const EFFECT_YEAR = AEP_YEAR + 1;

  const faqs = [
    {
      q: `When is the Medicare Annual Enrollment Period in ${AEP_YEAR}?`,
      a: `The Annual Enrollment Period runs from October 15 through December 7, ${AEP_YEAR}. Any changes you make during this window take effect January 1, ${EFFECT_YEAR}.`,
    },
    {
      q: "What can I change during Annual Enrollment?",
      a: "During AEP you can switch between Original Medicare and a Medicare Advantage plan, switch from one Medicare Advantage plan to another, or join, switch, or drop a Medicare Part D prescription drug plan.",
    },
    {
      q: "Does it cost anything to work with a Medicare broker?",
      a: "No. As an independent broker, I'm paid by the insurance carriers, not by you. Sitting down to review your options is free, and there's no obligation to make any changes.",
    },
    {
      q: "Do I have to change my Medicare plan during AEP?",
      a: "No. If your current coverage still fits, you don't have to do anything. But because plans can change each year, it's worth a quick review to be sure it still works for your doctors, medications, and budget.",
    },
    {
      q: "What areas do you serve?",
      a: "I serve seniors across Chula Vista, National City, El Cajon, La Mesa, Escondido, and all of San Diego County — and I come to you.",
    },
    {
      q: "I have both Medicare and Medi-Cal. Can you help?",
      a: "Yes. Helping dual-eligible clients understand their options is a focus of mine. Reach out and I'll explain what applies to you, at no cost.",
    },
    {
      q: "What should I have ready for our meeting?",
      a: "Just a list of your current medications and your preferred doctors. That's usually all I need to help you see whether your coverage still fits.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div>
      <SEOHead
        title="Medicare Annual Enrollment Help in San Diego (Oct 15–Dec 7) | Medicare with Ashley"
        description={`Medicare's Annual Enrollment Period runs Oct 15–Dec 7, ${AEP_YEAR}. Get free, no-pressure help reviewing your Medicare options from a local San Diego broker who comes to you.`}
        canonical="/medicare-annual-enrollment-period-san-diego/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="aep-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Annual Enrollment Period · San Diego</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            Medicare Annual Enrollment Period Help in San Diego County
            <span className="rates-badge">✓ Updated for {AEP_YEAR}</span>
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed mb-8">
            I'm Ashley — a licensed, independent Medicare broker serving Chula Vista, South Bay, and all of San Diego County. During the Annual Enrollment Period, I'll help you review your Medicare coverage for {EFFECT_YEAR} in plain English, at no cost and with zero pressure. And I come to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+16199472325">
              <Button className="bg-[#0F2044] text-white hover:bg-[#163570] font-semibold text-lg px-10 py-4 h-auto rounded-full shadow-md w-full sm:w-auto">
                <Phone className="mr-2 h-5 w-5" />
                Call (619) 947-2325
              </Button>
            </a>
            <a
              href={SCHEDULING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-placement="aep_hero_booking"
            >
              <Button className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold text-lg px-10 py-4 h-auto rounded-full shadow-md w-full sm:w-auto">
                Book a Free Review
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Key-dates callout */}
      <section className="py-8 bg-background" data-testid="aep-dates-callout">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 flex items-start gap-4">
            <Calendar className="h-7 w-7 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-lg leading-snug">
                Medicare Annual Enrollment Period: October 15 – December 7, {AEP_YEAR}
              </p>
              <p className="text-amber-800 mt-1">
                Any changes you make take effect January 1, {EFFECT_YEAR}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="py-20 bg-background" data-testid="aep-what-you-can-do">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">What You Can Do During Annual Enrollment</h2>
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">
            The Annual Enrollment Period (AEP) is the once-a-year window when most people can make changes to their Medicare coverage. During AEP you can:
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Switch from Original Medicare to a Medicare Advantage plan, or from Medicare Advantage back to Original Medicare",
              "Switch from one Medicare Advantage plan to another",
              "Join, switch, or drop a Medicare Part D prescription drug plan",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-border">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-foreground/80 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-foreground/80 text-lg leading-relaxed">
            Any changes take effect January 1, {EFFECT_YEAR}. Even if you decide to keep what you have, it's worth a fresh look — plans can change from year to year.
          </p>
        </div>
      </section>

      {/* Why Local Broker */}
      <section className="py-20 bg-accent/20" data-testid="aep-why-local">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Why Work With a Local Broker Who Comes to You</h2>
          <div className="text-foreground/80 text-lg leading-relaxed">
            <p>
              Getting out isn't always easy, so I don't ask you to. I meet clients right at home across South Bay and San Diego County. As an independent broker, I'm paid by the insurance carriers — not by you — so reviewing your options is completely free, with no obligation to change anything. My approach is simple: I take the time to understand your needs first, explain things clearly, and never rush you.
            </p>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20 bg-background" data-testid="aep-service-area">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Serving South Bay &amp; All of San Diego County</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
            <p>
              I help seniors across Chula Vista, National City, Imperial Beach, El Cajon, La Mesa, Escondido, and the surrounding communities — and I come to you.
            </p>
            <p>
              Have both Medicare and Medi-Cal? I focus on helping dual-eligible clients understand their options —{" "}
              <Link href={DUAL_ELIGIBLE_URL} className="text-primary underline hover:text-primary/80 transition-colors">
                learn more here
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* City Links */}
      <section className="py-16 bg-accent/20 border-t border-border/40" data-testid="aep-city-links">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
            Find a Local Medicare Broker Near You
          </h2>
          <p className="text-foreground/75 text-lg leading-relaxed mb-8">
            Ashley serves seniors across San Diego County. Select your city for local Medicare help — free consultations, in your home or by phone.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { city: "Chula Vista", slug: "medicare-broker-chula-vista" },
              { city: "National City", slug: "medicare-broker-national-city" },
              { city: "El Cajon", slug: "medicare-broker-el-cajon" },
              { city: "La Mesa", slug: "medicare-broker-la-mesa" },
              { city: "Santee", slug: "medicare-broker-santee" },
              { city: "Oceanside", slug: "medicare-broker-oceanside" },
              { city: "Escondido", slug: "medicare-broker-escondido" },
              { city: "Poway", slug: "medicare-broker-poway", href: "/medicare-broker-poway/" },
              { city: "San Marcos", slug: "medicare-broker-san-marcos" },
              { city: "South Bay San Diego", slug: "medicare-help-south-bay-san-diego" },
            ].map(({ city, slug, href }) => (
              <Link
                key={slug}
                href={href ?? `/${slug}`}
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
              >
                <ChevronRight className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Ashley */}
      <section className="py-20 bg-background" data-testid="aep-about-ashley">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">About Ashley</h2>
          <div className="text-foreground/80 text-lg leading-relaxed">
            <p>
              Ashley Watson is a licensed, independent Medicare broker (CA License #4052120) who has spent years helping San Diego County seniors make sense of Medicare. She built her practice because she'd seen too many people make confusing, costly enrollment mistakes simply because no one took the time to explain things clearly. Operating as Medicare with Ashley (Watson Insurance), she serves clients across San Diego County — and comes to them.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background" data-testid="aep-faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details
                key={i}
                className="group border border-border rounded-xl px-6 bg-card shadow-sm"
                data-testid={`aep-faq-${i}`}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-serif font-semibold text-foreground text-lg leading-snug text-left">{item.q}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </summary>
                <p className="text-foreground/80 text-base pb-5 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="aep-final-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">
            Let's Review Your Medicare Options — Free
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            The Annual Enrollment Period ends December 7. Let's make sure your coverage still fits before the window closes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+16199472325">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-10 py-4 h-auto rounded-full bg-transparent w-full sm:w-auto">
                <Phone className="mr-2 h-5 w-5" />
                Call (619) 947-2325
              </Button>
            </a>
            <a
              href={SCHEDULING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-placement="aep_final_cta_booking"
            >
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full shadow-md w-full sm:w-auto">
                Book a Free Review
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CMS Disclaimer */}
      <section className="py-10 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            Watson Insurance (Medicare with Ashley) · Serving San Diego County, California ·{" "}
            <a href="tel:+16199472325" className="underline hover:text-foreground/80">(619) 947-2325</a>{" "}
            ·{" "}
            <a href="mailto:ashley@watsoninsurancesd.com" className="underline hover:text-foreground/80">ashley@watsoninsurancesd.com</a>
          </p>
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

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import {
  homeFaqItems,
  PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE,
  TRI_CITY_HOME_FAQ_ANSWER_BASE,
} from "@/data/homeFaqItems";
import { ANSWER_JSX_HREFS } from "@/data/answerJsxKeys";
import type { AnswerJsxQuestionKey } from "@/data/answerJsxKeys";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createGhlCompletionHandler, trackEvent } from "@/lib/analytics";
import {
  Heart, Shield, Star, Phone, CheckCircle, Users, Clock, Award, ChevronRight,
  MapPin, Calendar, Building2, BookOpen, FileText, ChevronDown
} from "lucide-react";

const plans = [
  {
    title: "Medicare Part A",
    subtitle: "Hospital Insurance",
    description: "Covers inpatient hospital stays, skilled nursing facility care, hospice, and some home health services.",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-[#5d8a00]",
    href: "/medicare-basics",
  },
  {
    title: "Medicare Part B",
    subtitle: "Medical Insurance",
    description: "Covers doctors' visits, outpatient care, preventive services, and medical equipment.",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    href: "/medicare-basics",
  },
  {
    title: "Medicare Advantage",
    subtitle: "Part C — All-in-One Plans",
    description: "Combines Part A and B coverage, often with extra benefits like dental, vision, and hearing.",
    color: "bg-cyan-50 border-cyan-200",
    iconColor: "text-cyan-600",
    href: "/medicare-advantage",
  },
  {
    title: "Medicare Part D",
    subtitle: "Prescription Drug Plans",
    description: "Helps pay for prescription medications. Essential for managing ongoing medication costs.",
    color: "bg-sky-50 border-sky-200",
    iconColor: "text-sky-600",
    href: "/prescription-drug-plans",
  },
  {
    title: "Medicare Supplements",
    subtitle: "Medigap Plans",
    description: "Fill the gaps in Original Medicare — helping cover copays, coinsurance, and deductibles.",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-[#5d8a00]",
    href: "/medicare-supplements",
  },
];

const whyPoints = [
  {
    icon: <Building2 className="h-7 w-7" />,
    title: "Independent Broker",
    body: "Ashley is not tied to any single insurance company. She shops every major carrier to find what's actually best for you.",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Represents Multiple Insurance Companies",
    body: "With contracts across all leading Medicare carriers in San Diego, Ashley can compare dozens of plans side by side.",
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: "No-Cost Consultations",
    body: "Ashley is paid by insurance carriers — never by you. Her time, advice, and enrollment help are always 100% free.",
  },
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: "Reviews Your Doctors & Prescriptions",
    body: "Before recommending any plan, Ashley checks that your current doctors and medications are covered at the best possible cost.",
  },
  {
    icon: <MapPin className="h-7 w-7" />,
    title: "Local San Diego Expert",
    body: "Ashley lives and works right here in San Diego County. She knows the local plans, local providers, and the people she serves.",
  },
  {
    icon: <Clock className="h-7 w-7" />,
    title: "Available Year-Round",
    body: "Need help in March? July? Ashley's office is available 7 days a week, all year — not just during open enrollment.",
  },
  {
    icon: <Calendar className="h-7 w-7" />,
    title: "In-Person Appointments Available",
    body: "Prefer to meet face to face? Ashley offers in-person appointments in addition to phone and video — whatever is easiest for you.",
  },
];

// ─── REAL CLIENT REVIEWS GO HERE ──────────────────────────────────────────
// Paste real Google review objects into this array once collected.
// Each entry needs: name, location, text, stars (number), featured (bool).
// The single entry with featured:true becomes the large hero testimonial.
// Example shape:
//   { name: "Jane D.", location: "San Diego, CA", text: "…", stars: 5, featured: true }
// ──────────────────────────────────────────────────────────────────────────
const testimonials: { name: string; location: string; text: string; stars: number; featured: boolean }[] = [];

// answerJsx keyed by question text — merges React nodes into the base data
// imported from src/data/homeFaqItems.ts (which the test suite also imports).
// The declared Record<string, ReactNode> type keeps item.q (string) indexable;
// the `satisfies` constraint ensures every key in answerJsxKeys.ts has a
// matching JSX entry here (TypeScript will error if one is missing or
// misspelled).
//
// IMPORTANT: The <Link href> values below are driven by ANSWER_JSX_HREFS
// (src/data/answerJsxKeys.ts) — the single source of truth for provider-page
// slugs referenced from the home FAQ accordion.  The test in
// src/data/home-faq-provider-links.test.ts validates those values against
// the slugs registered in src/data/providerPages.ts.  Update ANSWER_JSX_HREFS
// (not this file) when a provider-page slug changes.
const answerJsxMap: Record<string, ReactNode> = {
  "Does Sharp HealthCare accept Medicare Advantage?": (
    <>Yes — Sharp HealthCare participates in many Medicare Advantage plans available to San Diego beneficiaries, but not every plan. Sharp's hospitals and medical groups are in-network for several major carriers, while other plans may require you to use a different health system or pay out-of-network rates. Before enrolling, I verify that your specific Sharp doctors and facilities are covered under the plan you're considering. Learn more on the <Link href={ANSWER_JSX_HREFS["Does Sharp HealthCare accept Medicare Advantage?"]} className="text-primary underline underline-offset-2 hover:text-primary/80">Sharp HealthCare Medicare Advantage</Link> page.</>
  ),
  "Does Scripps Health accept Medicare Advantage?": (
    <>Scripps Clinic and Scripps Coastal Medical Group have stopped accepting most Medicare Advantage plans, which means many Advantage members can no longer use those Scripps physician groups for their care. If keeping your Scripps doctors is important, Original Medicare paired with a Medigap plan is typically the most dependable path — Medigap doesn't use networks, so it lets you continue seeing Scripps providers who accept Medicare. Learn more on the <Link href={ANSWER_JSX_HREFS["Does Scripps Health accept Medicare Advantage?"]} className="text-primary underline underline-offset-2 hover:text-primary/80">Scripps Health Medicare</Link> page.</>
  ),
  "Does UC San Diego Health accept Medicare Advantage?": (
    <>UC San Diego Health accepts only a limited set of Medicare Advantage plans, and that access has been narrowing. For 2026, UCSD's in-network Advantage access is significantly reduced — some plans that worked in prior years no longer provide the same access, and certain plans reach only specialty services rather than primary care. If keeping UCSD is a priority, Original Medicare with a Medigap plan offers the broadest, most stable access. Learn more on the <Link href={ANSWER_JSX_HREFS["Does UC San Diego Health accept Medicare Advantage?"]} className="text-primary underline underline-offset-2 hover:text-primary/80">UC San Diego Health Medicare</Link> page.</>
  ),
  "Does Kaiser Permanente work with Medicare Advantage?": (
    <>Kaiser Permanente is a closed, integrated system — its doctors, hospitals, and pharmacies work together within Kaiser's own network. To continue receiving care at Kaiser on Medicare, you typically enroll in Kaiser's own Medicare Advantage HMO plan, Kaiser Permanente Senior Advantage. Unlike Sharp or Scripps, Kaiser generally doesn't work with Medigap plans, so the core decision is whether staying inside the Kaiser system is right for you. Learn more on the <Link href={ANSWER_JSX_HREFS["Does Kaiser Permanente work with Medicare Advantage?"]} className="text-primary underline underline-offset-2 hover:text-primary/80">Kaiser Permanente Medicare</Link> page.</>
  ),
  "Does Palomar Health accept Medicare Advantage?": (
    <>Palomar Health participates in some Medicare Advantage networks but not others, and the plans it accepts have changed more than once in recent years — a plan that included Palomar before may not now. Original Medicare with a Medigap plan offers the most stable access to Palomar facilities, while Advantage can still be a good fit for many inland North County residents if you confirm current participation first. Learn more on the <Link href={ANSWER_JSX_HREFS["Does Palomar Health accept Medicare Advantage?"]} className="text-primary underline underline-offset-2 hover:text-primary/80">Palomar Health Medicare</Link> page.</>
  ),
  "Does Tri-City Medical Center accept Medicare Advantage?": (
    <>
      {TRI_CITY_HOME_FAQ_ANSWER_BASE} Learn more on the{" "}
      <Link
        href={
          ANSWER_JSX_HREFS[
            "Does Tri-City Medical Center accept Medicare Advantage?"
          ]
        }
        className="text-primary underline underline-offset-2 hover:text-primary/80"
      >
        Tri-City Medical Center Medicare
      </Link>{" "}
      page.
    </>
  ),
  "Does Paradise Valley Hospital accept Medicare Advantage?": (
    <>
      {PARADISE_VALLEY_HOME_FAQ_ANSWER_BASE} Learn more on the{" "}
      <Link
        href={
          ANSWER_JSX_HREFS[
            "Does Paradise Valley Hospital accept Medicare Advantage?"
          ]
        }
        className="text-primary underline underline-offset-2 hover:text-primary/80"
      >
        Paradise Valley Hospital Medicare
      </Link>{" "}
      page.
    </>
  ),
} satisfies Record<AnswerJsxQuestionKey, ReactNode>;

const faqItems = homeFaqItems.map((item) => ({
  ...item,
  answerJsx: answerJsxMap[item.q] as ReactNode | undefined,
}));

const CARRIERS = [
  { name: "Aetna",            logo: "/carriers/aetna.svg" },
  { name: "Alignment Health", logo: "/carriers/alignment.webp" },
  { name: "Anthem",           logo: "/carriers/anthem.svg" },
  { name: "Astiva Health",    logo: "/carriers/astiva.webp" },
  { name: "Blue Shield",      logo: "/carriers/blueshield.webp" },
  { name: "Central Health",   logo: "/carriers/centralhealth.svg" },
  { name: "CleverCare",       logo: "/carriers/clevercare.webp" },
  { name: "Humana",           logo: "/carriers/humana.webp" },
  { name: "Imperial Health",  logo: "/carriers/imperialhealth.webp" },
  { name: "Molina",           logo: "/carriers/molina.webp" },
  { name: "SCAN",             logo: "/carriers/scan.webp" },
  { name: "UnitedHealthcare", logo: "/carriers/uhc.webp" },
  { name: "Wellcare",         logo: "/carriers/wellcare.webp" },
];

function MarqueTrack() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    Array.from(track.children).forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }, []);

  return (
    <div ref={trackRef} className="flex animate-marquee" style={{ width: "max-content" }}>
      {CARRIERS.map((c) => (
        <div key={c.name} className="flex items-center justify-center mx-8 shrink-0">
          <img
            src={c.logo}
            alt={c.name}
            className="h-12 w-auto max-w-[120px] object-contain"
            loading="lazy"
            decoding="async"
            width="120"
            height="48"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      ))}
    </div>
  );
}

const GHL_FORM_ID = "cLr5X6KK867JMX0HGILX";
const GHL_SCRIPT_ID = "ghl-form-embed-script";

export const HOME_EXTERNAL_DESTINATIONS = {
  ghlForm: `https://link.agent-crm.com/widget/form/${GHL_FORM_ID}`,
  ghlScript: "https://link.agent-crm.com/js/form_embed.js",
  googleReview: "https://g.page/r/CXq7ZBSPtekQEAI/review",
  youtubeChannel: "https://www.youtube.com/@MedicareWithAshley",
  youtubeEmbed: "https://www.youtube-nocookie.com/embed/8HZVjWAe2_w",
  youtubeVideo: "https://www.youtube.com/watch?v=8HZVjWAe2_w",
} as const;

function LeadCaptureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const guideIframeRef = useRef<HTMLIFrameElement>(null);
  const [shouldLoadForm, setShouldLoadForm] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldLoadForm) return;
    if (!("IntersectionObserver" in window)) {
      setShouldLoadForm(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoadForm(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadForm]);

  useEffect(() => {
    if (!shouldLoadForm) return;
    if (document.getElementById(GHL_SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = GHL_SCRIPT_ID;
    script.src = HOME_EXTERNAL_DESTINATIONS.ghlScript;
    script.async = true;
    document.body.appendChild(script);
  }, [shouldLoadForm]);

  useEffect(() => {
    const handleFormMessage = createGhlCompletionHandler(
      () => guideIframeRef.current?.contentWindow ?? null,
      () => {
        trackEvent("guide_request_completion", {
          form_name: "san_diego_medicare_guide",
          form_id: GHL_FORM_ID,
          cta_placement: "home_guide_form",
        });
      },
    );

    window.addEventListener("message", handleFormMessage);
    return () => window.removeEventListener("message", handleFormMessage);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-[#0F2044] to-[#1e4d9e] text-white" data-testid="lead-capture-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Free Resource
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              Get Your Free San Diego Medicare Guide
            </h2>
            <p className="text-white/85 text-lg leading-relaxed mb-4">
              Not sure where to start? Ashley's free guide walks you through every Medicare option available to San Diego seniors — plain English, no jargon.
            </p>
            <ul className="space-y-3 text-white/85">
              {[
                "Medicare Advantage vs. Supplement — which is right for you",
                "How to avoid costly late-enrollment penalties",
                "What's actually covered (and what isn't)",
                "San Diego-specific plan options and costs",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-[#A3D136] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-full max-w-[600px] mx-auto">
              <button
                type="button"
                onClick={() => setShouldLoadForm(true)}
                className={
                  shouldLoadForm
                    ? "mb-3 w-full rounded-lg bg-slate-100 px-4 py-3 text-center font-semibold text-[#0F2044] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A3D136]"
                    : "flex min-h-[560px] w-full items-center justify-center rounded-lg bg-slate-50 px-6 text-center font-semibold text-[#0F2044] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A3D136]"
                }
                aria-controls={`inline-${GHL_FORM_ID}`}
                aria-expanded={shouldLoadForm}
              >
                {shouldLoadForm
                  ? "Medicare guide form loaded below"
                  : "Load the free Medicare guide form"}
              </button>
              {shouldLoadForm && (
                <a
                  href={HOME_EXTERNAL_DESTINATIONS.ghlForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 block text-center text-sm font-semibold text-[#0F2044] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A3D136]"
                >
                  Open the Medicare guide form in a new tab
                </a>
              )}
              {shouldLoadForm && (
                  <iframe
                    ref={guideIframeRef}
                    src={HOME_EXTERNAL_DESTINATIONS.ghlForm}
                    id={`inline-${GHL_FORM_ID}`}
                    data-layout="{'id':'INLINE'}"
                    data-form-id={GHL_FORM_ID}
                    title="free guide from website"
                    loading="lazy"
                    tabIndex={0}
                    style={{
                      width: "100%",
                      minHeight: "560px",
                      height: "560px",
                      border: "none",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function YouTubeFacade() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { youtubeEmbed: embedUrl, youtubeVideo: videoUrl } =
    HOME_EXTERNAL_DESTINATIONS;

  if (isLoaded) {
    return (
      <iframe
        src={embedUrl}
        title="Medicare with Ashley — YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <a
      href={videoUrl}
      onClick={(event) => {
        event.preventDefault();
        setIsLoaded(true);
      }}
      data-analytics-placement="home_video_embed"
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0F2044] to-[#1e4d9e] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#A3D136]"
      aria-label="Load Medicare with Ashley videos from YouTube"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl text-[#0F2044] shadow-xl transition-transform hover:scale-105" aria-hidden="true">
        ▶
      </span>
      <span className="sr-only">Load Medicare with Ashley videos</span>
    </a>
  );
}

export default function Home() {
  return (
    <div data-page="home">
      <SEOHead
        title="Medicare Broker San Diego | Medicare with Ashley"
        canonical="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.schemaText ?? item.a
            }
          }))
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0F2044] via-[#163570] to-[#1e4d9e] text-white overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* Text column */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Serving all of San Diego County
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Medicare Is Confusing. I Make It Simple.
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed">
                I'm Ashley, a local independent Medicare broker helping San Diego County residents understand their options, compare plans, and choose coverage with confidence — at no cost to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  className="min-h-[56px] bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-bold text-xl px-8 py-4 h-auto rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  <a
                    href="tel:+16199472325"
                    data-testid="hero-call-button"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Ashley: (619) 947-2325
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-[56px] border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent transition-all duration-200"
                >
                  <Link
                    href="/schedule"
                    data-testid="hero-schedule-button"
                  >
                    Schedule My Free Medicare Review
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-center lg:text-left text-white/80 text-sm font-medium tracking-wide">
                Local &nbsp;·&nbsp; Independent &nbsp;·&nbsp; Licensed &nbsp;·&nbsp; No Cost to You
              </p>
            </div>

            {/* Headshot column */}
            <div className="shrink-0 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl scale-110" />
                <img
                  src="/ashley-watson.webp"
                  srcSet="/ashley-watson-320.webp 320w, /ashley-watson-480.webp 480w, /ashley-watson.webp 640w"
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 320px, 256px"
                  alt="Ashley Watson — San Diego Medicare Broker"
                  className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full object-cover object-top shadow-2xl ring-4 ring-white/30"
                  fetchPriority="high"
                  width="640"
                  height="520"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#0A1830] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm flex-wrap">
            {[
              "Local San Diego Medicare Broker",
              "Independent — Compare Multiple Plans",
              "No Cost to You",
              "Licensed Medicare Professional",
              "Year-Round Client Support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#A3D136] shrink-0" />
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carrier Logo Strip */}
      <section className="py-10 bg-white border-y border-border overflow-hidden" data-testid="carriers-section">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          Contracted with Leading Medicare Carriers
        </p>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />
          <MarqueTrack />
        </div>
      </section>

      {/* How Can I Help? */}
      <section className="py-20 bg-background" data-testid="how-can-i-help-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How Can I Help?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Wherever you are in the Medicare process, Ashley has helped someone in your exact situation. Tell her where you're starting from.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "I'm Turning 65",
                desc: "Learn when to enroll, what Medicare covers, and what decisions you'll need to make before your birthday.",
                cta: "Help Me Get Started",
                href: "/turning-65",
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "I Want to Review My Plan",
                desc: "Not sure if your current coverage still fits? Ashley can compare your options and help you decide whether a change makes sense.",
                cta: "Review My Coverage",
                href: "/schedule",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Medicare Advantage",
                desc: "Learn how Medicare Advantage plans work and whether one might fit your healthcare needs and budget.",
                cta: "Explore Medicare Advantage",
                href: "/medicare-advantage",
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Medicare Supplement",
                desc: "Learn how Medigap coverage works alongside Original Medicare and what it actually covers.",
                cta: "Explore Medicare Supplements",
                href: "/medicare-supplements",
              },
            ].map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="border-2 border-border hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer h-full hover:-translate-y-1">
                  <CardContent className="p-7 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {card.icon}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-foreground mb-3">{card.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm flex-1 mb-5">{card.desc}</p>
                    <div className="flex items-center text-primary font-semibold text-sm">
                      {card.cta} <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Ashley */}
      <section className="py-20 bg-accent/30" data-testid="about-teaser-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Your Local Medicare Broker</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Meet Ashley
              </h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-4">
                Ashley Watson became an independent Medicare broker because she watched too many San Diego seniors make costly Medicare mistakes — not from lack of intelligence, but from a lack of someone patient enough to truly explain their options.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-4">
                As a local San Diego broker, Ashley works one-on-one with each client. She reviews your doctors, your prescriptions, and your budget — then walks you through every option in plain English. No jargon. No rush. No pressure.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                Whether you're turning 65, losing employer coverage, or simply want to make sure you're in the right plan, Ashley is here — by phone, video, or in person, 7 days a week, always at no cost to you.
              </p>
              <Link href="/about">
                <Button className="rounded-full bg-primary text-primary-foreground px-8 py-3 h-auto text-base hover:bg-primary/90">
                  Meet Ashley →
                </Button>
              </Link>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <img
                  src="/ashley-watson.webp"
                  alt="Ashley Watson — San Diego Medicare Broker"
                  data-testid="about-photo"
                  className="w-64 sm:w-80 rounded-2xl shadow-xl object-cover object-top"
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="520"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary font-serif">5★</p>
                  <p className="text-xs text-muted-foreground">All 5-Star<br />Google Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Video */}
      <section className="py-20 bg-background" data-testid="video-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Watch & Learn</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Hear From Ashley Directly
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Ashley regularly shares Medicare tips and answers common questions on her YouTube channel. Watch a video, then schedule a free call when you're ready.
          </p>
          {/* YouTube embed — replace VIDEO_ID below with a specific video ID, or leave as channel link */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-[#0F2044] aspect-video">
            <YouTubeFacade />
          </div>
          <p className="text-muted-foreground text-sm mt-4">
            Want a specific video here?{" "}
            <a
              href={HOME_EXTERNAL_DESTINATIONS.youtubeChannel}
              data-analytics-placement="home_video_channel_link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Visit Ashley's YouTube channel →
            </a>
          </p>
        </div>
      </section>

      {/* Why Work With Ashley */}
      <section className="py-20 bg-accent/20" data-testid="trust-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Work With Ashley?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Medicare is complicated. Working with Ashley doesn't have to be.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {whyPoints.map((point, i) => (
              <div key={i} className="flex gap-4" data-testid={`trust-point-${i}`}>
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mt-0.5">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-lg mb-2">{point.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 bg-white border-l-4 border-primary rounded-r-2xl shadow-sm p-7 max-w-3xl mx-auto">
            <p className="font-serif text-xl font-semibold text-foreground mb-2">
              "If your current plan is already a good fit, Ashley may tell you to keep it."
            </p>
            <p className="text-muted-foreground leading-relaxed">
              That's the kind of honest, no-pressure help you'll get. No agenda — just the right answer for your situation.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Client Stories</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What San Diego Residents Are Saying
            </h2>
          </div>

          {/* ── REAL REVIEWS GO HERE ──────────────────────────────────────────────────
              Paste real Google review cards above this comment once collected.
              See the `testimonials` array at the top of this file for the expected shape.
              ──────────────────────────────────────────────────────────────────────── */}
          <div className="max-w-2xl mx-auto text-center py-10" data-testid="testimonials-placeholder">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <p className="text-foreground font-semibold text-lg mb-2">Client reviews coming soon</p>
            <p className="text-muted-foreground leading-relaxed">
              Ashley works with clients across San Diego County every day. Real Google reviews will appear here once collected.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Had a great experience with Ashley? Your review helps other San Diego seniors find trustworthy Medicare help.
            </p>
            <a
              href={HOME_EXTERNAL_DESTINATIONS.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-border text-foreground font-medium text-sm px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-shadow"
              data-testid="leave-review-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Leave a Google Review
            </a>
          </div>
        </div>
      </section>

      {/* What Happens When You Call? */}
      <section className="py-20 bg-background" data-testid="process-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Happens When You Call Ashley?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No scripts. No pressure. Just a real conversation about your Medicare situation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              {
                step: "1",
                title: "Tell Me What's Going On",
                body: "We'll talk about where you are with Medicare and what you're looking for. There's no wrong place to start — Ashley has heard it all.",
              },
              {
                step: "2",
                title: "We'll Compare Your Options",
                body: "Ashley will help you understand the differences that actually matter for your situation — your doctors, your prescriptions, your budget.",
              },
              {
                step: "3",
                title: "You Decide",
                body: "Ashley will explain your options clearly and answer your questions. The decision is always yours — she's here to help, not to push.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-serif font-bold text-2xl flex items-center justify-center mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="font-serif font-bold text-xl text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-foreground/60 text-base italic mb-8">
            No pressure. No confusing insurance jargon. Just straightforward Medicare help.
          </p>
          <div className="text-center">
            <a href="tel:+16199472325">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-4 h-auto rounded-full min-h-[52px]">
                <Phone className="mr-2 h-5 w-5" />
                Call Ashley: (619) 947-2325
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Medicare Plans */}
      <section className="py-20 bg-accent/20" data-testid="plans-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Medicare Plans Ashley Helps With
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-6">
              Ashley explains Medicare Advantage, Medigap plans, Medicare Part D, and more — clearly, so you can choose with confidence.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 max-w-3xl mx-auto mb-6 text-left">
              <p className="text-foreground/80 leading-relaxed mb-2">
                <strong>Have both Medicare and Medi-Cal?</strong> Ashley specializes in helping San Diego County residents who qualify for both programs — also called "dual-eligible" clients — understand how the two work together and find the right plan structure.
              </p>
              <Link href="/medicare-medi-cal-dual-eligible-san-diego" className="text-primary font-medium text-sm hover:underline underline-offset-4">
                See how Ashley helps dual-eligible San Diegans →
              </Link>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Ashley is deeply knowledgeable about the local and federal programs that help people save money on Medicare — like Extra Help, IRMAA appeals, and California's HICAP resources.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Link key={plan.title} href={plan.href}>
                <Card
                  data-testid={`plan-card-${plan.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`border-2 h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${plan.color}`}
                >
                  <CardContent className="p-6">
                    <div className={`mb-3 ${plan.iconColor}`}>
                      <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-foreground mb-1">{plan.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground mb-3">{plan.subtitle}</p>
                    <p className="text-foreground/80 leading-relaxed text-base">{plan.description}</p>
                    <div className="mt-4 flex items-center text-primary font-medium text-sm">
                      Learn more <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/services">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-accent px-8 py-3 h-auto text-base">
                View All Medicare Services
              </Button>
            </Link>
            <Link href="/carriers">
              <Button variant="outline" className="rounded-full border-primary/60 text-primary hover:bg-accent px-8 py-3 h-auto text-base">
                See all the carriers I work with
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* San Diego Medicare in 2026 */}
      <section className="py-20 bg-accent/20" data-testid="san-diego-2026-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Local Expertise</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              San Diego Medicare in 2026: What's Changed
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Local provider networks and Medicare rules shift every year — Ashley tracks the changes so her San Diego clients don't have to.
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-7">
              <h3 className="font-serif font-bold text-xl text-foreground mb-3">Scripps and Medicare Advantage</h3>
              <p className="text-foreground/80 leading-relaxed">
                Scripps Clinic and Scripps Coastal stopped accepting Medicare Advantage plans as of January 1, 2024, and this remains the case in 2026. Patients who want continued access to Scripps doctors typically need Original Medicare, often paired with a Medicare Supplement (Medigap) plan. That said, Scripps hospitals remain in-network with many Advantage plans, and some affiliated groups — such as Golden Physicians Medical Group — still accept certain Advantage plans and can provide access to Scripps Clinic specialists, a nuance that significantly affects plan selection for many San Diego seniors.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-border p-7">
              <h3 className="font-serif font-bold text-xl text-foreground mb-3">UCSD and Medicare Advantage</h3>
              <p className="text-foreground/80 leading-relaxed">
                UCSD Health still participates with several Medicare Advantage plans in San Diego, but access to exclusive UCSD primary care physicians is limited depending on the plan. One option available to San Diego Medicare beneficiaries is UCSD Medical Group access through the SCAN Select plan. Ashley checks current UCSD network participation as part of every consultation for clients who want to keep their UCSD providers.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-border p-7">
              <h3 className="font-serif font-bold text-xl text-foreground mb-3">Sharp HealthCare and Medicare Advantage</h3>
              <p className="text-foreground/80 leading-relaxed mb-3">
                Sharp HealthCare — San Diego's largest health system, with eight hospitals and a vast network of affiliated physicians — participates broadly with Medicare Advantage plans in the county. Most major carriers include Sharp providers in-network, but coverage varies by plan and medical group. Choosing a plan that covers your Sharp doctor requires a careful check before you enroll.
              </p>
              <Link href="/sharp-healthcare-medicare-san-diego" className="inline-flex items-center text-primary font-medium hover:underline text-sm">
                How Sharp HealthCare works with Medicare in San Diego →
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-border p-7">
              <h3 className="font-serif font-bold text-xl text-foreground mb-3">Prescription Drug Cost Cap</h3>
              <p className="text-foreground/80 leading-relaxed">
                Medicare Part D now has an annual out-of-pocket cap of <strong>$2,100</strong> on covered prescription drugs for 2026 — a significant protection for seniors managing high drug costs. Once you reach that cap in a calendar year, you pay $0 for covered drugs for the rest of that year.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-border p-7">
              <h3 className="font-serif font-bold text-xl text-foreground mb-3">When You Can Make Changes</h3>
              <p className="text-foreground/80 leading-relaxed">
                The Annual Enrollment Period runs October 15 – December 7 each year, allowing you to switch Medicare Advantage plans, move between Original Medicare and Medicare Advantage, or change your Part D drug plan — with new coverage starting January 1. The Medicare Advantage Open Enrollment Period runs January 1 – March 31 for people already enrolled in a Medicare Advantage plan. Ashley can also check eligibility for Special Enrollment Periods year-round for clients who experience qualifying life events.
              </p>
              <Link href="/medicare-annual-enrollment-period-san-diego" className="inline-block mt-3 text-primary font-medium hover:underline underline-offset-4 text-sm">
                Get help during Annual Enrollment →
              </Link>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/schedule" className="text-primary font-medium hover:underline underline-offset-4">
              Not sure how these changes affect you? Schedule a free review with Ashley →
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6" data-last-updated="san-diego-2026">
            Last updated: July 2026
          </p>
        </div>
      </section>

      {/* Medicare Education */}
      <section className="py-16 bg-accent/30" data-testid="education-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Medicare Education</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-5">
            New to Medicare? Start Here.
          </h2>
          <p className="text-foreground/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Medicare has Parts A, B, C, and D — plus Supplements, Extra Help, and more. Ashley's Medicare Basics guide breaks it all down in plain English, so you can walk into your consultation already feeling informed.
          </p>
          <Link href="/medicare-basics">
            <Button className="rounded-full bg-primary text-primary-foreground px-8 py-3 h-auto text-base hover:bg-primary/90">
              Learn Medicare Basics →
            </Button>
          </Link>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-background" data-testid="service-areas-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Service Area</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Serving All of San Diego County
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Need a Medicare broker in Chula Vista, El Cajon, Escondido, National City, or North County San Diego? Ashley comes to you — by phone, video, or in person, at no charge.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
            {[
              { city: "Chula Vista", desc: "South Bay", href: "/medicare-broker-chula-vista" },
              { city: "El Cajon", desc: "East County", href: "/medicare-broker-el-cajon" },
              { city: "Escondido", desc: "North County", href: "/medicare-broker-escondido" },
              { city: "Poway", desc: "Inland North County", href: "/medicare-broker-poway/" },
              { city: "Vista", desc: "North County" },
              { city: "Oceanside", desc: "North Coastal", href: "/medicare-broker-oceanside" },
              { city: "La Mesa", desc: "East San Diego", href: "/medicare-broker-la-mesa" },
              { city: "National City", desc: "South Bay", href: "/medicare-broker-national-city" },
              { city: "South Bay San Diego", desc: "South Bay region", href: "/medicare-help-south-bay-san-diego" },
              { city: "Santee", desc: "East County", href: "/medicare-broker-santee" },
              { city: "Imperial Beach", desc: "South Bay" },
              { city: "Lakeside", desc: "East County" },
              { city: "Eastlake", desc: "East Chula Vista" },
              { city: "San Marcos", desc: "North County", href: "/medicare-broker-san-marcos/" },
              { city: "Mission Valley", desc: "Central San Diego" },
              { city: "Spring Valley", desc: "East County" },
              { city: "Lemon Grove", desc: "East San Diego" },
              { city: "Coronado", desc: "Bay Area" },
              { city: "San Diego", desc: "All neighborhoods" },
            ].map(({ city, desc, href }) => (
              href ? (
                <Link key={city} href={href}>
                  <div
                    className="bg-accent/40 rounded-xl p-4 text-center hover:bg-primary/10 hover:shadow-sm transition-all cursor-pointer"
                    data-testid={`service-area-${city.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <p className="font-semibold text-foreground text-sm">{city}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                  </div>
                </Link>
              ) : (
                <div
                  key={city}
                  className="bg-accent/40 rounded-xl p-4 text-center hover:bg-accent/70 transition-colors"
                  data-testid={`service-area-${city.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <p className="font-semibold text-foreground text-sm">{city}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
                </div>
              )
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Don't see your city? <a href="tel:+16199472325" className="text-primary font-medium hover:underline">Call Ashley</a> — if you're in San Diego County, she serves you.
          </p>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" data-testid="faq-preview-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Common Medicare Questions
            </h2>
            <p className="text-muted-foreground text-lg">Plain-English answers to questions Ashley hears every day.</p>
          </div>
          <div className="space-y-3">
            {faqItems.slice(0, 7).map((item, i) => (
              <details
                key={i}
                className="group border border-border rounded-xl px-6 bg-card shadow-sm"
                data-testid={`faq-preview-${i}`}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-serif font-semibold text-foreground text-lg leading-snug">{item.q}</h3>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="text-foreground/80 text-base pb-5 leading-relaxed">{item.answerJsx ?? item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/faq" className="inline-flex items-center gap-1 text-primary font-semibold text-base hover:underline underline-offset-2">
              See all Medicare FAQs <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <LeadCaptureSection />

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
            Still Have Medicare Questions?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            You don't have to figure everything out before calling. Tell Ashley where you are in the process and she'll help you understand your next step — no pressure, no cost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="tel:+16199472325">
              <Button
                data-testid="cta-call-button"
                className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-bold text-xl px-10 py-4 h-auto rounded-full shadow-md min-h-[56px]"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Ashley: (619) 947-2325
              </Button>
            </a>
            <Link href="/schedule">
              <Button
                data-testid="cta-schedule-button"
                variant="outline"
                className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-10 py-4 h-auto rounded-full bg-transparent min-h-[56px]"
              >
                Schedule My Free Medicare Review
              </Button>
            </Link>
          </div>
          <p className="text-primary-foreground/70 text-sm">
            Serving Medicare beneficiaries throughout San Diego County.
          </p>
        </div>
      </section>
    </div>
  );
}

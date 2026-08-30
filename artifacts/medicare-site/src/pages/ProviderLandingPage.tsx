import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Calendar, Building2, BookOpen, MapPin, Clock, Users, ChevronRight } from "lucide-react";
import type { ProviderPageConfig } from "@/data/providerPages";
export type { ProviderPageConfig };

const whyPoints = [
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Independent Broker",
    body: "Not tied to any single company. Ashley shops every major Medicare carrier to find what's right for you.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Multiple Carriers",
    body: "Contracted with all leading Medicare carriers in San Diego — Ashley compares dozens of plans side by side.",
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "No-Cost Consultations",
    body: "Ashley is paid by insurance carriers — never by you. Her time and advice are always 100% free.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Reviews Doctors & Prescriptions",
    body: "Before recommending any plan, Ashley checks that your doctors and medications are covered at the best cost.",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Local San Diego Expert",
    body: "Ashley lives and works in San Diego County. She knows the local plans, local providers, and the community.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Available Year-Round",
    body: "Ashley's office is available 7 days a week, all year long — not just during open enrollment.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "In-Person Appointments",
    body: "Prefer to meet face to face? Ashley offers in-person appointments in addition to phone and video calls.",
  },
];

export default function ProviderLandingPage({ slug, metaTitle, metaDescription, title, bodyHtml, faqSchema }: ProviderPageConfig) {
  return (
    <div>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={`/${slug}/`}
        schemaJson={faqSchema}
      />

      {/* Hero — title displayed prominently; h1 lives inside bodyHtml for single-h1 SEO */}
      <section className="bg-gradient-to-br from-[#0F2044] via-[#163570] to-[#1e4d9e] text-white py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-white/80 font-semibold uppercase tracking-wide text-sm mb-4">
                Medicare with Ashley · San Diego County
              </p>
              <p className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-6">
                {title}
              </p>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Ashley Watson is a licensed, independent Medicare broker serving San Diego County — at no cost to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/schedule">
                  <Button className="bg-white text-[#0F2044] hover:bg-white/90 font-semibold text-lg px-8 py-4 h-auto rounded-full shadow-lg min-h-[48px]">
                    Schedule Free Consultation
                  </Button>
                </Link>
                <a href="tel:+16199472325">
                  <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent min-h-[48px]">
                    <Phone className="mr-2 h-5 w-5" />
                    (619) 947-2325
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img
                src="/ashley-watson.webp"
                alt="Ashley Watson — Medicare Broker serving San Diego County"
                className="w-72 rounded-3xl shadow-2xl object-cover object-top"
                loading="lazy"
                width="288"
                height="360"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#0A1830] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm flex-wrap">
            {["100% Free Consultations", "Independent & Unbiased", "Serving All of San Diego County", "CA License #4052120"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#A3D136] shrink-0" />
                <span className="text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider body content — includes h1, FAQ, and JSON-LD in static HTML */}
      <section data-section="provider-body" className="py-12 bg-background">
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-2 [&_h1]:mb-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-foreground/80 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4 [&_li]:text-foreground/80 [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground [&_strong]:font-semibold [&_script]:hidden"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </section>

      {/* Why Work With Ashley */}
      <section className="py-16 bg-accent/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3 text-center">
            Why San Diego Residents Choose Ashley
          </h2>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">
            There are many Medicare brokers in San Diego County. Here's what sets Ashley apart.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {whyPoints.map((point, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm mt-0.5">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-base mb-1.5">{point.title}</h3>
                  <p className="text-foreground/70 leading-relaxed text-sm">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
            Medicare Plans & Programs Ashley Helps With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "Medicare Advantage (Part C) plans",
              "Medicare Supplement / Medigap plans",
              "Medicare Part D prescription drug plans",
              "Medicare Savings Programs (Extra Help)",
              "Turning 65 enrollment guidance",
              "Annual plan reviews (Open Enrollment)",
              "Medi-Cal application assistance",
              "CalFresh application assistance",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground/80 text-lg">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/services" className="inline-flex items-center text-primary font-medium hover:underline text-lg">
            See the full services overview →
          </Link>
        </div>
      </section>

      {/* AEP Callout */}
      <section className="py-14 bg-accent/30 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Calendar className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Reviewing Your Medicare Plan During Annual Enrollment?
              </h2>
              <p className="text-foreground/75 text-lg leading-relaxed mb-4">
                Every fall (October 15 – December 7), Medicare beneficiaries can switch plans, drop coverage, or add drug coverage — with changes taking effect January 1. Ashley comes to you throughout San Diego County and makes the review process simple and free.
              </p>
              <Link
                href="/medicare-annual-enrollment-period-san-diego"
                className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline text-base"
              >
                Learn about the Annual Enrollment Period
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">
            Ready to Talk to a Medicare Broker in San Diego?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Schedule your free consultation today. No obligation, no pressure — just clear answers from a local Medicare broker who knows San Diego County.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full min-h-[52px]">
                Schedule Free Consultation
              </Button>
            </Link>
            <a href="tel:+16199472325">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent min-h-[52px]">
                <Phone className="mr-2 h-5 w-5" />
                (619) 947-2325
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Phone, Mail, MapPin, ChevronRight } from "lucide-react";

const values = [
  "Honest, unbiased guidance — no sales pressure, ever",
  "Plain English explanations for every Medicare concept",
  "Personalized attention — not a one-size-fits-all answer",
  "Responsive support before, during, and after enrollment",
  "Annual reviews to make sure your plan still fits your life",
  "Compassion for the confusing and sometimes stressful process",
];

const credentials = [
  "Licensed California Insurance Agent/Broker — License #4052120",
  "Certified in Medicare Advantage and Part D",
  "Independent broker — not captive to any single carrier",
  "5 years serving San Diego County residents",
  "Ongoing continuing education in Medicare regulations",
];

export default function About() {
  return (
    <div>
      <SEOHead
        title="About Ashley Watson | Independent Medicare Broker San Diego | Medicare with Ashley"
        description="Meet Ashley Watson, San Diego's trusted independent Medicare broker. Serving Chula Vista, El Cajon, Escondido, and all of San Diego County. Free consultations, 7 days a week. Call 619-947-2325."
        canonical="/about/"
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-24" data-testid="about-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">About Ashley</p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Your Local Medicare Guide in San Diego
              </h1>
              <p className="text-foreground/80 text-xl leading-relaxed mb-6">
                Hi, I'm Ashley Watson — your independent Medicare broker in San Diego, local resident, and proud mom of two boys (and two dogs named Sunny and Jack).
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                I started Medicare with Ashley to make Medicare help in San Diego honest, personal, and pressure-free — because you shouldn't have to figure this out alone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/schedule">
                  <Button className="rounded-full bg-primary text-primary-foreground px-8 py-3 h-auto text-base">
                    Schedule a Free Consultation
                  </Button>
                </Link>
                <a href="tel:+16199472325">
                  <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-accent px-8 py-3 h-auto text-base">
                    <Phone className="mr-2 h-4 w-4" />
                    (619) 947-2325
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="/ashley-watson.webp"
                  alt="Ashley Watson — San Diego Medicare Broker"
                  data-testid="about-headshot"
                  className="w-72 sm:w-96 rounded-3xl shadow-xl object-cover object-top"
                  loading="lazy"
                  width="640"
                  height="520"
                />
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg p-5">
                  <p className="text-3xl font-bold text-primary font-serif">5</p>
                  <p className="text-xs text-muted-foreground leading-tight">Years of<br />Medicare Expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-20 bg-background" data-testid="bio-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">About Ashley</h2>
          <div className="prose prose-lg max-w-none text-foreground/80 space-y-5 leading-relaxed">
            <p>
              As your local Medicare broker in San Diego, I'm not tied to any carrier — my only goal is finding the best Medicare plans in San Diego for your life. Whether you need Medicare Advantage, Medigap plans, or Medicare Part D coverage in San Diego County, I compare all your options and give you a straight answer.
            </p>
            <p>
              If you're turning 65 in San Diego and need Medicare enrollment help, my team is available seven days a week and I come to you — whether that's in your home, over the phone, or on a video call.
            </p>
            <p>
              Originally from Nebraska, I've called San Diego home for years. When I'm not helping clients, you'll find me paddleboarding, hiking, biking, playing Pokémon Go with my family, or catching a basketball game.
            </p>
            <p>
              I won't push a plan because it pays a higher commission. I'll recommend the plan that's actually right for you — and I'll be here after enrollment to make sure everything is working as expected.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-accent/30" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">What Ashley Believes In</h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                Every interaction with Ashley is guided by a few core commitments. These aren't just talking points — they're the principles she works by every day.
              </p>
              <ul className="space-y-4">
                {values.map((v, i) => (
                  <li key={i} className="flex items-start gap-3" data-testid={`value-item-${i}`}>
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-lg">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Credentials & Experience</h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                Ashley maintains all required licensure and stays current with the latest Medicare rules and plan options.
              </p>
              <ul className="space-y-4 mb-10">
                {credentials.map((c, i) => (
                  <li key={i} className="flex items-start gap-3" data-testid={`credential-item-${i}`}>
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-lg">{c}</span>
                  </li>
                ))}
              </ul>
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-foreground text-xl mb-4">Service Area</h3>
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-foreground">All of San Diego County</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Your local Medicare broker near you — serving San Diego, Chula Vista, El Cajon, Escondido, National City, Oceanside, San Marcos, Mission Valley, Imperial Beach, Lakeside, and all of San Diego County.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <Mail className="h-5 w-5 text-primary shrink-0" />
                    <a href="mailto:ashley@medicarewithashley.com" className="text-primary hover:underline text-sm">
                      ashley@medicarewithashley.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-primary shrink-0"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                    <a href="https://www.linkedin.com/in/ashleyjwatson7" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                      linkedin.com/in/ashleyjwatson7
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="about-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">Get to Know Ashley in Person</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            The best way to get Medicare help in San Diego is to start with a free conversation. Book your free Medicare consultation in San Diego today — no obligation, and you'll leave with more clarity than when you started.
          </p>
          <Link href="/schedule">
            <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
              Schedule a Free Conversation
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

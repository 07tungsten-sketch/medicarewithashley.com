import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Phone, Mail, ChevronRight, Loader2 } from "lucide-react";

const topics = [
  "Turning 65 — just getting started",
  "Comparing Medicare Advantage plans",
  "Comparing Medicare Supplement (Medigap) plans",
  "Prescription drug plan comparison",
  "Annual plan review",
  "Switching plans",
  "Medi-Cal or CalFresh assistance",
  "General Medicare question",
  "Other",
];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  preferredContact: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  topic: "",
  message: "",
  preferredContact: "",
};

const whyPoints = [
  {
    title: "Truly Independent",
    body: "Ashley is not captive to any single insurance company. As an independent Medicare broker in San Diego, she compares plans from every major carrier and recommends the one that's right for you — not the one that pays the highest commission.",
  },
  {
    title: "Always Free",
    body: "There is never a fee for Ashley's time, advice, or enrollment help. A Medicare broker in San Diego is paid by the insurance carriers, not by you — so your consultation costs nothing.",
  },
  {
    title: "Local & Available",
    body: "Ashley lives and works in San Diego County. She meets clients in person, by phone, or on video — seven days a week. When you need a local Medicare broker near you, she's available.",
  },
  {
    title: "Support After Enrollment",
    body: "The relationship doesn't end once you enroll. Ashley is available year-round for billing questions, claims issues, and annual plan reviews to make sure your plan still fits your life.",
  },
];

export default function SanDiegoMedicareBroker() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/contact`.replace("//", "/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          topic: form.topic || undefined,
          preferredContact: form.preferredContact || undefined,
          message: form.message || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Submission failed");
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try calling Ashley directly at (619) 947-2325."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <SEOHead
        title="Medicare Broker in San Diego CA | Medicare with Ashley"
        description="Looking for a Medicare broker in San Diego? Ashley Watson is a licensed, independent Medicare broker serving all of San Diego County. Free consultations, 7 days a week. Call (619) 947-2325."
        canonical="/san-diego-medicare-broker/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2044] via-[#163570] to-[#1e4d9e] text-white py-16 lg:py-24" data-testid="sdb-hero">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-white/80 font-semibold uppercase tracking-wide text-sm mb-4">Medicare with Ashley</p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-6">
                Your Local Medicare Broker in San Diego, CA.
              </h1>
              <p className="text-xl text-white/90 mb-4 leading-relaxed">
                Ashley Watson is a licensed, independent Medicare broker in San Diego helping residents across all of San Diego County find the right Medicare coverage — for free.
              </p>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                Whether you're new to Medicare, turning 65, or shopping for a better plan, Ashley takes the time to explain your options clearly and help you enroll with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/schedule">
                  <Button className="bg-white text-[#0F2044] hover:bg-white/90 font-semibold text-lg px-8 py-4 h-auto rounded-full shadow-lg">
                    Book a Free Consultation
                  </Button>
                </Link>
                <a href="tel:+16199472325">
                  <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                    <Phone className="mr-2 h-5 w-5" />
                    (619) 947-2325
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img
                src="/ashley-watson.webp"
                alt="Ashley Watson — Medicare Broker San Diego"
                className="w-80 rounded-3xl shadow-2xl object-cover object-top"
                loading="lazy"
                width="640"
                height="520"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Intro content */}
      <section className="py-16 bg-background" data-testid="sdb-intro">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
            What Does a Medicare Broker in San Diego Do?
          </h2>
          <div className="space-y-5 text-foreground/80 text-lg leading-relaxed">
            <p>
              A Medicare broker in San Diego is a licensed insurance professional who helps you shop, compare, and enroll in Medicare plans — at no cost to you. Unlike agents who work for a single carrier, an independent Medicare broker in San Diego represents dozens of insurance companies and is legally required to recommend the plan that best fits your needs, not the one that benefits the broker.
            </p>
            <p>
              Ashley Watson has been helping San Diego County residents navigate Medicare for years. She works with clients one-on-one, meets them wherever is convenient, and spends as much time as needed to make sure they fully understand their coverage before signing anything.
            </p>
            <p>
              From Medicare Advantage and Medigap plans to Part D prescription drug coverage, Medi-Cal, and CalFresh assistance — Ashley handles it all. If you've been searching for a Medicare broker in San Diego who puts your interests first, you've found the right place.
            </p>
          </div>
        </div>
      </section>

      {/* Why Ashley */}
      <section className="py-16 bg-accent/30" data-testid="sdb-why">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3 text-center">
            Why San Diego Residents Choose Ashley
          </h2>
          <p className="text-muted-foreground text-lg text-center mb-12 max-w-2xl mx-auto">
            There are many Medicare brokers in San Diego. Here's what sets Ashley apart.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {whyPoints.map((point, i) => (
              <div key={i} className="flex gap-4" data-testid={`sdb-why-${i}`}>
                <div className="shrink-0 w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm mt-0.5">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-foreground text-xl mb-2">{point.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services covered */}
      <section className="py-16 bg-background" data-testid="sdb-services">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
            Plans & Programs Ashley Helps With
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
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/services" className="inline-flex items-center text-primary font-medium hover:underline">
            See the full services overview <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Contact form + sidebar */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50" data-testid="sdb-contact">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                Get in Touch
              </h2>
              <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
                Send Ashley a message and she'll follow up within one business day. Or call her directly at{" "}
                <a href="tel:+16199472325" className="text-primary font-medium hover:underline">
                  (619) 947-2325
                </a>.
              </p>

              {submitted ? (
                <Card className="border-0 shadow-md bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-[#5d8a00]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Message Sent!</h3>
                    <p className="text-foreground/70 mb-6">
                      Thanks for reaching out. Ashley will be in touch shortly. If you'd like to talk sooner, call{" "}
                      <a href="tel:+16199472325" className="text-primary font-medium hover:underline">
                        (619) 947-2325
                      </a>.
                    </p>
                    <Link href="/schedule">
                      <Button className="rounded-full bg-primary text-primary-foreground px-8 py-3 h-auto">
                        Book a Free Consultation
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-md bg-white">
                  <CardContent className="p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sdb-firstName" className="text-sm font-medium text-foreground mb-1.5 block">
                            First Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="sdb-firstName"
                            value={form.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            required
                            placeholder="Jane"
                            className="rounded-lg border-border"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sdb-lastName" className="text-sm font-medium text-foreground mb-1.5 block">
                            Last Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="sdb-lastName"
                            value={form.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            required
                            placeholder="Smith"
                            className="rounded-lg border-border"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="sdb-email" className="text-sm font-medium text-foreground mb-1.5 block">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="sdb-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                          placeholder="jane@example.com"
                          className="rounded-lg border-border"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sdb-phone" className="text-sm font-medium text-foreground mb-1.5 block">
                          Phone Number
                        </Label>
                        <Input
                          id="sdb-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="(619) 555-0100"
                          className="rounded-lg border-border"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sdb-topic" className="text-sm font-medium text-foreground mb-1.5 block">
                          What can Ashley help you with?
                        </Label>
                        <Select value={form.topic} onValueChange={(v) => handleChange("topic", v)}>
                          <SelectTrigger id="sdb-topic" className="rounded-lg border-border">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="sdb-message" className="text-sm font-medium text-foreground mb-1.5 block">
                          Message (optional)
                        </Label>
                        <Textarea
                          id="sdb-message"
                          value={form.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          placeholder="Any details that would help Ashley prepare for your call..."
                          rows={4}
                          className="rounded-lg border-border resize-none"
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3">
                          {error}
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-full bg-primary text-primary-foreground py-3 h-auto text-base font-semibold hover:bg-primary/90"
                      >
                        {submitting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
                        ) : (
                          "Send Message"
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        Your information is never shared or sold.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-foreground text-xl mb-4">
                    Prefer to Talk Now?
                  </h3>
                  <a
                    href="tel:+16199472325"
                    className="flex items-center gap-3 text-primary font-semibold text-lg hover:underline mb-2"
                  >
                    <Phone className="h-5 w-5 shrink-0" />
                    (619) 947-2325
                  </a>
                  <p className="text-muted-foreground text-sm">Available 7 days a week</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-foreground text-xl mb-4">
                    Book Online
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                    Pick a time that works for you and Ashley will call you — no travel required.
                  </p>
                  <Link href="/schedule">
                    <Button className="w-full rounded-full bg-primary text-primary-foreground py-3 h-auto">
                      Schedule a Free Review
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white">
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-foreground text-xl mb-4">
                    Email Ashley
                  </h3>
                  <a
                    href="mailto:ashley@medicarewithashley.com"
                    className="flex items-center gap-3 text-primary font-medium text-sm hover:underline"
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    ashley@medicarewithashley.com
                  </a>
                  <p className="text-muted-foreground text-xs mt-3">
                    CA License #4052120
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary text-primary-foreground" data-testid="sdb-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">
            Ready to Talk to a Medicare Broker in San Diego?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Schedule your free consultation today. No obligation, no pressure — just clear answers from a local Medicare broker who knows San Diego.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
                Book a Free Consultation
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:+16199472325">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
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

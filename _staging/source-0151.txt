import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const topics = [
  "Turning 65 — just getting started",
  "Comparing Medicare Advantage plans",
  "Comparing Medicare Supplement (Medigap) plans",
  "Prescription drug plan comparison",
  "Annual plan review",
  "Switching plans",
  "Medicare costs and financial help",
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

export default function Contact() {
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

      trackEvent("contact_form_completion", {
        form_name: "contact",
        cta_placement: "contact_form",
      });
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
        title="Contact Ashley Watson | Free Medicare Consultation San Diego | Medicare with Ashley"
        description="Have a Medicare question? Reach Ashley Watson, San Diego's independent Medicare broker, by phone, email, or form. Free help, no pressure, 7 days a week."
        canonical="/contact/"
      />
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="contact-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Get in Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Let's Talk About Your Medicare Options
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Reach out however is easiest for you. Every consultation is free, no-obligation, and as unhurried as you need it to be.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background" data-testid="contact-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Contact Information</h2>
              <div className="space-y-6">
                <a
                  href="tel:+16199472325"
                  className="flex items-start gap-4 p-5 bg-accent/40 rounded-xl hover:bg-accent/60 transition-colors group"
                  data-testid="contact-phone-card"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Phone</p>
                    <p className="text-primary text-lg font-medium">(619) 947-2325</p>
                    <p className="text-muted-foreground text-sm mt-1">Call or text anytime during business hours</p>
                  </div>
                </a>

                <a
                  href="mailto:ashley@medicarewithashley.com"
                  className="flex items-start gap-4 p-5 bg-accent/40 rounded-xl hover:bg-accent/60 transition-colors"
                  data-testid="contact-email-card"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Email</p>
                    <p className="text-primary text-sm font-medium break-all">ashley@medicarewithashley.com</p>
                    <p className="text-muted-foreground text-sm mt-1">Ashley personally responds to every email</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 bg-accent/40 rounded-xl" data-testid="contact-location-card">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Service Area</p>
                    <p className="text-foreground/80">All of San Diego County</p>
                    <p className="text-muted-foreground text-sm mt-1">In-person, phone, or video consultations available</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-accent/40 rounded-xl" data-testid="contact-hours-card">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-0.5">Business Hours</p>
                    <p className="text-foreground/80">Monday – Friday: 9:00 AM – 5:00 PM</p>
                    <p className="text-muted-foreground text-sm mt-1">Evening and weekend appointments available upon request</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-[#0F2044] text-white rounded-2xl">
                <h3 className="font-serif font-semibold text-xl mb-3">What to Expect</h3>
                <ul className="space-y-3">
                  {[
                    "Friendly, no-pressure conversation",
                    "Ashley listens before she recommends anything",
                    "Clear explanations — no insurance jargon",
                    "Free — always, with no obligation",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/90">
                      <CheckCircle className="h-5 w-5 text-[#A3D136] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Thank You!</h2>
                    <p className="text-foreground/80 text-lg leading-relaxed mb-2">
                      Ashley has received your message and will be in touch within one business day.
                    </p>
                    <p className="text-muted-foreground">
                      In the meantime, feel free to call her directly at{" "}
                      <a href="tel:+16199472325" className="text-primary font-medium">(619) 947-2325</a>.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg bg-white" data-testid="contact-form-card">
                  <CardContent className="p-8">
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Send Ashley a Message</h2>
                    <p className="text-muted-foreground mb-8">She personally reads and responds to every inquiry.</p>

                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm leading-relaxed">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-foreground font-medium">First Name</Label>
                          <Input
                            id="firstName"
                            data-testid="input-first-name"
                            placeholder="Your first name"
                            value={form.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            required
                            disabled={submitting}
                            className="h-12 text-base border-border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-foreground font-medium">Last Name</Label>
                          <Input
                            id="lastName"
                            data-testid="input-last-name"
                            placeholder="Your last name"
                            value={form.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            required
                            disabled={submitting}
                            className="h-12 text-base border-border focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            data-testid="input-email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                            disabled={submitting}
                            className="h-12 text-base border-border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            data-testid="input-phone"
                            placeholder="(619) 555-0000"
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            disabled={submitting}
                            className="h-12 text-base border-border focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="topic" className="text-foreground font-medium">What can Ashley help you with?</Label>
                        <Select onValueChange={(v) => handleChange("topic", v)} disabled={submitting}>
                          <SelectTrigger id="topic" data-testid="select-topic" className="h-12 text-base border-border">
                            <SelectValue placeholder="Select a topic..." />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferred-contact" className="text-foreground font-medium">Preferred way to be contacted</Label>
                        <Select onValueChange={(v) => handleChange("preferredContact", v)} disabled={submitting}>
                          <SelectTrigger id="preferred-contact" data-testid="select-contact-method" className="h-12 text-base border-border">
                            <SelectValue placeholder="Phone call, email, text..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone-call">Phone call</SelectItem>
                            <SelectItem value="text">Text message</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="video">Video call</SelectItem>
                            <SelectItem value="in-person">In-person meeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-foreground font-medium">
                          Your message <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Textarea
                          id="message"
                          data-testid="input-message"
                          placeholder="Tell Ashley a little about your situation, questions, or what you're looking for..."
                          value={form.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          rows={5}
                          disabled={submitting}
                          className="text-base border-border focus:border-primary resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        data-testid="button-submit-contact"
                        disabled={submitting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-semibold h-14 rounded-xl disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          "Send Message to Ashley"
                        )}
                      </Button>

                      <p className="text-center text-muted-foreground text-sm">
                        By submitting, you agree to be contacted about Medicare plan options. Your information is never sold or shared.
                      </p>
                      <p className="text-center text-muted-foreground/60 text-xs">
                        Ashley Watson · Independent Licensed Insurance Agent · CA License #4052120
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

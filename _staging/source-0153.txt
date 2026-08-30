import React, { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Phone, MapPin, Users, Loader2 } from "lucide-react";

type FormData = { name: string; phone: string; bestTime: string };
const emptyForm: FormData = { name: "", phone: "", bestTime: "" };

export function getConsultationCopyrightYear(referenceDate = new Date()): number {
  return referenceDate.getFullYear();
}

const trustBullets = [
  {
    icon: <MapPin className="h-6 w-6 text-[#A3D136] shrink-0" />,
    text: "Local San Diego broker — not a call center",
  },
  {
    icon: <Users className="h-6 w-6 text-[#A3D136] shrink-0" />,
    text: "I compare all major carriers so you don't have to",
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-[#A3D136] shrink-0" />,
    text: "Turning 65 or losing employer coverage? I specialize in both",
  },
];

function ConsultationForm({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.BASE_URL}api/contact`.replace("//", "/"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.name,
            phone: form.phone || undefined,
            topic: "Free consultation request",
            message: form.bestTime ? `Best time to call: ${form.bestTime}` : undefined,
          }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ?? "Submission failed"
        );
      }
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please call (619) 947-2325 directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="space-y-4"
      data-testid={id}
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm leading-relaxed">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor={`${id}-name`} className="text-foreground font-medium">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${id}-name`}
          placeholder="First and last name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
          disabled={submitting}
          className="h-12 text-base border-border focus:border-[#0F2044]"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${id}-phone`} className="text-foreground font-medium">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${id}-phone`}
          type="tel"
          placeholder="(619) 555-0000"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          required
          disabled={submitting}
          className="h-12 text-base border-border focus:border-[#0F2044]"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${id}-bestTime`} className="text-foreground font-medium">
          Best Time to Call
        </Label>
        <Select
          onValueChange={(v) => setForm((p) => ({ ...p, bestTime: v }))}
          disabled={submitting}
        >
          <SelectTrigger
            id={`${id}-bestTime`}
            className="h-12 text-base border-border"
          >
            <SelectValue placeholder="Select a time..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Morning (9am – 12pm)">Morning (9am – 12pm)</SelectItem>
            <SelectItem value="Afternoon (12pm – 5pm)">Afternoon (12pm – 5pm)</SelectItem>
            <SelectItem value="Evening (5pm – 7pm)">Evening (5pm – 7pm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#A3D136] hover:bg-[#8fc220] text-[#0F2044] font-bold text-lg h-14 rounded-xl shadow-md disabled:opacity-60 mt-2"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending…
          </>
        ) : (
          "Get My Free Medicare Review"
        )}
      </Button>

      <p className="text-center text-muted-foreground text-xs leading-relaxed">
        By submitting, you agree to be contacted about Medicare plan options.
        Your information is never sold or shared.
      </p>
    </form>
  );
}

function SuccessCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="h-8 w-8 text-[#A3D136]" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-[#0F2044] mb-3">
        Ashley Will Be in Touch!
      </h2>
      <p className="text-foreground/80 text-base leading-relaxed mb-2">
        She'll call you back at the number you provided — usually within one business day.
      </p>
      <p className="text-muted-foreground text-sm">
        Can't wait?{" "}
        <a href="tel:+16199472325" className="text-[#0F2044] font-semibold underline">
          Call (619) 947-2325 now.
        </a>
      </p>
    </div>
  );
}

export default function FreeConsultation() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Free Medicare Consultation San Diego | Medicare with Ashley</title>
        <meta
          name="description"
          content="Get free, unbiased Medicare help from a local San Diego broker. Ashley Watson helps you compare Medicare Advantage and Supplement plans. No cost to you."
        />
        <link
          rel="canonical"
          href="https://medicarewithashley.com/free-consultation"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Minimal header — logo only, no nav links */}
      <header className="bg-[#0F2044] py-4 px-4 flex justify-center">
        <Link href="/" aria-label="Medicare with Ashley — home">
          <img
            src="/logo-medicare-with-ashley.webp"
            alt="Medicare with Ashley"
            className="h-12 w-auto"
            fetchPriority="high"
            width="48"
            height="48"
          />
        </Link>
      </header>

      {/* ── ABOVE THE FOLD ── */}
      <section className="bg-gradient-to-b from-[#0F2044] to-[#162d5c] py-10 px-4">
        <div className="max-w-lg mx-auto">
          {/* Headlines */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              Get Free Medicare Help<br className="hidden sm:block" /> in San Diego
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed">
              Local broker Ashley Watson helps you compare plans at no cost to
              you — carriers pay our fee
            </p>
          </div>

          {/* Big tappable phone number */}
          <a
            href="tel:+16199472325"
            className="flex items-center justify-center gap-3 bg-[#A3D136] hover:bg-[#8fc220] text-[#0F2044] font-bold text-xl sm:text-2xl h-16 rounded-2xl shadow-lg mb-6 transition-colors"
            data-testid="lp-phone-cta"
          >
            <Phone className="h-6 w-6 shrink-0" />
            (619) 947-2325
          </a>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/50 text-sm font-medium">or fill out the form below</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            {submitted ? (
              <SuccessCard />
            ) : (
              <ConsultationForm id="form-top" onSuccess={() => setSubmitted(true)} />
            )}
          </div>
        </div>
      </section>

      {/* ── BELOW THE FOLD ── */}

      {/* Trust bullets */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-lg mx-auto space-y-5">
          {trustBullets.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-border"
            >
              {b.icon}
              <p className="text-foreground font-medium text-base leading-snug">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ashley bio */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-start gap-6">
          <img
            src="/ashley-watson.webp"
            alt="Ashley Watson — San Diego Medicare Broker"
            className="w-24 h-24 rounded-2xl object-cover object-top shrink-0 shadow-md"
            loading="lazy"
            width="96"
            height="96"
          />
          <div>
            <p className="font-serif font-bold text-[#0F2044] text-lg mb-1">
              Ashley Watson
            </p>
            <p className="text-muted-foreground text-sm mb-3">
              Independent Medicare Broker · San Diego, CA · CA License #4052120
            </p>
            <p className="text-foreground/80 text-base leading-relaxed">
              Ashley is an independent Medicare broker serving San Diego County.
              She compares Medicare Advantage, Medicare Supplement, and Part D
              plans across major carriers and explains your options in plain
              language. Every consultation is completely free, unhurried, and
              judgment-free.
            </p>
          </div>
        </div>
      </section>

      {/* Closing CTA — keep the phone option visible without repeating the form */}
      <section className="py-12 px-4 bg-[#0F2044]">
        <div className="max-w-lg mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Ready to Talk to Ashley?
          </h2>
          <p className="text-white/70 text-center text-sm mb-8">
            Free consultation, no obligation — just honest answers.
          </p>

          <a
            href="tel:+16199472325"
            className="flex items-center justify-center gap-3 bg-[#A3D136] hover:bg-[#8fc220] text-[#0F2044] font-bold text-xl sm:text-2xl h-16 rounded-2xl shadow-lg transition-colors"
          >
            <Phone className="h-6 w-6 shrink-0" />
            (619) 947-2325
          </a>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-[#0A1830] py-5 px-4 text-center">
        <p className="text-white/50 text-xs">
          © {getConsultationCopyrightYear()} Medicare with Ashley · CA License #4052120 ·{" "}
          <Link href="/privacy-policy" className="hover:text-white/80 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}

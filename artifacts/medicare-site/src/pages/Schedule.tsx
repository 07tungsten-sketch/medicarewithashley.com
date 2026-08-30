import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import { AlertTriangle, CheckCircle, ExternalLink, Loader2, Mail, MessageSquare, Phone } from "lucide-react";
import { createGhlCompletionHandler, isGhlReadyMessage, trackEvent } from "@/lib/analytics";

const BOOKING_URL = "https://link.agent-crm.com/widget/booking/L3wahsCgYNk6lKg3Vo40";
const BOOKING_LOAD_TIMEOUT_MS = 10000;

type BookingStatus = "loading" | "ready" | "error";

export default function Schedule() {
  const bookingIframeRef = useRef<HTMLIFrameElement>(null);
  const bookingStartTrackedRef = useRef(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("loading");

  useEffect(() => {
    const handleBookingMessage = createGhlCompletionHandler(
      () => bookingIframeRef.current?.contentWindow ?? null,
      () => {
        trackEvent("appointment_booking_completion", {
          booking_provider: "go_high_level",
          cta_placement: "schedule_booking_widget",
        });
      },
    );
    const handleBookingReady = (event: MessageEvent) => {
      if (
        bookingStartTrackedRef.current ||
        !isGhlReadyMessage(
          event,
          bookingIframeRef.current?.contentWindow ?? null,
        )
      ) {
        return;
      }

      bookingStartTrackedRef.current = true;
      setBookingStatus("ready");
      trackEvent("appointment_booking_start", {
        booking_provider: "go_high_level",
        cta_placement: "schedule_booking_widget",
      });
    };

    window.addEventListener("message", handleBookingMessage);
    window.addEventListener("message", handleBookingReady);
    return () => {
      window.removeEventListener("message", handleBookingMessage);
      window.removeEventListener("message", handleBookingReady);
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setBookingStatus((currentStatus) =>
        currentStatus === "loading" ? "error" : currentStatus,
      );
    }, BOOKING_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeout);
  }, []);

  function handleBookingError() {
    setBookingStatus("error");
  }

  return (
    <div>
      <SEOHead
        title="Schedule Free Medicare Consultation San Diego | Medicare with Ashley"
        description="Schedule a free, no-pressure Medicare consultation with Ashley Watson. Available 7 days a week by phone, video, or in person throughout San Diego County. Call 619-947-2325."
        canonical="/schedule/"
      />
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-14 lg:py-20" data-testid="schedule-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Free Consultation</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-5">
            Schedule a Free Medicare Review
          </h1>
          <p className="text-xl text-foreground/80 max-w-xl mx-auto leading-relaxed">
            Pick a time that works for you. Every consultation is free, no-obligation, and completely unhurried.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background" data-testid="booking-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-2xl overflow-hidden shadow-lg border border-border bg-white"
            data-testid="booking-experience"
          >
            <div
              className="px-5 py-4 sm:px-6 border-b border-border bg-slate-50"
              aria-live="polite"
              data-testid="booking-status"
            >
              {bookingStatus === "loading" && (
                <div className="flex items-start gap-3 text-foreground/80">
                  <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Loading Ashley’s calendar…</p>
                    <p className="text-sm mt-1">
                      The booking form usually appears in a few seconds. Your options to call, text, or send a message are below if it takes too long.
                    </p>
                  </div>
                </div>
              )}
              {bookingStatus === "ready" && (
                <div className="flex items-center gap-3 text-foreground/80">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-sm">
                    Ashley’s calendar is ready. Choose any convenient time below.
                  </p>
                </div>
              )}
              {bookingStatus === "error" && (
                <div className="flex items-start gap-3 text-foreground/80">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">The booking calendar is taking longer than expected.</p>
                    <p className="text-sm mt-1">
                      Try opening it in a new tab, or use one of the direct ways to reach Ashley below.
                    </p>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-primary font-semibold underline underline-offset-2"
                      data-testid="booking-direct-link"
                      data-analytics-placement="schedule_direct_booking_fallback"
                    >
                      Open the booking calendar in a new tab
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
            <iframe
              ref={bookingIframeRef}
              src={BOOKING_URL}
              title="Schedule a free Medicare consultation with Ashley Watson"
              data-testid="booking-iframe"
              style={{ width: "100%", height: "700px", border: "none" }}
              loading="lazy"
              allow="payment"
              onError={handleBookingError}
            />
          </div>

          <div className="mt-10">
            <div className="mb-5">
              <h2 className="font-serif text-2xl font-bold text-foreground">Prefer another way to connect?</h2>
              <p className="text-muted-foreground mt-2">
                You never have to wait on the online calendar. Call, text, or send Ashley a message and she’ll help you find a time.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <a
                href="tel:+16199472325"
                className="flex items-center gap-4 p-5 bg-accent/40 rounded-xl hover:bg-accent/60 transition-colors"
                data-testid="schedule-phone"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Prefer to call?</p>
                  <p className="text-primary font-medium">(619) 947-2325</p>
                </div>
              </a>
              <a
                href="sms:+16199472325"
                className="flex items-center gap-4 p-5 bg-accent/40 rounded-xl hover:bg-accent/60 transition-colors"
                data-testid="schedule-text"
                data-analytics-placement="schedule_text_fallback"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Prefer to text?</p>
                  <p className="text-primary font-medium">(619) 947-2325</p>
                </div>
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-4 p-5 bg-accent/40 rounded-xl hover:bg-accent/60 transition-colors"
                data-testid="schedule-contact"
                data-analytics-placement="schedule_contact_fallback"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Prefer a contact form?</p>
                  <p className="text-primary font-medium">Send Ashley a message</p>
                </div>
              </Link>
              <a
                href="mailto:ashley@medicarewithashley.com"
                className="flex items-center gap-4 p-5 bg-accent/40 rounded-xl hover:bg-accent/60 transition-colors"
                data-testid="schedule-email"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Prefer to email?</p>
                  <p className="text-primary text-sm font-medium">ashley@medicarewithashley.com</p>
                </div>
              </a>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Ashley personally reads every message and responds within one business day.
            Consultations are available by phone, video, or in person in San Diego County.
          </p>
          <p className="text-center text-muted-foreground/60 text-xs mt-2">
            Ashley Watson · Independent Licensed Insurance Agent · CA License #4052120
          </p>
        </div>
      </section>
    </div>
  );
}

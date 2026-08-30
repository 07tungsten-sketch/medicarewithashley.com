import SEOHead from "@/components/SEOHead";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";
import { Link } from "wouter";

const terms = [
  {
    number: "1",
    title: "Program Description",
    body: "Text messages will be related to appointment reminders and short messages to obtain additional information needed for upcoming appointments.",
  },
  {
    number: "2",
    title: "Frequency",
    body: "Message frequency will vary.",
  },
  {
    number: "3",
    title: "Opt-Out",
    body: 'You can cancel SMS service at any time. Just reply STOP. Once you reply STOP, we will send a message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.',
  },
  {
    number: "4",
    title: "Help",
    body: (
      <>
        If you are experiencing issues with the messaging program you can reply with the word <strong>HELP</strong> for more assistance, or you can get help directly at{" "}
        <a href="tel:+16199472325" className="text-primary underline hover:text-primary/80">(619) 947-2325</a>.
      </>
    ),
  },
  {
    number: "5",
    title: "Interruption",
    body: "Carriers are not liable for delayed or undelivered messages.",
  },
  {
    number: "6",
    title: "Cost",
    body: "Message and data rates may apply for any messages exchanged with this number. If you have any questions about your text or data plan, please contact your phone provider.",
  },
  {
    number: "7",
    title: "Privacy",
    body: (
      <>
        If you have any questions regarding privacy, please read our{" "}
        <Link href="/privacy-policy" className="text-primary underline hover:text-primary/80">
          Privacy Policy
        </Link>.
      </>
    ),
  },
];

export default function TermsAndConditions() {
  return (
    <div>
      <SEOHead
        title="Terms & Conditions | Medicare with Ashley"
        description="Terms and conditions for SMS messaging and use of Medicare with Ashley services."
        canonical="/terms-and-conditions/"
      />

      <section className="bg-gradient-to-br from-[#0F2044] to-[#163570] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Terms &amp; Conditions</h1>
          <p className="text-white/80 text-lg">SMS Messaging Program — Last updated: June 2025</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <p className="text-foreground/70 text-base leading-relaxed mb-10">
            The following terms apply to the SMS/text messaging program operated by Medicare with Ashley (Ashley Watson, CA License #4052120). By opting in to receive text messages, you agree to these terms.
          </p>

          <div className="space-y-6">
            {terms.map((term) => (
              <div key={term.number} className="flex gap-5 p-6 bg-slate-50 rounded-xl border border-border">
                <div className="shrink-0 w-9 h-9 rounded-full bg-[#0F2044] text-white flex items-center justify-center font-bold text-sm">
                  {term.number}
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-foreground mb-1">{term.title}</h2>
                  <p className="text-foreground/75 leading-relaxed text-base">{term.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-12 pt-8 text-sm text-muted-foreground">
            <p>Medicare with Ashley &mdash; Ashley Watson, Independent Licensed Insurance Agent</p>
            <p>CA Insurance License #4052120 &nbsp;|&nbsp; San Diego County, CA</p>
            <p className="mt-2">
              Questions?{" "}
              <ObfuscatedEmail className="text-primary underline hover:text-primary/80" />{" "}
              &nbsp;|&nbsp;{" "}
              <a href="tel:+16199472325" className="text-primary underline hover:text-primary/80">
                (619) 947-2325
              </a>
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

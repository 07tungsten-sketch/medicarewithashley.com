import SEOHead from "@/components/SEOHead";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";

export default function PrivacyPolicy() {
  return (
    <div>
      <SEOHead
        title="Privacy Policy | Medicare with Ashley"
        description="Privacy policy for Medicare with Ashley — how we handle your personal information, data security, and your rights."
        canonical="/privacy-policy/"
      />

      <section className="bg-gradient-to-br from-[#0F2044] to-[#163570] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/80 text-lg">Last updated: June 2025</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate max-w-none">

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10 text-sm text-amber-900 leading-relaxed">
            <strong>Important notice regarding text messaging and personal data:</strong> We do not share personal data (including phone numbers) and consent with third parties, affiliates, or partners. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. All other categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
          </div>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-8 mb-3">Privacy and Security</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Complete privacy, confidentiality, and security are not yet possible over the Internet. As a result, Medicare with Ashley will not be responsible or liable for any harm or loss resulting from use, communication, or transmission of any information to or from this website. Material is not to be copied from our website.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-8 mb-3">Use at Your Own Risk and Information Accuracy</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            The contents and information of this website are given strictly for your convenience. You must always consult with your insurance agent and refer to your specific insurance policy declaration for specific coverage information about your policy. This information is subject to change and may be updated at any time without prior notice.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-6">
            The information on this site is not to be relied upon for any financial, legal, or insurance purposes and is intended for informational purposes only. We will not be held responsible for any detrimental reliance you place on this site or its content. It is agreed that if you use this website it shall be on an "as is" basis and entirely at your own risk.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-8 mb-3">No Liability Implied or Stated</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Medicare with Ashley, its associated companies, officers, directors, associates, agents, or employees, or any other person associated with this site, shall not be liable or responsible for any harm, loss, or damage (whether arising in contract, tort, negligence, or otherwise) that may arise in any connection with use of this site, including any indirect, direct, special, third-party, or consequential damages. Every insurance policy package has limits and exclusions. It is the responsibility of each individual to be knowledgeable and aware of the wordings and coverages of their insurance policy.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-8 mb-3">Hypertext Links Are Not Endorsements</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Other websites that may be accessed from this website by hypertext links are entirely independent of this website and shall not in any manner be construed as any reflection on, or any affiliation with, or endorsement of such site, entity, or its respective products or services. We value your visit to our website. Should you have any questions about this site, these conditions, or our products and services, please{" "}
            <a href="/contact" className="text-primary underline hover:text-primary/80">contact our office</a>.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-8 mb-3">Use of Trademark and Logo Not Permitted</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            The display and use of trademarks on this website does not imply that a license of any kind has been granted.
          </p>

          <h2 className="font-serif text-2xl font-bold text-foreground mt-8 mb-3">Site for Personal Use Only</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            The contents of this site are for your own personal use. No one has permission to copy, distribute, disseminate, commercially exploit, republish, or otherwise communicate any part of such contents in any manner whatsoever without the prior written consent of our office.
          </p>

          <div className="border-t border-border mt-10 pt-8 text-sm text-muted-foreground">
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

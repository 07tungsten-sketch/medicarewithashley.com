import { Link } from "wouter";

const planLinks = [
  { href: "/medicare-basics", label: "Medicare Basics" },
  { href: "/medicare-advantage", label: "Medicare Advantage" },
  { href: "/medicare-supplements", label: "Medicare Supplements" },
  { href: "/medicare-dental-vision-hearing-san-diego", label: "Dental, Vision & Hearing" },
  { href: "/prescription-drug-plans", label: "Prescription Drug Plans" },
  { href: "/medicare-medi-cal-dual-eligible-san-diego", label: "Medicare & Medi-Cal Help" },
  { href: "/turning-65", label: "Turning 65 Guide" },
  { href: "/part-d-penalty-calculator", label: "Part D Penalty Calculator" },
  { href: "/part-b-penalty-calculator", label: "Part B Penalty Calculator" },
  { href: "/medicare-irmaa-calculator-san-diego", label: "IRMAA Calculator" },
  { href: "/medicare-annual-enrollment-period-san-diego", label: "Annual Enrollment Help" },
];

const siteLinks = [
  { href: "/about", label: "About Ashley" },
  { href: "/san-diego-medicare-broker", label: "San Diego Medicare Broker" },
  { href: "/faq", label: "FAQ" },
  { href: "/san-diego-hospitals-medicare", label: "San Diego Hospitals & Medicare" },
  { href: "/san-diego-senior-resources", label: "Senior Resources" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
];

export function getFooterCopyrightYear(referenceDate = new Date()): number {
  return referenceDate.getFullYear();
}

export default function Footer() {
  const year = getFooterCopyrightYear();

  return (
    <footer className="bg-foreground text-background/80" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo-medicare-with-ashley.webp"
                alt="Medicare with Ashley"
                className="h-14 w-auto"
                loading="lazy"
                width="56"
                height="56"
              />
            </div>
            <p className="text-sm leading-relaxed mb-5 text-background/70">
              Independent Medicare broker serving all of San Diego County. Free consultations — no pressure, just honest answers.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:+16199472325" className="text-[#A3D136] hover:text-[#b9e35a] transition-colors flex items-center gap-2" data-testid="footer-phone">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.43 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.47a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                (619) 947-2325
              </a>
              <a href="mailto:ashley@medicarewithashley.com" className="text-[#A3D136] hover:text-[#b9e35a] transition-colors flex items-center gap-2 break-all" data-testid="footer-email">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                ashley@medicarewithashley.com
              </a>
              <p className="text-background/60 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                San Diego County, CA
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wide">Medicare Plans</h3>
            <ul className="flex flex-col gap-2">
              {planLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors" data-testid={`footer-link-${link.href.replace("/", "")}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wide">Site</h3>
            <ul className="flex flex-col gap-2">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors" data-testid={`footer-site-${link.href.replace("/", "")}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wide">Hours</h3>
            <p className="text-sm text-background/70 mb-1">7 Days a Week</p>
            <p className="text-sm text-background/70 mb-4">Year-Round Support</p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/medicarewithashley" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-background/70 hover:text-background transition-colors" data-testid="footer-facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/medicarewithashley/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-background/70 hover:text-background transition-colors" data-testid="footer-instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/@MedicareWithAshley" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-background/70 hover:text-background transition-colors" data-testid="footer-youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/ashleyjwatson7" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-background/70 hover:text-background transition-colors" data-testid="footer-linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <p className="text-xs text-background/70 leading-relaxed max-w-4xl mb-2">
            We do not offer every plan available in your area. Currently, we represent 8 organizations which offer 75 products in your area. Please contact{" "}
            <a href="https://www.medicare.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-background/70">Medicare.gov</a>,{" "}
            1-800-MEDICARE, or your local State Health Insurance Assistance Program (SHIP) to get information on all of your options.
          </p>
          <p className="text-xs text-background/70 leading-relaxed max-w-4xl mb-3">
            This is a proprietary website and is not associated, endorsed or authorized by the Social Security Administration, the Department of Health and Human Services or the Center for Medicare and Medicaid Services. This site contains decision-support content and information about Medicare, services related to Medicare and services for people with Medicare. If you would like to find more information about the Medicare program please visit the Official U.S. Government Site for People with Medicare located at{" "}
            <a href="https://www.medicare.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-background/70">www.medicare.gov</a>.
          </p>
          <p className="text-xs text-background/70 leading-relaxed max-w-4xl mb-3">
            Medicare with Ashley is the Medicare practice of Watson Insurance, serving all of San Diego County. In-home, phone, and video appointments available. CA License #4052120.
          </p>
          <p className="text-xs text-background/70">
            &copy; {year} Medicare with Ashley. CA Insurance License #4052120. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

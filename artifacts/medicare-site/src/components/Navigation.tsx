import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, Phone, X } from "lucide-react";

// ─── Desktop nav link lists ────────────────────────────────────────────────
const desktopNavMedicareHelpLinks = [
  { href: "/medicare-basics",                            label: "Medicare Basics" },
  { href: "/medicare-advantage",                         label: "Medicare Advantage" },
  { href: "/medicare-supplements",                       label: "Medicare Supplements" },
  { href: "/medicare-dental-vision-hearing-san-diego",   label: "Dental, Vision & Hearing" },
  { href: "/prescription-drug-plans",                    label: "Prescription Drug Coverage" },
];

const desktopNavResourceLinks = [
  { href: "/faq",                                            label: "Medicare FAQ" },
  { href: "/blog",                                           label: "Blog" },
  { href: "/carriers",                                       label: "Carriers" },
  { href: "/medicare-annual-enrollment-period-san-diego",    label: "Annual Enrollment" },
  { href: "/san-diego-senior-resources",                     label: "Senior Resources" },
];

// Links that sit between / after the two dropdowns
const desktopNavStandaloneLinks = [
  { href: "/turning-65", label: "Turning 65" },
  { href: "/about",      label: "About Ashley" },
  { href: "/contact",    label: "Contact" },
];

// ─── Mobile nav link lists ─────────────────────────────────────────────────
const mobileNavTopLinks = [
  { href: "/",          label: "Home" },
  { href: "/turning-65", label: "Turning 65" },
];

const mobileNavMedicareHelpLinks = [
  { href: "/medicare-basics",                           label: "Medicare Basics" },
  { href: "/medicare-advantage",                        label: "Medicare Advantage" },
  { href: "/medicare-supplements",                      label: "Supplements" },
  { href: "/medicare-dental-vision-hearing-san-diego",  label: "Dental, Vision & Hearing" },
  { href: "/prescription-drug-plans",                   label: "Drug Plans" },
];

const mobileNavResourceLinks = [
  { href: "/faq",                                          label: "Medicare FAQ" },
  { href: "/blog",                                         label: "Blog" },
  { href: "/carriers",                                     label: "Carriers" },
  { href: "/medicare-annual-enrollment-period-san-diego",  label: "Annual Enrollment" },
];

const mobileNavBottomLinks = [
  { href: "/about",    label: "About Ashley" },
  { href: "/contact",  label: "Contact" },
];

// ─── Helper: build menu-item focus list ───────────────────────────────────
function getMenuItems(ref: React.RefObject<HTMLDivElement | null>): HTMLElement[] {
  return Array.from(
    ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []
  );
}

// ─── Reusable keyboard handler factory ────────────────────────────────────
function useDropdownKeyboard(
  isOpen: boolean,
  setOpen: (v: boolean) => void,
  menuRef: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  closeOnTab = true
) {
  const close = useCallback(
    (returnFocus = false) => {
      setOpen(false);
      if (returnFocus) triggerRef.current?.focus();
    },
    [setOpen, triggerRef]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(true); return; }
      if (e.key === "Tab") {
        if (closeOnTab) setOpen(false);
        return;
      }
      const isArrow = ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key);
      if (!isArrow) return;
      e.preventDefault();
      if (!isOpen) {
        setOpen(true);
        const focusTarget = e.key === "ArrowUp" || e.key === "End" ? "last" : "first";
        setTimeout(() => {
          const items = getMenuItems(menuRef);
          if (focusTarget === "last") items[items.length - 1]?.focus();
          else items[0]?.focus();
        }, 0);
        return;
      }
      const items = getMenuItems(menuRef);
      if (!items.length) return;
      const cur = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === "ArrowDown") items[(cur === -1 ? 0 : (cur + 1) % items.length)]?.focus();
      else if (e.key === "ArrowUp") items[cur <= 0 ? items.length - 1 : cur - 1]?.focus();
      else if (e.key === "Home") items[0]?.focus();
      else if (e.key === "End") items[items.length - 1]?.focus();
    },
    [close, closeOnTab, isOpen, menuRef, setOpen]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent, containerRef: React.RefObject<HTMLDivElement | null>) => {
      if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
        setOpen(false);
      }
    },
    [setOpen]
  );

  return { close, handleKeyDown, handleBlur };
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function Navigation() {
  const [location] = useLocation();
  const [scrolled, setScrolled]           = useState(false);
  const [open, setOpen]                   = useState(false);
  const [medicareHelpOpen, setMedicareHelpOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Desktop — Medicare Help dropdown
  const [desktopHelpOpen, setDesktopHelpOpen]           = useState(false);
  const desktopHelpRef       = useRef<HTMLDivElement>(null);
  const desktopHelpTrigger   = useRef<HTMLButtonElement>(null);
  const desktopHelpMenu      = useRef<HTMLDivElement>(null);
  const hoverHelpTimeout     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Desktop — Resources dropdown
  const [desktopResOpen, setDesktopResOpen]             = useState(false);
  const desktopResRef        = useRef<HTMLDivElement>(null);
  const desktopResTrigger    = useRef<HTMLButtonElement>(null);
  const desktopResMenu       = useRef<HTMLDivElement>(null);
  const hoverResTimeout      = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard handlers for each dropdown
  const helpKb = useDropdownKeyboard(desktopHelpOpen, setDesktopHelpOpen, desktopHelpMenu, desktopHelpTrigger);
  const resKb  = useDropdownKeyboard(
    desktopResOpen,
    setDesktopResOpen,
    desktopResMenu,
    desktopResTrigger,
    false
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDesktopHelpOpen(false);
    setDesktopResOpen(false);
  }, [location]);

  // Click-outside for both dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopHelpRef.current && !desktopHelpRef.current.contains(e.target as Node)) setDesktopHelpOpen(false);
      if (desktopResRef.current  && !desktopResRef.current.contains(e.target as Node))  setDesktopResOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const isHelpActive = desktopNavMedicareHelpLinks.some((l) => isActive(l.href));
  const isResActive  = desktopNavResourceLinks.some((l) => isActive(l.href));

  // Shared dropdown styles
  const dropdownTriggerClass = (active: boolean) =>
    `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      active ? "text-primary bg-accent" : "text-foreground/70 hover:text-foreground hover:bg-muted"
    }`;
  const standaloneLinkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive(href) ? "text-primary bg-accent" : "text-foreground/70 hover:text-foreground hover:bg-muted"
    }`;
  const menuItemClass = (href: string) =>
    `block px-4 py-2 text-sm font-medium transition-colors duration-150 ${
      isActive(href) ? "text-primary bg-accent" : "text-foreground/70 hover:text-foreground hover:bg-muted"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-white border-b border-border"
      }`}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href="/" data-testid="nav-logo" aria-label="Medicare with Ashley — home" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/ashley-watson.webp"
              alt="Ashley Watson"
              className="h-10 w-10 rounded-full object-cover object-top ring-2 ring-primary/20"
              width="40"
              height="40"
            />
            <div className="leading-tight hidden sm:block">
              <span className="font-serif font-semibold text-[#0F2044] text-base block">Medicare with Ashley</span>
              <span className="text-muted-foreground text-xs block -mt-0.5">San Diego Medicare Specialist</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main navigation">

            {/* Medicare Help dropdown */}
            <div
              ref={desktopHelpRef}
              className="relative"
              onMouseEnter={() => { if (hoverHelpTimeout.current) clearTimeout(hoverHelpTimeout.current); setDesktopHelpOpen(true); }}
              onMouseLeave={() => { hoverHelpTimeout.current = setTimeout(() => setDesktopHelpOpen(false), 150); }}
              onKeyDown={helpKb.handleKeyDown}
              onBlur={(e) => helpKb.handleBlur(e, desktopHelpRef)}
            >
              <button
                ref={desktopHelpTrigger}
                onClick={() => setDesktopHelpOpen((v) => !v)}
                aria-expanded={desktopHelpOpen}
                aria-haspopup="menu"
                aria-controls="desktop-help-menu"
                data-testid="nav-topics-dropdown"
                className={dropdownTriggerClass(isHelpActive)}
              >
                Medicare Help
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${desktopHelpOpen ? "rotate-180" : ""}`} />
              </button>
              {desktopHelpOpen && (
                <div
                  id="desktop-help-menu"
                  role="menu"
                  ref={desktopHelpMenu}
                  className="absolute left-0 top-full mt-1 w-56 bg-white border border-border rounded-lg shadow-lg py-1 z-50"
                  onMouseEnter={() => { if (hoverHelpTimeout.current) clearTimeout(hoverHelpTimeout.current); setDesktopHelpOpen(true); }}
                  onMouseLeave={() => { hoverHelpTimeout.current = setTimeout(() => setDesktopHelpOpen(false), 150); }}
                >
                  {desktopNavMedicareHelpLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      data-testid={`nav-link-${link.href.replace("/", "").replace(/-/g, "_") || "home"}`}
                      className={menuItemClass(link.href)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources dropdown */}
            <div
              ref={desktopResRef}
              className="relative"
              onMouseEnter={() => { if (hoverResTimeout.current) clearTimeout(hoverResTimeout.current); setDesktopResOpen(true); }}
              onMouseLeave={() => { hoverResTimeout.current = setTimeout(() => setDesktopResOpen(false), 150); }}
              onKeyDown={resKb.handleKeyDown}
              onBlur={(e) => resKb.handleBlur(e, desktopResRef)}
            >
              <button
                ref={desktopResTrigger}
                onClick={() => setDesktopResOpen((v) => !v)}
                aria-expanded={desktopResOpen}
                aria-haspopup="menu"
                aria-controls="desktop-resources-menu"
                data-testid="nav-resources-dropdown"
                className={dropdownTriggerClass(isResActive)}
              >
                Resources
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${desktopResOpen ? "rotate-180" : ""}`} />
              </button>
              {desktopResOpen && (
                <div
                  id="desktop-resources-menu"
                  role="menu"
                  ref={desktopResMenu}
                  className="absolute left-0 top-full mt-1 w-52 bg-white border border-border rounded-lg shadow-lg py-1 z-50"
                  onMouseEnter={() => { if (hoverResTimeout.current) clearTimeout(hoverResTimeout.current); setDesktopResOpen(true); }}
                  onMouseLeave={() => { hoverResTimeout.current = setTimeout(() => setDesktopResOpen(false), 150); }}
                >
                  {desktopNavResourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      data-testid={`nav-link-${link.href.replace("/", "").replace(/-/g, "_") || "home"}`}
                      className={menuItemClass(link.href)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Standalone links: Turning 65, About Ashley, Contact */}
            {desktopNavStandaloneLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`nav-link-${link.href.replace("/", "").replace(/-/g, "_") || "home"}`}
                className={standaloneLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: phone + CTA + mobile trigger */}
          <div className="flex items-center gap-3">
            {/* Phone — desktop only (not shown on tablet/mobile — use sticky bar) */}
            <a
              href="tel:+16199472325"
              className="hidden xl:flex items-center gap-1.5 text-[#0F2044] font-semibold text-sm hover:text-primary transition-colors"
              aria-label="Call Ashley at (619) 947-2325"
            >
              <Phone className="h-4 w-4" />
              <span>(619) 947-2325</span>
            </a>

            {/* Phone — tablet only */}
            <a
              href="tel:+16199472325"
              className="hidden sm:flex xl:hidden items-center gap-1.5 text-[#0F2044] font-semibold text-sm hover:text-primary transition-colors"
              aria-label="Call Ashley at (619) 947-2325"
            >
              <Phone className="h-4 w-4" />
              <span>(619) 947-2325</span>
            </a>

            <Link href="/schedule" className="hidden lg:block">
              <Button
                data-testid="nav-cta-button"
                className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] text-sm font-semibold px-5 py-2 rounded-full"
              >
                Schedule a Call
              </Button>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="xl:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
                  aria-label="Open navigation menu"
                  data-testid="mobile-menu-trigger"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-6 border-b border-border">
                    <div className="flex items-center gap-2">
                      <img
                        src="/ashley-watson.webp"
                        alt="Ashley Watson"
                        className="h-10 w-10 rounded-full object-cover object-top"
                      />
                      <div>
                        <p className="font-serif font-semibold text-[#0F2044]">Medicare with Ashley</p>
                        <p className="text-muted-foreground text-sm">San Diego Medicare Specialist</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-1 rounded-md hover:bg-muted"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <nav className="flex flex-col gap-1 py-4 overflow-y-auto" aria-label="Mobile navigation">
                    {/* Top links: Home, Turning 65 */}
                    {mobileNavTopLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        data-testid={`mobile-nav-${link.href.replace("/", "").replace(/-/g, "_") || "home"}`}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[48px] flex items-center ${
                          isActive(link.href) ? "text-primary bg-accent" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}

                    {/* Medicare Help accordion */}
                    <button
                      onClick={() => setMedicareHelpOpen((v) => !v)}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[48px] flex items-center justify-between w-full ${
                        mobileNavMedicareHelpLinks.some((l) => isActive(l.href))
                          ? "text-primary bg-accent"
                          : "text-foreground hover:bg-muted"
                      }`}
                      aria-expanded={medicareHelpOpen}
                      aria-controls="mobile-nav-help-panel"
                      data-testid="mobile-nav-topics-accordion"
                    >
                      <span>Medicare Help</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${medicareHelpOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      id="mobile-nav-help-panel"
                      hidden={!medicareHelpOpen}
                      className="flex flex-col gap-0.5 pl-4"
                    >
                      {mobileNavMedicareHelpLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          data-testid={`mobile-nav-${link.href.replace("/", "").replace(/-/g, "_") || "home"}`}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                            isActive(link.href)
                              ? "text-primary bg-accent"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Resources accordion */}
                    <button
                      onClick={() => setResourcesOpen((v) => !v)}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[48px] flex items-center justify-between w-full ${
                        mobileNavResourceLinks.some((l) => isActive(l.href))
                          ? "text-primary bg-accent"
                          : "text-foreground hover:bg-muted"
                      }`}
                      aria-expanded={resourcesOpen}
                      aria-controls="mobile-nav-resources-panel"
                      data-testid="mobile-nav-resources-accordion"
                    >
                      <span>Resources</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      id="mobile-nav-resources-panel"
                      hidden={!resourcesOpen}
                      className="flex flex-col gap-0.5 pl-4"
                    >
                      {mobileNavResourceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          data-testid={`mobile-nav-${link.href.replace("/", "").replace(/-/g, "_") || "home"}`}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                            isActive(link.href)
                              ? "text-primary bg-accent"
                              : "text-foreground/80 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Bottom: About Ashley, Contact */}
                    {mobileNavBottomLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        data-testid={`mobile-nav-${link.href.replace("/", "").replace(/-/g, "_") || "home"}`}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[48px] flex items-center ${
                          isActive(link.href) ? "text-primary bg-accent" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto border-t border-border pt-6 space-y-3">
                    <Link href="/schedule">
                      <Button className="w-full bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold rounded-full py-3 text-base min-h-[48px]">
                        Schedule a Call
                      </Button>
                    </Link>
                    <a
                      href="tel:+16199472325"
                      className="flex items-center justify-center gap-2 min-h-[48px] text-[#0F2044] font-semibold text-base border border-border rounded-full hover:bg-muted transition-colors"
                      data-testid="mobile-nav-call"
                    >
                      <Phone className="h-4 w-4" />
                      (619) 947-2325
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}

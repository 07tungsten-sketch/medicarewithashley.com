import { lazy, Suspense, useEffect, type ComponentType, type MouseEvent } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { cityPages } from "@/data/cityPages";
import { providerPages } from "@/data/providerPages";
import ScrollToTop from "@/components/ScrollToTop";
import {
  analyticsPlacementFor,
  captureUtmParameters,
  isScheduleDestination,
  isYoutubeDestination,
  scheduleDestinationLabel,
  trackEvent,
  waitForAnalytics,
} from "@/lib/analytics";

const DISTRACTION_FREE_ROUTES = ["/free-consultation"];

type RouteComponent = ComponentType<any>;
function useLocationWithoutTrailingSlash(): [string, (...args: any[]) => void] {
  const [location, navigate] = useBrowserLocation();
  const normalized = location !== "/" && location.endsWith("/") ? location.slice(0, -1) : location;
  return [normalized, navigate];
}


function Router({ routeComponents }: { routeComponents: RouteComponents }) {
  const [location] = useLocation();
  const isDistFree = DISTRACTION_FREE_ROUTES.some((r) => location === r);

  useEffect(() => {
    captureUtmParameters();
  }, [location]);

  function handleAnalyticsClick(event: MouseEvent<HTMLElement>) {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;

    const href = link.getAttribute("href") ?? "";
    const ctaPlacement = analyticsPlacementFor(link);
    const commonData = { cta_placement: ctaPlacement };

    const isPhone = href.startsWith("tel:");
    const isText = href.startsWith("sms:");
    const isEmail = href.startsWith("mailto:");
    const isSchedule = isScheduleDestination(href);

    if (isPhone || isText) {
      trackEvent("phone_click", { ...commonData, destination: isText ? "text" : "phone" });
    } else if (isEmail) {
      trackEvent("email_click", { ...commonData, destination: "email" });
    } else if (isSchedule) {
      trackEvent("schedule_start", {
        ...commonData,
        destination: scheduleDestinationLabel(href),
      });
    } else if (isYoutubeDestination(href)) {
      trackEvent("video_engagement", {
        ...commonData,
        engagement_type: "channel_click",
        platform: "youtube",
      });
    }

    const destination = new URL(link.href, window.location.href);
    const leavesPage =
      isPhone ||
      isText ||
      isEmail ||
      (isSchedule && destination.origin !== window.location.origin);
    const isPlainSameTabClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      !link.target &&
      !link.hasAttribute("download");

    if (leavesPage && isPlainSameTabClick) {
      event.preventDefault();
      void waitForAnalytics().finally(() => {
        window.location.href = link.href;
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col" onClickCapture={handleAnalyticsClick}>
      <ScrollToTop />
      {!isDistFree && <Navigation />}
      {/* pb-20 md:pb-0 reserves space for the mobile sticky bar */}
      <main className="flex-1 pb-20 md:pb-0">
        <Switch>
          <Route path="/" component={routeComponents.Home} />
          <Route path="/about" component={routeComponents.About} />
          <Route path="/free-consultation" component={routeComponents.FreeConsultation} />
          <Route path="/medicare-basics" component={routeComponents.MedicareBasics} />
          <Route path="/turning-65" component={routeComponents.Turning65} />
          <Route path="/medicare-advantage" component={routeComponents.MedicareAdvantage} />
          <Route path="/medicare-supplements" component={routeComponents.MedicareSupplements} />
          <Route path="/prescription-drug-plans" component={routeComponents.PrescriptionDrugPlans} />
          <Route path="/faq" component={routeComponents.FAQ} />
          <Route path="/contact" component={routeComponents.Contact} />
          <Route path="/schedule" component={routeComponents.Schedule} />
          <Route path="/services" component={routeComponents.Services} />
          <Route path="/san-diego-medicare-broker" component={routeComponents.SanDiegoMedicareBroker} />
          <Route path="/blog" component={routeComponents.Blog} />
          <Route path="/blog/:slug" component={routeComponents.BlogPost} />
          <Route path="/carriers" component={routeComponents.Carriers} />
          <Route path="/san-diego-senior-resources" component={routeComponents.SeniorResources} />
          <Route path="/privacy-policy" component={routeComponents.PrivacyPolicy} />
          <Route path="/terms-and-conditions" component={routeComponents.TermsAndConditions} />
          <Route path="/part-d-penalty-calculator" component={routeComponents.PartDPenaltyCalculator} />
          <Route path="/part-b-penalty-calculator" component={routeComponents.PartBPenaltyCalculator} />
          <Route path="/medicare-irmaa-calculator-san-diego" component={routeComponents.IRMAACalculator} />
          <Route path="/medicare-medi-cal-dual-eligible-san-diego" component={routeComponents.DualEligible} />
          <Route path="/medicare-annual-enrollment-period-san-diego" component={routeComponents.AnnualEnrollmentPeriod} />

          {/* City landing pages */}
          {cityPages.map((config) => (
            <Route key={config.slug} path={`/${config.slug}`}>
              {() => <routeComponents.CityLandingPage {...config} />}
            </Route>
          ))}

          {/* Provider landing pages */}
          {providerPages.map((config) => (
            <Route key={config.slug} path={`/${config.slug}`}>
              {() => <routeComponents.ProviderLandingPage {...config} />}
            </Route>
          ))}

          <Route component={routeComponents.NotFound} />
        </Switch>
      </main>
      {!isDistFree && <Footer />}
      {!isDistFree && <MobileStickyBar />}
    </div>
  );
}

function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-border shadow-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      data-testid="mobile-sticky-bar"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <a
          href="tel:+16199472325"
          data-testid="mobile-call-button"
          data-analytics-placement="mobile_sticky_call"
          aria-label="Call Ashley Watson at (619) 947-2325"
          className="flex-1 flex items-center justify-center gap-2 min-h-[48px] bg-[#0F2044] text-white rounded-full font-semibold text-base hover:bg-[#163570] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.43 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.47a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          📞 Call Ashley
        </a>
        <a
          href="/schedule"
          data-testid="mobile-schedule-button"
          data-analytics-placement="mobile_sticky_schedule"
          aria-label="Schedule a free consultation"
          className="flex-1 flex items-center justify-center gap-2 min-h-[48px] bg-[#A3D136] text-[#0F2044] rounded-full font-semibold text-base hover:bg-[#8fc220] transition-colors"
        >
          Schedule
        </a>
      </div>
    </div>
  );
}

function App({
  locationHook,
  routeComponents = clientRouteComponents,
}: {
  locationHook?: () => [string, (...args: any[]) => void];
  routeComponents?: RouteComponents;
} = {}) {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""} hook={locationHook ?? useLocationWithoutTrailingSlash}>
        <Suspense fallback={null}>
          <Router routeComponents={routeComponents} />
        </Suspense>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;

const clientRouteComponents: RouteComponents = {
  Home: lazy(() => import("@/pages/Home")),
  About: lazy(() => import("@/pages/About")),
  FreeConsultation: lazy(() => import("@/pages/FreeConsultation")),
  MedicareBasics: lazy(() => import("@/pages/MedicareBasics")),
  Turning65: lazy(() => import("@/pages/Turning65")),
  MedicareAdvantage: lazy(() => import("@/pages/MedicareAdvantage")),
  MedicareSupplements: lazy(() => import("@/pages/MedicareSupplements")),
  PrescriptionDrugPlans: lazy(() => import("@/pages/PrescriptionDrugPlans")),
  FAQ: lazy(() => import("@/pages/FAQ")),
  Contact: lazy(() => import("@/pages/Contact")),
  Schedule: lazy(() => import("@/pages/Schedule")),
  Services: lazy(() => import("@/pages/Services")),
  SanDiegoMedicareBroker: lazy(() => import("@/pages/SanDiegoMedicareBroker")),
  Blog: lazy(() => import("@/pages/Blog")),
  BlogPost: lazy(() => import("@/pages/BlogPost")),
  Carriers: lazy(() => import("@/pages/Carriers")),
  SeniorResources: lazy(() => import("@/pages/SeniorResources")),
  PrivacyPolicy: lazy(() => import("@/pages/PrivacyPolicy")),
  TermsAndConditions: lazy(() => import("@/pages/TermsAndConditions")),
  PartDPenaltyCalculator: lazy(() => import("@/pages/PartDPenaltyCalculator")),
  PartBPenaltyCalculator: lazy(() => import("@/pages/PartBPenaltyCalculator")),
  IRMAACalculator: lazy(() => import("@/pages/IRMAACalculator")),
  CityLandingPage: lazy(() => import("@/pages/CityLandingPage")),
  ProviderLandingPage: lazy(() => import("@/pages/ProviderLandingPage")),
  DualEligible: lazy(() => import("@/pages/DualEligible")),
  AnnualEnrollmentPeriod: lazy(() => import("@/pages/AnnualEnrollmentPeriod")),
  NotFound: lazy(() => import("@/pages/not-found")),
};

export type RouteComponents = {
  Home: RouteComponent;
  About: RouteComponent;
  FreeConsultation: RouteComponent;
  MedicareBasics: RouteComponent;
  Turning65: RouteComponent;
  MedicareAdvantage: RouteComponent;
  MedicareSupplements: RouteComponent;
  PrescriptionDrugPlans: RouteComponent;
  FAQ: RouteComponent;
  Contact: RouteComponent;
  Schedule: RouteComponent;
  Services: RouteComponent;
  SanDiegoMedicareBroker: RouteComponent;
  Blog: RouteComponent;
  BlogPost: RouteComponent;
  Carriers: RouteComponent;
  SeniorResources: RouteComponent;
  PrivacyPolicy: RouteComponent;
  TermsAndConditions: RouteComponent;
  PartDPenaltyCalculator: RouteComponent;
  PartBPenaltyCalculator: RouteComponent;
  IRMAACalculator: RouteComponent;
  CityLandingPage: RouteComponent;
  ProviderLandingPage: RouteComponent;
  DualEligible: RouteComponent;
  AnnualEnrollmentPeriod: RouteComponent;
  NotFound: RouteComponent;
};

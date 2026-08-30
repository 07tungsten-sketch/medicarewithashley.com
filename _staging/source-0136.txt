import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App, { type RouteComponents } from "./App";
import Home from "./pages/Home";
import About from "./pages/About";
import FreeConsultation from "./pages/FreeConsultation";
import MedicareBasics from "./pages/MedicareBasics";
import Turning65 from "./pages/Turning65";
import MedicareAdvantage from "./pages/MedicareAdvantage";
import MedicareSupplements from "./pages/MedicareSupplements";
import PrescriptionDrugPlans from "./pages/PrescriptionDrugPlans";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Schedule from "./pages/Schedule";
import Services from "./pages/Services";
import SanDiegoMedicareBroker from "./pages/SanDiegoMedicareBroker";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Carriers from "./pages/Carriers";
import SeniorResources from "./pages/SeniorResources";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PartDPenaltyCalculator from "./pages/PartDPenaltyCalculator";
import PartBPenaltyCalculator from "./pages/PartBPenaltyCalculator";
import IRMAACalculator from "./pages/IRMAACalculator";
import CityLandingPage from "./pages/CityLandingPage";
import ProviderLandingPage from "./pages/ProviderLandingPage";
import DualEligible from "./pages/DualEligible";
import AnnualEnrollmentPeriod from "./pages/AnnualEnrollmentPeriod";
import NotFound from "./pages/not-found";

const serverRouteComponents: RouteComponents = {
  Home,
  About,
  FreeConsultation,
  MedicareBasics,
  Turning65,
  MedicareAdvantage,
  MedicareSupplements,
  PrescriptionDrugPlans,
  FAQ,
  Contact,
  Schedule,
  Services,
  SanDiegoMedicareBroker,
  Blog,
  BlogPost,
  Carriers,
  SeniorResources,
  PrivacyPolicy,
  TermsAndConditions,
  PartDPenaltyCalculator,
  PartBPenaltyCalculator,
  IRMAACalculator,
  CityLandingPage,
  ProviderLandingPage,
  DualEligible,
  AnnualEnrollmentPeriod,
  NotFound,
};

export function render(url: string): { appHtml: string; helmetContext: Record<string, any> } {
  const helmetContext: Record<string, any> = {};
  const hook = (): [string, (...args: any[]) => void] => [url, () => {}];

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <App locationHook={hook} routeComponents={serverRouteComponents} />
    </HelmetProvider>
  );

  return { appHtml, helmetContext };
}

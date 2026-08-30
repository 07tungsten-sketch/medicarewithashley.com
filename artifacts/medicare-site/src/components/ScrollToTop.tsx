import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();
  // Extract only the pathname (strip any hash) so anchor links are unaffected
  const pathname = location.split("#")[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

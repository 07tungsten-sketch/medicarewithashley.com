import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Medicare with Ashley</title>
        <meta
          name="description"
          content="The requested page could not be found. Return to Medicare with Ashley for free Medicare guidance in San Diego County."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-[70vh] w-full flex items-center justify-center bg-gray-50 px-4 py-16">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-10 w-10 text-[#163570] mx-auto mb-4" aria-hidden="true" />
            <h1 className="font-serif text-3xl font-bold text-gray-900">Page Not Found</h1>
            <p className="mt-4 text-gray-600">
              The page you requested may have moved or no longer exists.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0F2044] px-6 py-3 font-semibold text-white hover:bg-[#163570]"
              >
                Return Home
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#0F2044] px-6 py-3 font-semibold text-[#0F2044] hover:bg-[#0F2044]/5"
              >
                Contact Ashley
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const carriers: { name: string; logo: string }[] = [
  { name: "Aetna",                logo: "/carriers/aetna.svg" },
  { name: "Alignment Health",     logo: "/carriers/alignment.webp" },
  { name: "Anthem",               logo: "/carriers/anthem.svg" },
  { name: "Astiva Health",        logo: "/carriers/astiva.webp" },
  { name: "Blue Shield of CA",    logo: "/carriers/blueshield.webp" },
  { name: "Central Health",       logo: "/carriers/centralhealth.svg" },
  { name: "CleverCare",           logo: "/carriers/clevercare.webp" },
  { name: "Humana",               logo: "/carriers/humana.webp" },
  { name: "Imperial Health",      logo: "/carriers/imperialhealth.webp" },
  { name: "Molina Healthcare",    logo: "/carriers/molina.webp" },
  { name: "SCAN Health Plan",     logo: "/carriers/scan.webp" },
  { name: "UnitedHealthcare",     logo: "/carriers/uhc.webp" },
  { name: "Wellcare",             logo: "/carriers/wellcare.webp" },
];

function CarrierCard({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm flex items-center justify-center p-4 h-32 hover:shadow-md transition-shadow duration-200">
      <img
        src={logo}
        alt={`${name} logo`}
        className="w-full h-full object-contain"
        loading="lazy"
        width="120"
        height="80"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          const sib = e.currentTarget.nextElementSibling as HTMLElement;
          if (sib) sib.style.removeProperty("display");
        }}
      />
      <span className="font-medium text-[#0F2044] text-sm text-center leading-tight" style={{ display: "none" }}>
        {name}
      </span>
    </div>
  );
}

export default function Carriers() {
  return (
    <>
      <SEOHead
        title="Medicare Carriers We Work With | Medicare with Ashley | San Diego"
        description="Ashley Watson represents top Medicare carriers in San Diego including Aetna, Humana, UnitedHealthcare, Blue Shield, Molina, SCAN, Wellcare, and more. Independent broker — no pressure, no bias."
        canonical="/carriers/"
      />

      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">
            Carrier Partners
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#0F2044] mb-6">
            Plans from the Carriers You Know
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            As an independent broker, Ashley is contracted with the leading Medicare carriers serving San Diego County — so you get an unbiased comparison across all your options, not just one company's plans.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {carriers.map((c) => (
              <CarrierCard key={c.name} name={c.name} logo={c.logo} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-[#0F2044] mb-3">
            Does Your San Diego Health System Work With These Plans?
          </h2>
          <p className="text-muted-foreground text-base mb-4">
            Choosing a carrier is only half the equation — the plan also needs to work with your doctors and hospital. San Diego's major systems each accept Medicare differently, and some have changed which plans they take in recent years.
          </p>
          <p className="text-muted-foreground text-base">
            Ashley verifies provider network participation as part of every consultation. For a closer look at the largest system in the county, see{" "}
            <Link href="/sharp-healthcare-medicare-san-diego" className="text-primary font-medium underline underline-offset-2 hover:text-primary/80">
              how Sharp HealthCare works with Medicare Advantage and Medigap
            </Link>
            , or visit the{" "}
            <Link href="/san-diego-hospitals-medicare" className="text-primary font-medium underline underline-offset-2 hover:text-primary/80">
              San Diego hospitals and Medicare
            </Link>{" "}
            overview for Sharp, Scripps, UC San Diego Health, and Kaiser.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#0F2044] mb-4">
            The Benefit of Working with an Independent Broker
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Because Ashley isn't tied to any single carrier, she can compare plans across all of them to find what actually fits your doctors, prescriptions, and budget. Her advice is always in your interest — not the insurance company's.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-[#A3D136] text-[#0F2044] hover:bg-[#8fc220] font-semibold text-lg px-8 py-4 h-auto rounded-full shadow-md">
                Compare Plans with Ashley
              </Button>
            </Link>
            <a href="tel:+16199472325">
              <Button variant="outline" className="font-semibold text-lg px-8 py-4 h-auto rounded-full border-[#0F2044] text-[#0F2044]">
                Call (619) 947-2325
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

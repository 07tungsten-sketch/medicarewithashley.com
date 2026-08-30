import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Phone, ChevronRight, MapPin, Building2, CalendarCheck, Car, Stethoscope, FileX, HeartHandshake } from "lucide-react";

const cityServices = [
  {
    h3: "Medicare broker in Chula Vista",
    body: "Ashley serves the entire South Bay, including Chula Vista, Eastlake, and Bonita. She meets clients at home, over the phone, or by video — whatever works best for you.",
  },
  {
    h3: "Medicare broker in El Cajon",
    body: "El Cajon and the East County have unique plan availability. Ashley knows which carriers are strong in the area and can help you find coverage that works with your local doctors.",
  },
  {
    h3: "Medicare broker in Escondido",
    body: "From Escondido to Valley Center, Ashley helps North County inland residents compare Medicare Advantage, Supplement, and Part D plans at no cost.",
  },
  {
    h3: "Medicare broker in Oceanside",
    body: "Oceanside, Carlsbad, and the North Coastal communities have their own set of Medicare plan options. Ashley makes sure you see all of them before making a decision.",
  },
  {
    h3: "Medicare broker in North County San Diego",
    body: "Ashley covers all of North County San Diego — Vista, San Marcos, Fallbrook, Ramona, and more. Distance is never a barrier; she comes to you.",
  },
];

export default function Services() {
  return (
    <div>
      <SEOHead
        title="Medicare Services San Diego | Ashley Watson | Medicare with Ashley"
        description="Free Medicare help in San Diego County — Medicare Advantage, Medigap, Part D, and turning 65 guidance. Serving Chula Vista, El Cajon, Escondido, Oceanside, and all of San Diego County."
        canonical="/services/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2044] via-[#163570] to-[#1e4d9e] text-white py-16 lg:py-24" data-testid="services-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 font-semibold uppercase tracking-wide text-sm mb-4">What Ashley Does</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Medicare Help in San Diego —<br className="hidden sm:block" /> Free, Local, Independent
          </h1>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto leading-relaxed">
            Ashley Watson is a licensed, independent Medicare broker serving all of San Diego County. Every consultation is 100% free and completely unbiased.
          </p>
          <p className="text-white/60 text-sm mb-10">CA Insurance License #4052120</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-[#0F2044] hover:bg-white/90 font-semibold text-lg px-8 py-4 h-auto rounded-full shadow-lg">
                Schedule a Free Consultation
              </Button>
            </Link>
            <a href="tel:+16199472325">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                <Phone className="mr-2 h-5 w-5" />
                (619) 947-2325
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main services */}
      <section className="py-20 bg-background" data-testid="services-main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Medicare Advantage */}
          <div data-testid="service-medicare-advantage">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-[#5d8a00]" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Medicare Advantage Plans in San Diego
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Medicare Advantage (Part C) bundles your hospital, medical, and often prescription drug coverage into one plan — many with $0 premiums and extra benefits like dental, vision, and hearing. San Diego County has strong plan competition, which means more options and more savings for you.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Ashley compares every available Medicare Advantage plan in your zip code, checks that your current doctors are in-network, and walks you through the costs so there are no surprises. She has no incentive to favor one carrier over another — her only goal is finding the right fit for your life.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              San Diego's major health systems each have different relationships with Medicare Advantage carriers. If you see doctors at{" "}
              <Link href="/sharp-healthcare-medicare-san-diego" className="text-primary font-medium hover:underline">
                Sharp HealthCare
              </Link>
              {" "}— San Diego's largest health system — Ashley will confirm which plans keep your Sharp providers in-network before making any recommendation.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/medicare-advantage" className="inline-flex items-center text-primary font-medium hover:underline">
                Learn more about Medicare Advantage <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/carriers" className="inline-flex items-center text-primary font-medium hover:underline">
                See all the carriers Ashley works with <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          <hr className="border-border" />

          {/* Medicare Supplement / Medigap */}
          <div data-testid="service-medigap">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Medicare Supplement (Medigap) Plans in San Diego
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Original Medicare covers a lot, but it leaves gaps — copays, coinsurance, and deductibles that can add up fast. A Medicare Supplement (Medigap) plan covers those gaps, giving you predictable costs and the freedom to see any doctor nationwide who accepts Medicare.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Ashley helps San Diego residents compare Medigap plans from multiple carriers side by side. The benefits of each plan letter are standardized by law, so she helps you find the best price for the same coverage — which can vary significantly from one carrier to another.
            </p>
            <Link href="/medicare-supplements" className="inline-flex items-center text-primary font-medium hover:underline">
              Learn more about Medigap plans <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <hr className="border-border" />

          {/* Part D */}
          <div data-testid="service-part-d">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-cyan-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Medicare Part D Prescription Drug Plans
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Medicare Part D helps cover the cost of prescription medications, but no two plans cover the same drugs at the same price. Choosing the wrong plan can mean paying hundreds of dollars more each year without realizing it.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Ashley reviews your current medication list and compares Part D plans based on your specific drugs and preferred pharmacy — so you get the lowest out-of-pocket cost, not just the lowest premium. She also watches for formulary changes each fall to make sure your plan still makes sense.
            </p>
            <Link href="/prescription-drug-plans" className="inline-flex items-center text-primary font-medium hover:underline">
              Learn more about Part D drug plans <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <hr className="border-border" />

          {/* Turning 65 */}
          <div data-testid="service-turning-65">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Turning 65 in San Diego? Here's What to Do
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Turning 65 opens your Initial Enrollment Period — a 7-month window starting 3 months before your birthday month. Missing it can mean late enrollment penalties that follow you for life. It's one of the most important Medicare deadlines you'll face, and the rules around it can be confusing, especially if you're still working.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Ashley walks every new-to-Medicare client through their exact timeline, explains what happens if they have employer coverage, and helps them enroll in the right plan at the right time — with no penalties and no gaps in coverage.
            </p>
            <Link href="/turning-65" className="inline-flex items-center text-primary font-medium hover:underline">
              Read the full turning 65 guide <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <hr className="border-border" />

          {/* Medi-Cal */}
          <div data-testid="service-medi-cal">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Medi-Cal Application Assistance
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Medi-Cal is California's Medicaid program, providing free or low-cost health coverage to eligible residents — including many seniors who qualify alongside Medicare. When both programs work together, it's called "dual eligibility," and it can dramatically reduce or eliminate your out-of-pocket costs for premiums, copays, and prescriptions.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Ashley helps San Diego County residents determine whether they qualify for Medi-Cal and guides them through the application process. If you're eligible, she also helps you find a Medicare Savings Program or Dual Special Needs Plan (D-SNP) that coordinates your benefits seamlessly.
            </p>
          </div>

          <hr className="border-border" />

          {/* CalFresh */}
          <div data-testid="service-calfresh">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                CalFresh Application Assistance
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              CalFresh (California's food assistance program, also known as SNAP) provides monthly benefits to help eligible individuals and families afford nutritious food. Many seniors on fixed incomes qualify but never apply — often because they assume they won't be eligible or find the process confusing.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Ashley helps clients understand their eligibility and walks them through the CalFresh application — the same way she approaches Medicare: with patience, clear explanations, and no pressure. It's one more way she makes sure her clients have access to every benefit available to them.
            </p>
          </div>

          <hr className="border-border" />

          {/* Year-Round Office Support */}
          <div data-testid="service-office-support">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-violet-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Year-Round Office Support — 7 Days a Week
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-6">
              Enrollment is just the beginning. Ashley's office provides ongoing, hands-on support to every client throughout the year — not just at open enrollment. Whether you have a billing question in March or need help finding a dentist in August, you can reach Ashley any day of the week.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  icon: <CalendarCheck className="h-5 w-5 text-violet-600" />,
                  bg: "bg-violet-50",
                  title: "Quarterly Check-Ins",
                  body: "Ashley reaches out to every client quarterly — not just in the fall — to make sure your coverage still fits your life and catch any issues before they become problems.",
                },
                {
                  icon: <Car className="h-5 w-5 text-blue-600" />,
                  bg: "bg-blue-50",
                  title: "Transportation Scheduling Help",
                  body: "Need a ride to a doctor's appointment? Ashley's office helps you navigate and schedule the transportation benefits included in many Medicare Advantage plans.",
                },
                {
                  icon: <Stethoscope className="h-5 w-5 text-cyan-600" />,
                  bg: "bg-cyan-50",
                  title: "In-Network Dentist Locating",
                  body: "Finding a dentist who accepts your plan's dental benefit can be frustrating. Ashley's office locates in-network dentists for you so you get the most out of your coverage.",
                },
                {
                  icon: <FileX className="h-5 w-5 text-red-500" />,
                  bg: "bg-red-50",
                  title: "Billing Error Disputes",
                  body: "Incorrect bills and denied claims happen more than they should. Ashley's office reviews billing issues and helps you dispute errors with your insurance carrier — so you don't overpay.",
                },
                {
                  icon: <HeartHandshake className="h-5 w-5 text-[#5d8a00]" />,
                  bg: "bg-lime-50",
                  title: "Doctor Visit Coordination",
                  body: "Ashley's office helps you navigate specialist referrals, confirm appointments, and make sure the right information gets to the right providers.",
                },
                {
                  icon: <CheckCircle className="h-5 w-5 text-amber-600" />,
                  bg: "bg-amber-50",
                  title: "And Much More",
                  body: "From questions about Extra Help and cost-sharing to changes in your health situation, Ashley's team is a resource you can count on throughout the year — not just at enrollment time.",
                },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} rounded-xl p-5 flex gap-4`}>
                  <div className="shrink-0 mt-0.5">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-foreground/80 text-lg leading-relaxed">
              Most insurance agents disappear after you sign up. Ashley's approach is different — her clients are clients for life, with a dedicated office they can call any day of the week.
            </p>
          </div>

          <hr className="border-border" />

          {/* Free consultation */}
          <div data-testid="service-consultation">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
                <CheckCircle className="h-5 w-5 text-[#5d8a00]" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">
                Free Medicare Consultation — We Come to You
              </h2>
            </div>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Every consultation with Ashley is completely free — there's never a fee for her time, advice, or enrollment help. As an independent broker, she is compensated by the insurance carriers only if you enroll, and that fee is the same regardless of which plan you choose. There is zero financial incentive for her to steer you toward any particular plan.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed mb-3">
              Ashley is available seven days a week and meets clients wherever is most convenient — in your home, at a local coffee shop, over the phone, or on a video call. After enrollment, she stays available for billing questions, claims issues, and annual plan reviews.
            </p>
            <Link href="/schedule">
              <Button className="mt-2 rounded-full bg-primary text-primary-foreground px-8 py-3 h-auto text-base hover:bg-primary/90">
                Book Your Free Consultation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Service areas */}
      <section className="py-20 bg-accent/30" data-testid="service-areas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-primary shrink-0" />
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Serving All of San Diego County
            </h2>
          </div>
          <p className="text-foreground/80 text-lg leading-relaxed mb-12">
            Ashley is a local Medicare broker covering every community in San Diego County — from the South Bay to North County, and the coast to the inland valleys. No travel fees, no minimums, no pressure.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cityServices.map((item, i) => (
              <Card key={i} className="border border-border shadow-sm bg-white" data-testid={`city-service-${i}`}>
                <CardContent className="p-6">
                  <h3 className="font-serif font-semibold text-foreground text-lg mb-2 capitalize">
                    {item.h3}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-muted-foreground text-sm text-center mt-8">
            Don't see your city?{" "}
            <a href="tel:+16199472325" className="text-primary font-medium hover:underline">
              Call Ashley
            </a>{" "}
            — if you're in San Diego County, she serves you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="services-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-5">
            Ready to Find the Right Plan?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Schedule your free Medicare consultation today. Ashley will review your options, answer every question, and help you enroll — all at no cost to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
                Schedule a Free Review
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:+16199472325">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                <Phone className="mr-2 h-5 w-5" />
                (619) 947-2325
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

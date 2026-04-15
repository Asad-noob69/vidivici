"use client"

import Banner from "@/components/ui/Banner"
import FAQ from "@/components/home/FAQ"
import Contact from "@/components/home/Contact"
import CarBrowse from "@/components/home/CarBrowse"
import { CircleCheckBig } from "lucide-react"

const steps = [
    { number: 1, title: "Submit Your Request", description: "Share your claim details or contact us directly to begin your booking.", position: "top" },
    { number: 2, title: "Select Your Replacement Vehicle", description: "Choose your preferred model from our luxury fleet.", position: "bottom" },
    { number: 3, title: "We Handle the Coordination", description: "Our specialists liaise with your insurer and confirm your eligibility.", position: "top" },
    { number: 4, title: "We Deliver to Your Doorstep", description: "Your car arrives ready to drive — and prepared to perfection.", position: "bottom" },
];

const features = [
  {
    title: "Fast Delivery",
    description:
      "Same-day or next-day replacements available.",
  },
  {
    title: "Luxury Fleet",
    description:
      "Premium brands for every need and policy type.",
  },
  {
    title: "Insurance Assistance",
    description:
      "We manage coordination with insurers.",
  },
  {
    title: "Flexible Terms",
    description:
      "Short- or long-term replacement options.",
  },
  {
    title: "Personal Support",
    description:
      "Our concierge team is available 24/7.",
  },
];

export default function InsurancePage() {
  return (
    <div>
      <Banner
        heading="Luxury Insurance Replacement Vehicles"
        description="Seamless luxury replacements across Los Angeles — comfort, speed, and style when you need it most."
        height="h-96 2xl:h-[520px]"
      />
      <CarBrowse />
      {/* Intro Section */}
      <section className="w-full">
        {/* Top Section: Seamless Replacement */}
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10 2xl:gap-16">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-5 2xl:mb-8">
                Seamless Replacement When You Need It Most
              </h2>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                When unexpected repairs interrupt your routine, our luxury insurance replacement vehicles restore your mobility without compromise.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed">
                We know living without your car disrupts your day — that's why we deliver premium replacements straight to your door.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mt-4 2xl:mt-6">
                From executive sedans to high-end SUVs, our fleet ensures you continue driving a car that matches your comfort, prestige, and performance expectations.
              </p>
            </div>

            {/* Right: Image Grid */}
            <div className="w-full lg:w-[560px] 2xl:w-[760px] flex-shrink-0 grid grid-cols-2 gap-3 2xl:gap-6">
              {/* Top full-width image */}
              <div className="col-span-2 rounded-xl 2xl:rounded-2xl overflow-hidden h-48 sm:h-56 2xl:h-72 bg-mist-200">
                <img
                  src="/insurance1.png"
                  alt="Luxury car interior"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom two images */}
              <div className="col-span-2 rounded-xl 2xl:rounded-2xl overflow-hidden h-48 sm:h-56 2xl:h-72 bg-mist-200">
                <img
                  src="/insurance2.png"
                  alt="Luxury car interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tailored Luxury */}
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32 mt-24 2xl:mt-48">
          <div className="flex flex-col lg:flex-row-reverse items-start justify-between gap-10 2xl:gap-16">
            {/* Right: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-2 2xl:mb-4">
                Tailored Luxury Replacement Options
              </h2>
              <p className="text-xs sm:text-sm 2xl:text-xl text-mist-400 italic mb-5 2xl:mb-8">
                Designed Around You and Your Insurance Needs
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Every situation is different — and so are your requirements. Our dedicated team works closely with you and your insurance provider to deliver a bespoke replacement experience. Choose from an exclusive selection of luxury vehicles including Mercedes-Benz, BMW, Audi, Porsche, Maserati, and Bentley — all maintained to perfection and available on flexible terms.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-8 2xl:mb-10">
                Your replacement vehicle will be delivered and collected at your convenience, ensuring a smooth transition with zero downtime.
              </p>
              <button className="bg-mist-900 hover:bg-mist-700 transition-colors duration-200 text-white text-sm 2xl:text-xl px-6 2xl:px-10 py-3 2xl:py-5 rounded-md 2xl:rounded-xl">
                Get My Replacement Vehicle
              </button>
            </div>

            {/* Left: Image Grid */}
            <div className="w-full lg:w-[560px] 2xl:w-[760px] flex-shrink-0 grid grid-cols-2 gap-3 2xl:gap-6">
              {/* Top two images */}
              <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-40 sm:h-48 2xl:h-60 bg-mist-200">
                <img
                  src="/insurance3.png"
                  alt="Luxury car side"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl 2xl:rounded-2xl overflow-hidden h-40 sm:h-48 2xl:h-60 bg-mist-200">
                <img
                  src="/insurance4.png"
                  alt="Luxury car interior"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom full-width image */}
              <div className="col-span-2 rounded-xl 2xl:rounded-2xl overflow-hidden h-44 sm:h-52 2xl:h-96 bg-mist-200">
                <img
                  src="/insurance5.png"
                  alt="Luxury estate"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
  
   <section className="w-full bg-white px-4 sm:px-8 md:px-12 lg:px-20  mt-24 2xl:mt-48">

            {/* Heading */}
            <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-gray-900">How It Works</h2>
                <p className="mt-4 text-sm sm:text-base 2xl:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
                    Partner with Vidi Vici Rental in four easy steps and start earning from your luxury
                    assets with ease and confidence.
                </p>
            </div>

            {/* ── Desktop Layout (md+) ─────────────────────────────── */}
            <div className="hidden md:block relative">
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1000 260"
                    preserveAspectRatio="none"
                    fill="none"
                >
                    <path d="M 125 65 C 210 65, 230 195, 375 195" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                    <path d="M 375 195 C 530 195, 470 65, 625 65" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                    <path d="M 625 65 C 780 65, 720 195, 875 195" stroke="#d4d4d0" strokeWidth="2" strokeDasharray="8 6" fill="none" />
                </svg>

                <div className="relative z-10 grid grid-cols-4" style={{ height: "260px" }}>
                    {steps.map((step) =>
                        step.position === "top" ? (
                            <div key={step.number} className="flex flex-col items-center text-center pt-8">
                                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                                    {step.number}
                                </div>
                                <div className="mt-5 max-w-[160px] 2xl:max-w-[200px]">
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base 2xl:text-xl">{step.title}</p>
                                    <p className="text-xs lg:text-sm 2xl:text-lg text-gray-500 mt-2 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ) : (
                            <div key={step.number} className="flex flex-col items-center text-center justify-end pb-8">
                                <div className="max-w-[160px] 2xl:max-w-[200px] mb-5">
                                    <p className="text-xs lg:text-sm 2xl:text-lg text-gray-500 leading-relaxed">{step.description}</p>
                                    <p className="font-semibold text-gray-900 text-sm lg:text-base 2xl:text-xl mt-2">{step.title}</p>
                                </div>
                                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                                    {step.number}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* ── Mobile Layout (<md) — zigzag 2-column ────────────── */}
            <div className="md:hidden">

                {/* Single SVG that covers both rows + connector */}
                <div className="relative" style={{ minHeight: "410px" }}>
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 300 410"
                        preserveAspectRatio="none"
                        fill="none"
                    >
                        {/* Step 1 → Step 2 */}
                        <path
                            d="M 75 40 C 150 40, 150 140, 225 140"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                        {/* Step 2 → Step 3 */}
                        <path
                            d="M 225 140 C 225 230, 75 230, 75 270"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                        {/* Step 3 → Step 4 */}
                        <path
                            d="M 75 270 C 150 270, 150 370, 225 370"
                            stroke="#d4d4d0" strokeWidth="2" strokeDasharray="7 5" fill="none"
                        />
                    </svg>

                    {/* Step 1 — left, top-aligned */}
                    <div className="absolute left-0 w-1/2 flex flex-col items-center text-center px-4 pt-8" style={{ top: -16 }}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            1
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{steps[0].title}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                                {steps[0].description}
                            </p>
                        </div>
                    </div>

                    {/* Step 2 — right, at ~140px from top (circle center) */}
                    <div className="absolute right-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "-10px" }}>
                        <div className="mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                {steps[1].description}
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base mt-2">{steps[1].title}</p>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            2
                        </div>
                    </div>

                    {/* Step 3 — left, at ~270px from top (circle center) */}
                    <div className="absolute left-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "240px" }}>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            3
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">{steps[2].title}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                                {steps[2].description}
                            </p>
                        </div>
                    </div>

                    {/* Step 4 — right, at ~370px from top (circle center) */}
                    <div className="absolute right-0 w-1/2 flex flex-col items-center text-center px-4" style={{ top: "230px" }}>
                        <div className="mb-4">
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                {steps[3].description}
                            </p>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base mt-2">{steps[3].title}</p>
                        </div>
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shadow-md shrink-0">
                            4
                        </div>
                    </div>
                </div>

            </div>
        </section>

      <section className="w-full  mt-24 2xl:mt-48">
        <div className="px-6 sm:px-16 lg:px-20 2xl:px-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 2xl:gap-16">
            {/* Left: Text Content */}
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl 2xl:text-6xl font-bold text-mist-900 leading-tight mb-4 2xl:mb-6">
                Five-Star Service, Every Step of the Way
              </h2>


              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Our team goes beyond simple replacements — we deliver an experience.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed mb-4 2xl:mb-6">
                Each vehicle is meticulously inspected, fully insured, and presented in pristine condition. Our chauffeurs and logistics partners handle every detail, so all you have to do is step in and drive.
              </p>
              <p className="text-mist-500 text-sm sm:text-base 2xl:text-2xl leading-relaxed">
                We pride ourselves on delivering fast, professional, and seamless service, ensuring your day-to-day life continues without interruption.
              </p>
            </div>

            {/* Right: Image */}
            <div className="w-full lg:w-[620px] 2xl:w-[820px] flex-shrink-0">
              <div className="rounded-2xl 2xl:rounded-3xl overflow-hidden w-full h-64 sm:h-80 lg:h-96 2xl:h-[475px] bg-mist-100">
                <img
                  src="/insurance6.png"
                  alt="Professional chauffeur in uniform"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


       <section
            /* Increased vertical padding to 2xl:py-64 to account for the massive 7k height */
            className="w-full px-6 sm:px-16 lg:px-20 2xl:px-32 py-20 2xl:py-36 mt-24 2xl:mt-48 relative overflow-visible"
            style={{ backgroundColor:  "#eeeeed"  }}
          >
            {/* Background Vectors - Scaled up for 2xl */}
            <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none select-none rotate-180 "
            />
      
            <img
              src="/Vector 7.png"
              alt=""
              aria-hidden="true"
              className="hidden md:block absolute right-0 top-0 h-full w-auto object-contain object-right pointer-events-none select-none scale-x-[-1] rotate-180 opacity-80"
            />
      
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0 items-start">
      
              {/* Left: Heading + CTA */}
              <div className="flex flex-col h-full gap-8 2xl:gap-16">
                <div>
                  <h2 className="text-4xl md:text-5xl 2xl:text-7xl font-bold text-mist-900 leading-tight tracking-tight">
                    Why Choose Vidi Vici Insurance Replacements
                  </h2>
                  <p className="mt-4 2xl:mt-10 text-md 2xl:text-2xl text-mist-500 leading-relaxed 2xl:max-w-xl">
                   Enjoy total peace of mind knowing you’re backed by efficiency, professionalism, and luxury every step of the way.
                  </p>
                </div>
              </div>
      
              {/* Right: 2x2 Feature Grid */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-x-44 2xl:gap-x-64 2xl:gap-y-32 md:pl-44 2xl:pl-56 pt-14 sm:pt-0">
                {features.map((f) => (
                  <div key={f.title} className="flex flex-col gap-3 2xl:gap-8">
                    {/* Scaled Icon Container */}
                    <div className="w-9 h-9 2xl:w-14 2xl:h-14 bg-white rounded-xl 2xl:rounded-2xl flex items-center justify-center shadow-sm">
                      <CircleCheckBig strokeWidth={2} className="text-mist-700 w-[18px] h-[18px] 2xl:w-7 2xl:h-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl 2xl:text-3xl font-bold text-mist-900 leading-snug">
                      {f.title}
                    </h3>
                    <p className="text-md 2xl:text-2xl text-mist-500 leading-relaxed 2xl:max-w-md">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
      
            </div>
          </section>
      <FAQ />
      <Contact />
    </div>
  )
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutData } from "@/constants/about";
import { motion } from "framer-motion";

interface AboutUsClientProps {
  stats?: {
    packagesCount: number;
    destinationsCount: number;
  };
}

export default function AboutUsClient({ stats }: AboutUsClientProps) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={aboutData.hero.image}
            alt="About Sarthi Tourism"
            fill
            className="object-cover opacity-60 mix-blend-luminosity scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <span className="text-blue-500 dark:text-blue-400 font-semibold tracking-wider uppercase text-md">
            About Us
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading text-white mb-6 mt-3 tracking-tight"
          >
            {aboutData.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-300 font-medium tracking-wide"
          >
            {aboutData.hero.tagline}
          </motion.p>
        </div>
      </section>

      {/* 2. About Sarthi Tourism */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="w-full lg:w-1/2">
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-3 block">
                Company Introduction
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-8 text-white leading-tight">
                {aboutData.introduction.title}
              </h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                {aboutData.introduction.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative h-[450px] lg:h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
                <Image
                  src={aboutData.introduction.image}
                  alt="Who we are"
                  fill
                  className="object-cover duration-500 "
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-950/30 border-y border-white/5" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">

            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                100+
              </div>
              <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">Happy Travelers</div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                {stats?.packagesCount || 0}
              </div>
              <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">Tour Packages</div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                10+
              </div>
              <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">Destinations</div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                24/7
              </div>
              <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">Travel Support</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white">Why Choose Us</h2>
            <p className="text-gray-400 text-lg md:text-xl font-light">We go above and beyond to ensure your travel experience is nothing short of extraordinary.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {aboutData.whyChooseUs.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Our Services & Why Travel With Us Split */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Services */}
            <div className="w-full lg:w-1/2">
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-3 block">
                What We Do
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-10 text-white">Our Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutData.services.map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white text-blue-400 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{service.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Why Travel With Us */}
            <div className="w-full lg:w-1/2">
              <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-3 block">
                The Sarthi Difference
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-10 text-white">Why Travel With Sarthi</h2>
              <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                <ul className="space-y-8 relative z-10">
                  {aboutData.whyTravelWithUs.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <li key={idx} className="flex items-center gap-6 group">
                        <div className="bg-blue-500/10 p-3 rounded-2xl shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                          <Icon className="w-7 h-7 text-blue-400" />
                        </div>
                        <span className="text-xl font-medium text-gray-300 group-hover:text-white transition-colors">{item.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Mission & Vision */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white/5 backdrop-blur-md p-10 lg:p-14 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-colors group">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 mx-auto rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-3xl font-bold font-heading text-white mb-6 tracking-wide">{aboutData.mission.title}</h3>
              <p className="text-gray-400 text-lg leading-relaxed font-light">{aboutData.mission.description}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-10 lg:p-14 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-colors group">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 mx-auto rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl">👁️</span>
              </div>
              <h3 className="text-3xl font-bold font-heading text-white mb-6 tracking-wide">{aboutData.vision.title}</h3>
              <p className="text-gray-400 text-lg leading-relaxed font-light">{aboutData.vision.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-950/20 border-t border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-8 text-white tracking-tight">{aboutData.cta.heading}</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">{aboutData.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {aboutData.cta.buttons.map((btn, idx) => (
              <Link
                key={idx}
                href={btn.href}
                className={`inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${btn.variant === 'default'
                    ? "bg-blue-600 hover:bg-blue-500 text-white text-sm h-14 px-10 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 w-full sm:w-auto"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-md text-sm h-14 px-10 rounded-full w-full sm:w-auto hover:-translate-y-1"
                  }`}
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

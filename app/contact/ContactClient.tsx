"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { WordLimitTextarea } from "@/components/ui/WordLimitTextarea";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import Image from "next/image";
import { useFormValidation } from "@/hooks/useFormValidation";

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const { errors, validateAll, handleChange: handleValidationChange, handleBlur, setErrors } = useFormValidation<typeof formData>({
    name: { required: "Please enter your full name." },
    email: { 
      required: "Please enter a valid email address.",
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address." }
    },
    phone: { 
      required: "Please enter a valid 10-digit mobile number.",
      custom: (val) => val && val.length !== 13 ? "Please enter a valid 10-digit mobile number." : null 
    },
    subject: { required: "Please enter a subject." },
    message: { 
      required: "Please enter your message.",
      custom: (val) => {
        const countWords = (text: string) => text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
        return countWords(val) > 500 ? "Message cannot exceed 500 words." : null;
      }
    }
  });

  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitLock = useRef<boolean>(false);

  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8780228628";
  const displayPhone = WA_NUMBER.length === 10 ? `+91 ${WA_NUMBER.slice(0, 5)} ${WA_NUMBER.slice(5)}` : WA_NUMBER;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrance animations for headers
      gsap.fromTo(".contact-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
      );

      // Parallax for background
      gsap.to(".bg-parallax", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    handleValidationChange(name as keyof typeof formData, value, { ...formData, [name]: value });
  };

  const handleCustomChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    handleValidationChange(name, value, { ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous lock to prevent rapid double-clicks
    if (submitLock.current) return;
    submitLock.current = true;

    if (!validateAll(formData)) {
      toast.error("Please fix the errors in the form before submitting.");
      submitLock.current = false;
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! We will get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setErrors({}); // Clear errors on success
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden" ref={sectionRef}>
      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-parallax z-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000"
          alt="Contact Us Background"
          fill
          priority
          className="object-cover opacity-60 dark:opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-40 pb-20">
        {/* Header */}
        <div className="text-center mb-16 contact-title">
          <span className="text-blue-500 dark:text-blue-400 font-semibold tracking-wider uppercase text-sm">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mt-4 mb-6 tracking-tight">
            Contact Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Experts</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a question about our tour packages or need help planning your next adventure? Our team is here to assist you.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 bg-card/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-border dark:border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden"
          >
            {/* Subtle Glow Background */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

            <h2 className="text-2xl font-bold text-foreground mb-8 relative z-10">Send us a Message</h2>
            
            <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur("name", e.target.value, formData)}
                    className={`w-full bg-background/50 dark:bg-black/20 border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-border dark:border-white/10 focus:ring-blue-500'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur("email", e.target.value, formData)}
                    className={`w-full bg-background/50 dark:bg-black/20 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-border dark:border-white/10 focus:ring-blue-500'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="john@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Phone Number *</label>
                  <PhoneInput
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(val) => handleCustomChange("phone", val)}
                    onBlur={() => handleBlur("phone", formData.phone, formData)}
                    hasError={!!errors.phone}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur("subject", e.target.value, formData)}
                    className={`w-full bg-background/50 dark:bg-black/20 border ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-border dark:border-white/10 focus:ring-blue-500'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="Inquiry about..."
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && <p id="subject-error" className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.subject}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Message *</label>
                <WordLimitTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(val) => handleCustomChange("message", val)}
                  onBlur={() => handleBlur("message", formData.message, formData)}
                  placeholder="How can we help you?"
                  maxWords={500}
                  hasError={!!errors.message}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && <p id="message-error" className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Map and Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            {/* Map Container */}
            <div className="bg-card/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-border dark:border-white/10 rounded-[2rem] shadow-2xl p-4 overflow-hidden h-[300px] sm:h-[400px] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.4243884488316!2d72.8596!3d22.7000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQyJzAwLjAiTiA3MsKwNTEnMzQuNiJF!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin" 
                className="w-full h-full rounded-2xl border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sarthi Tourism Location"
              />
              <a 
                href="https://www.google.com/maps/search/?api=1&query=105,+Siddhivinayak+Complex,+Mission+Road,+Nadiad+387002"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-8 right-8 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold px-4 py-2 rounded-lg shadow-lg text-sm hover:scale-105 transition-transform flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Get Directions
              </a>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card/80 dark:bg-white/[0.03] backdrop-blur-xl border border-border dark:border-white/10 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center hover:bg-card dark:hover:bg-white/[0.05] transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-foreground font-bold mb-1">Call Us</h3>
                <p className="text-muted-foreground text-sm font-medium">{displayPhone}</p>
              </div>

              <div className="bg-card/80 dark:bg-white/[0.03] backdrop-blur-xl border border-border dark:border-white/10 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center hover:bg-card dark:hover:bg-white/[0.05] transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-foreground font-bold mb-1">Email Us</h3>
                <p className="text-muted-foreground text-sm font-medium">info@sarthitourism.com</p>
              </div>
              
              <div className="bg-card/80 dark:bg-white/[0.03] backdrop-blur-xl border border-border dark:border-white/10 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center hover:bg-card dark:hover:bg-white/[0.05] transition-colors sm:col-span-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-foreground font-bold mb-1">Visit Us</h3>
                <p className="text-muted-foreground text-sm font-medium max-w-[250px]">105, Siddhivinayak Complex, Mission Road, Nadiad 387002</p>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </main>
  );
}

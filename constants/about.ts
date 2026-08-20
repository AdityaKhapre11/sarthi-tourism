import { 
  MapPin, 
  Calendar, 
  CreditCard, 
  HeartHandshake, 
  ShieldCheck, 
  Headset, 
  Plane, 
  Globe, 
  Users, 
  Hotel,
  Car,
  Camera,
  Star,
  CheckCircle2,
  Briefcase
} from "lucide-react";

export const aboutData = {
  hero: {
    title: "About Sarthi Tourism",
    tagline: "Your trusted partner for unforgettable journeys.",
    image: "/images/hero.png" 
  },
  introduction: {
    title: "Who We Are",
    content: [
      "Welcome to Sarthi Tourism, your ultimate gateway to exploring the world. We specialize in transforming your travel dreams into reality with carefully crafted itineraries and personalized assistance.",
      "Our approach to travel is simple: we focus on comfortable, memorable, and hassle-free journeys. Whether you are looking for a serene getaway, an adventurous trek, or a romantic honeymoon, we meticulously plan every detail so you can focus on making memories.",
      "From seamless transfers and handpicked accommodations to immersive local sightseeing, we ensure that every moment of your trip is filled with joy and comfort."
    ],
    image: "/images/dubai.png"
  },
  mission: {
    title: "Our Mission",
    description: "To make travel simple, comfortable and memorable by providing thoughtfully planned journeys and reliable travel support."
  },
  vision: {
    title: "Our Vision",
    description: "To become a trusted travel partner for customers looking for meaningful, comfortable and memorable travel experiences."
  },
  stats: [
    { label: "Happy Travelers", value: "100+" },
    { label: "Tour Packages", value: "25+" },
    { label: "Destinations", value: "10+" },
    { label: "Travel Support", value: "24/7" },
  ],
  whyChooseUs: [
    { 
      title: "Personalized Travel Planning", 
      description: "We design itineraries that match your preferences and style.",
      icon: MapPin 
    },
    { 
      title: "Carefully Designed Packages", 
      description: "Expertly curated plans for a seamless experience.",
      icon: Calendar 
    },
    { 
      title: "Transparent Pricing", 
      description: "No hidden costs. You get exactly what you pay for.",
      icon: CreditCard 
    },
    { 
      title: "Comfortable Stays & Transfers", 
      description: "Handpicked hotels and reliable transport services.",
      icon: Hotel 
    },
    { 
      title: "Experienced Travel Support", 
      description: "Guidance and assistance from seasoned travel experts.",
      icon: Headset 
    },
    { 
      title: "Customer-Focused Service", 
      description: "Your comfort and satisfaction are our top priorities.",
      icon: HeartHandshake 
    },
  ],
  services: [
    { title: "Domestic Tour Packages", icon: MapPin },
    { title: "International Tour Packages", icon: Globe },
    { title: "Customized Tours", icon: Plane },
    { title: "Family Holidays", icon: Users },
    { title: "Honeymoon Packages", icon: HeartHandshake },
    { title: "Group Tours", icon: Users },
    { title: "Hotel & Accommodation", icon: Hotel },
    { title: "Airport/Local Transfers", icon: Car },
    { title: "Sightseeing & Activities", icon: Camera },
  ],
  whyTravelWithUs: [
    { title: "Easy planning", icon: CheckCircle2 },
    { title: "Personalized assistance", icon: HeartHandshake },
    { title: "Quality travel experiences", icon: Star },
    { title: "Reliable support", icon: ShieldCheck },
    { title: "Value for money", icon: CreditCard },
    { title: "Complete travel convenience", icon: Briefcase }
  ],
  cta: {
    heading: "Ready to Plan Your Next Journey?",
    description: "Explore our travel packages or contact us to create a journey tailored to your needs.",
    buttons: [
      { label: "Explore Packages", href: "/packages", variant: "default" },
      { label: "Contact Us", href: "/contact", variant: "outline" }
    ]
  }
};

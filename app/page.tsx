import HomeIndex from "./index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sarthi Tourism | Premium Travel & Tour Packages",
  description: "Explore the world with Sarthi Tourism. Discover premium tour packages, breathtaking destinations, and unforgettable experiences.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomeIndex />;
}

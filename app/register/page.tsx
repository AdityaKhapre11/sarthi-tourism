import { Suspense } from "react";
import RegisterIndex from "./Register";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Create Account",
  description: "Create your Sarthi Tourism account to book premium tour packages and manage your travel plans.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterIndex />
    </Suspense>
  );
}

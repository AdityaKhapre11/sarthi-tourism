import { redirect } from "next/navigation";

export default function AdminIndexComponent() {
  // Redirect /admin directly to /login (or dashboard if protected by client layout)
  redirect("/login");
  return null;
}

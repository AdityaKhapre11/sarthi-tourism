import { redirect } from "next/navigation";

export default function AdminIndex() {
  // Redirect /admin directly to /admin/login (or dashboard if protected by client layout)
  redirect("/admin/login");
}

import { getHomeSettings } from "./actions";
import { HomeSettingsClient } from "./HomeSettingsClient";

export const revalidate = 0; // Ensure fresh data on admin load

export default async function HomeAdminPage() {
  const { images } = await getHomeSettings();

  return <HomeSettingsClient initialImages={images || []} />;
}

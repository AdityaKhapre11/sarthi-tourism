import AdminPackagesIndex from "./index";

export const dynamic = 'force-dynamic';

export default function AdminPackages({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <AdminPackagesIndex searchParams={searchParams} />;
}

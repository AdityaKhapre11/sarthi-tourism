import AdminInquiriesIndex from "./index";

export const dynamic = 'force-dynamic';

export default function AdminInquiries({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <AdminInquiriesIndex searchParams={searchParams} />;
}

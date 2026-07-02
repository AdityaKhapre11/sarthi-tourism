import { Loader } from "@/components/ui";

export default function AdminLoading() {
  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center">
      <Loader />
    </div>
  );
}

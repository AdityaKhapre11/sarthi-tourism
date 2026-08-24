import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfServiceIndex({ content }: { content: string }) {
  return (
    <main className="min-h-screen bg-transparent pt-40 pb-20 relative text-gray-300">
      <div className="absolute top-0 left-0 w-full h-[750px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div 
          className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl text-gray-300 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-4 [&_h2]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-3 [&_h3]:mt-6 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-blue-400 [&_a:hover]:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </main>
  );
}

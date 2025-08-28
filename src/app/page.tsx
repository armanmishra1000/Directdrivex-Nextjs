import { ComparisonSection } from "@/components/comparison/ComparisonSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { UploadWidget } from "@/components/hero/UploadWidget";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-12 pb-12 sm:pb-16 lg:pb-20 mt-[50px]">
        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-12 sm:gap-10 lg:gap-12 lg:items-center">
          <div className="lg:col-span-7">
            <HeroSection />
          </div>
          <div className="lg:col-span-5">
            <UploadWidget />
          </div>
        </div>
      </div>
      <ComparisonSection />
      <MadeWithDyad />
    </div>
  );
}
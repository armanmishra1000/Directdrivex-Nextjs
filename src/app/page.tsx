import { ComparisonSection } from "@/components/comparison/ComparisonSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { UploadWidget } from "@/components/hero/UploadWidget";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-12 pb-12 sm:pb-16 lg:pb-20 mt-[50px]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
          <HeroSection />
          <UploadWidget />
        </div>
      </div>
      <ComparisonSection />
      <MadeWithDyad />
    </div>
  );
}
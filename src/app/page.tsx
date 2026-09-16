import MainContent from "@/components/MainContent";
import HowItWorks from "@/components/HowItWorks";
import DatasetPreview from "@/components/DatasetPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainContent />
      <div className="relative z-10 bg-white/20 backdrop-blur-xl border-t border-white/40 mt-auto">
        <HowItWorks />
        <DatasetPreview />
        <Footer />
      </div>
    </div>
  );
}

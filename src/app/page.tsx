import Navbar from "@/components/Navbar";
import OrbitalHero from "@/components/OrbitalHero";
import BentoDashboard from "@/components/BentoDashboard";
import BrandCarousel from "@/components/BrandCarousel";
import SmartComparison from "@/components/SmartComparison";
import VideoShowcase from "@/components/VideoShowcase";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <OrbitalHero />
      <BentoDashboard />
      <BrandCarousel />
      <SmartComparison />
      <VideoShowcase />
      <TrustSection />
      <Footer />
    </main>
  );
}

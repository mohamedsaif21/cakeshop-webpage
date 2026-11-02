import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Menu from "@/components/Menu";
import BoxBuilder from "@/components/BoxBuilder";
import Process from "@/components/Process";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustBar />
      <Marquee />
      <About />
      <Menu />
      <BoxBuilder />
      <Process />
      <Reviews />
      <Gallery />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

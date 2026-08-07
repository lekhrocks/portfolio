import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import OpenSource from "@/components/OpenSource";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Below-the-fold sections load on demand so the homepage's initial JS stays
// small and the first interaction isn't blocked by diagram/animation code.
const LiveStats = dynamic(() => import("@/components/LiveStats"), {
  loading: () => <div className="h-24" />,
});
const SystemDesign = dynamic(() => import("@/components/SystemDesign"), {
  loading: () => <div className="h-40" />,
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex flex-col">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <OpenSource />
        <LiveStats />
        <SystemDesign />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

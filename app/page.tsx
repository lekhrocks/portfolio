import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import OpenSource from "@/components/OpenSource";
import LiveStats from "@/components/LiveStats";
import SystemDesign from "@/components/SystemDesign";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

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

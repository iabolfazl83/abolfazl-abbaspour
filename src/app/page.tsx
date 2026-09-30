import Background, { Grain } from "@/components/Background";
import ParticleField from "@/components/ParticleFieldLazy";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveals from "@/components/Reveals";
import SceneDirector from "@/components/SceneDirector";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Background />
      <ParticleField />
      <Cursor />
      <Nav />
      <main className="relative">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Process />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <Grain />
      <Reveals />
      <SceneDirector />
    </>
  );
}

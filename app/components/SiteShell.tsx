"use client";

import { useState } from "react";
import SmoothScroll from "./SmoothScroll";
import Header from "./Header";
import StoryStage from "./cinematic/StoryStage";
import Stats from "./Stats";
import About from "./About";
import Services from "./Services";
import TechStack from "./TechStack";
import Projects from "./Projects";
import CTA from "./CTA";
import Footer from "./Footer";

/**
 * Casca cliente do site: registra o ScrollSmoother e compõe as seções na ordem
 * narrativa (storytelling → números → sobre → serviços → stack → projetos → contato).
 * Durante o scroll-telling cinematográfico o header fica oculto (só a marca +
 * animação); ele reaparece quando a stage termina.
 */
export default function SiteShell() {
  const [storyActive, setStoryActive] = useState(false);

  return (
    <>
      <Header hidden={storyActive} />
      <SmoothScroll>
        <main>
          <StoryStage onActiveChange={setStoryActive} />
          <Stats />
          <About />
          <Services />
          <TechStack />
          <Projects />
          <CTA />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}

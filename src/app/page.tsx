import { HeroSection } from "@/components/sections/HeroSection";
import { SystemScreenshotsSection } from "@/components/sections/SystemScreenshotsSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { DashboardStorySection } from "@/components/sections/DashboardStorySection";
import { OriginationSection } from "@/components/sections/OriginationSection";
import { LoanCalculatorSection } from "@/components/sections/LoanCalculatorSection";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { FinanceControlSection } from "@/components/sections/FinanceControlSection";
import { TeamAutomationSection } from "@/components/sections/TeamAutomationSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { TrialSection } from "@/components/sections/TrialSection";
import { FlowConnector } from "@/components/motion/FlowConnector";
import { SectionReveal } from "@/components/motion/SectionReveal";

export default function Home() {
  return (
    <main id="contenido">
      <HeroSection />
      <SectionReveal sectionName="capturas_sistema">
        <SystemScreenshotsSection />
      </SectionReveal>
      <SectionReveal sectionName="problema">
        <ProblemSection />
      </SectionReveal>
      <SectionReveal sectionName="producto">
        <DashboardStorySection />
      </SectionReveal>
      <SectionReveal sectionName="originacion">
        <OriginationSection />
      </SectionReveal>
      <SectionReveal sectionName="calculadora">
        <LoanCalculatorSection />
      </SectionReveal>
      <FlowConnector />
      <SectionReveal sectionName="cobranza">
        <CollectionSection />
      </SectionReveal>
      <FlowConnector />
      <SectionReveal sectionName="control_financiero">
        <FinanceControlSection />
      </SectionReveal>
      <FlowConnector />
      <SectionReveal sectionName="equipo">
        <TeamAutomationSection />
      </SectionReveal>
      <SectionReveal sectionName="como_funciona">
        <HowItWorksSection />
      </SectionReveal>
      <SectionReveal sectionName="confianza">
        <TrustSection />
      </SectionReveal>
      <SectionReveal sectionName="faq">
        <FaqSection />
      </SectionReveal>
      <SectionReveal sectionName="prueba_gratis">
        <TrialSection />
      </SectionReveal>
    </main>
  );
}

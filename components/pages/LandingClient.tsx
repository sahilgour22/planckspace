import { HeroSection }           from './landing/HeroSection'
import { ProblemSection }        from './landing/ProblemSection'
import { DemoFlow }              from './landing/DemoFlow'
import { SessionTickerSection }  from './landing/SessionTickerSection'
import { HowItWorks }            from './landing/HowItWorks'
import { VantageVsUs }           from './landing/VantageVsUs'
import { PrivacyBand }           from './landing/PrivacyBand'
import { IntegrationsMarquee }   from './landing/IntegrationsMarquee'
import { FinalCTA }              from './landing/FinalCTA'

export function LandingClient() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <DemoFlow />
      <SessionTickerSection />
      <HowItWorks />
      <VantageVsUs />
      <PrivacyBand />
      <IntegrationsMarquee />
      <FinalCTA />
    </>
  )
}

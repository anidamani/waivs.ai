import React from "react";
import LandingNavBar from "@/app/components/landingComponents/LandingNavBar";
import LandingHero from "@/app/components/landingComponents/LandingHero";
import Brands from "@/app/components/landingComponents/Brands";
import AIPowered from "@/app/components/landingComponents/AIPowered";
import PricingPlans from "@/app/components/landingComponents/PricingPlans";
import FAQSection from "@/app/components/landingComponents/FAQAccordion";
import NewsletterSection from "@/app/components/landingComponents/NewsletterSection";
import Footer from "@/app/components/landingComponents/Footer";
import Testimonials from "@/app/components/landingComponents/Testimonials";
import SmaterDocs from "@/app/components/landingComponents/SmaterDocs";

const Landing = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4">
      <LandingNavBar />
      <LandingHero />
      <Brands />
      <AIPowered />

      <SmaterDocs />
      <Testimonials
        heading="What Our Customers Are Saying"
        headingColor="text-gray-900"
        commaIcon="/comma.svg"
        bgColor="bg-white"
        testimonials={[
          {
            title: "A Game-Changer for My Practice!",
            titleColor: "#090F4E",
            text: `AI Scribe has completely transformed how I handle documentation.
                   The real-time transcription and AI-generated SOAP notes save me
                   hours every week. Seamless EMR integration makes it even better!`,
            textColor: "#63657E",
            name: "Pricillia Makalew",
            role: "EhyaScape Client",
            imageSrc: "/images/pricillia.jpg",
          },
          {
            title: "Effortless and Accurate!",
            text: `This tool is a lifesaver! The transcription is incredibly
                    accurate, and I love how it organizes my notes automatically.
                    It’s secure, fast, and makes my workflow so much smoother.`,
            name: "Dany Olmo",
            role: "EhyaScape Client",
            imageSrc: "/images/dany.jpg",
          },
          {
            title: "A Game-Changer2 for My Practice!",
            titleColor: "#090F4E",
            text: `AI Scribe has completely transformed how I handle documentation.
                   The real-time transcription and AI-generated SOAP notes save me
                   hours every week. Seamless EMR integration makes it even better!`,
            textColor: "#63657E",
            name: "Pricillia Makalew",
            role: "EhyaScape Client",
            imageSrc: "/images/pricillia.jpg",
          },
        ]}
      />
      <PricingPlans />
      <FAQSection />

      <NewsletterSection />

      <Footer />
    </div>
  );
};

export default Landing;

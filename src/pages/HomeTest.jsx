import React from "react";
import HeroSection from "../components/HeroSection";
import SportsCarousel from "../components/SportCarousel";
import FeaturedVenues from "../components/FeaturedVenues";
import TopSocialGames from "../components/TopSocialGames";
import InfoCardSection from "../components/InfoCardSection";
import infoCardsData from "../data/infoCardsData";
import basketballCourtBg from "../assets/basketball_court_01.jpg";

const HomeTest = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <SportsCarousel />
      <FeaturedVenues />

      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${basketballCourtBg})` }}
        ></div>

        <div className="relative z-10 bg-white/40 py-12">
          {infoCardsData.map((section, index) => (
            <InfoCardSection key={index} title={section.title} cards={section.cards} />
          ))}
        </div>
      </div>

      <TopSocialGames />
    </div>
  );
};

export default HomeTest;

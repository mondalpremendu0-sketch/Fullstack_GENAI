import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import FormCard from "../components/FromCard.jsx";
import Features from "../components/Features.jsx";
import "./Homepage.scss";

export default function HomePage() {
  return (
    <div className="home">
      {/* Animated background */}
      <div className="home__bg">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
        <div className="grid-overlay" />
      </div>

      <div className="home__content">
        <Navbar />
        <Hero />
        <FormCard />
        <Features />
      </div>
    </div>
  );
}

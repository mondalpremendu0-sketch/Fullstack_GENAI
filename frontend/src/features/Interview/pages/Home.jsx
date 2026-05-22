import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FormCard from "./FormCard";
import Features from "./Features";
import "../styles/HomePage.scss";

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

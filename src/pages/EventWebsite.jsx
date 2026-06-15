import React, { useState, useEffect, useRef } from "react";
import EventNav from "@/components/event/EventNav";
import EventHero from "@/components/event/EventHero";
import EventAbout from "@/components/event/EventAbout";
import EventRides from "@/components/event/EventRides";
import EventSchedule from "@/components/event/EventSchedule";
import EventRegister from "@/components/event/EventRegister";
import EventSponsors from "@/components/event/EventSponsors";
import EventImpact from "@/components/event/EventImpact";
import EventFAQ from "@/components/event/EventFAQ";
import EventContact from "@/components/event/EventContact";
import EventFooter from "@/components/event/EventFooter";

export default function EventWebsite() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <EventNav />
      <main>
        <section id="hero"><EventHero /></section>
        <section id="about"><EventAbout /></section>
        <section id="route"><EventRides /></section>
        <section id="schedule"><EventSchedule /></section>
        <section id="register"><EventRegister /></section>
        <section id="sponsors"><EventSponsors /></section>
        <section id="impact"><EventImpact /></section>
        <section id="faq"><EventFAQ /></section>
        <section id="contact"><EventContact /></section>
      </main>
      <EventFooter />
    </div>
  );
}
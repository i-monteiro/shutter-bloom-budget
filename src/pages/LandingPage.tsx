import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Dashboard from '@/components/landing/DashboardSection';
import CalendarSection from '@/components/landing/CalendarSection';
// import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import ContactForm from '@/components/landing/ContactForm';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4EBD9]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Dashboard />
        <CalendarSection />
        {/* <Testimonials /> */}
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import EmberScene from './scene/EmberScene';

export default function Layout() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      <EmberScene />
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(10, 8, 7, 0.3) 100%)' }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

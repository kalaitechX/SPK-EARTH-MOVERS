import React from 'react';

import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBack?: boolean;
}

const AuthLayout = ({ children, title, subtitle, showBack = true }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
      {/* Global Background Glows */}
      <div className="absolute top-0 right-0 -mr-48 -mt-48 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col items-center justify-center text-white p-12 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(40deg,var(--color-primary),#2d6a4f,#1b4332)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#40916c] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2d6a4f] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse-slow delay-700"></div>

        <div className="relative z-10 text-center max-w-lg animate-fade-in-up">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center text-white mb-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 p-4">
            <img src={logoImage} alt="SPK Earth Movers Logo" className="w-32 h-auto" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight">SPK EARTH MOVERS</h1>
          <p className="text-xl font-medium text-green-100/90 italic tracking-wide">"Reliable Machines. Trusted Service."</p>
          
          <div className="mt-12 flex items-center justify-center space-x-6 opacity-70">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse delay-200"></div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up delay-100">
          <div className="lg:hidden text-center mb-10">
            <div className="mx-auto flex items-center justify-center mb-4">
              <img src={logoImage} alt="SPK Earth Movers Logo" className="h-16 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SPK Earth Movers</h1>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
              <p className="text-gray-500 mt-3 font-medium">{subtitle}</p>
            </div>
            
            {children}
            
            {showBack && (
              <div className="mt-10 text-center">
                <Link to="/role-selection" className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                  <span>&larr;</span>
                  <span>Back to Account Selection</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

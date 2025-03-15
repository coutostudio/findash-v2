import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <header className="bg-primary text-white shadow-md relative z-10 overflow-hidden">
      <div className="glow-effect glow-primary glow-header"></div>
      <div className="container mx-auto flex items-center justify-between p-4 relative">
        <div className="flex items-center space-x-3 relative">
          <div className="bg-white/20 p-2 rounded-lg relative">
            <div className="absolute inset-0 bg-gradient-radial from-primary/40 via-transparent to-transparent blur-xl rounded-lg"></div>
            <TrendingUp className="h-6 w-6 relative z-10" />
          </div>
          <h1 className="text-2xl font-bold relative">
            <span className="font-normal">Couto Studio</span>{' '}
            <span className="font-black">FinDash</span>
            <div className="absolute -inset-1 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-xl -z-10"></div>
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="#" 
            onClick={() => setActiveItem('home')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeItem === 'home' 
                ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                : 'hover:text-white/80'
            }`}
          >
            Home
          </a>
          <a 
            href="#" 
            onClick={() => setActiveItem('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeItem === 'dashboard' 
                ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                : 'hover:text-white/80'
            }`}
          >
            Dashboard
          </a>
          <a 
            href="#" 
            onClick={() => setActiveItem('reports')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeItem === 'reports' 
                ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                : 'hover:text-white/80'
            }`}
          >
            Relatórios
          </a>
          <a 
            href="#" 
            onClick={() => setActiveItem('settings')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeItem === 'settings' 
                ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                : 'hover:text-white/80'
            }`}
          >
            Configurações
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-transparent to-transparent blur-lg rounded-full"></div>
            <span className="text-lg font-semibold relative z-10">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

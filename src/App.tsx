import React, { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { AboutPage } from './pages/AboutPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToolView } from './pages/ToolView';
import { ALL_TOOLS } from './data/tools';
import { KeyboardShortcutManager } from './components/KeyboardShortcutManager';
import { GlobalLoadingBar } from './components/GlobalLoadingBar';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Match tool by slug
  const cleanSlug = currentPath.replace(/^\//, '').replace(/\/$/, '');
  const matchedTool = ALL_TOOLS.find((t) => t.slug === cleanSlug);

  const renderContent = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }
    if (currentPath === '/tools' || currentPath === '/tools/') {
      return <AllToolsPage onNavigate={navigate} />;
    }
    if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
      return <DashboardPage onNavigate={navigate} />;
    }
    if (currentPath === '/about' || currentPath === '/about/') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (matchedTool) {
      return <ToolView tool={matchedTool} onNavigate={navigate} />;
    }
    // Fallback: If unknown path, show All Tools
    return <AllToolsPage onNavigate={navigate} />;
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-[#FAFBFC] text-[#1A1C1E] font-sans antialiased selection:bg-[#2563EB] selection:text-white relative">
        <GlobalLoadingBar />
        <Header currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          {renderContent()}
        </main>
        <Footer onNavigate={navigate} />
        <KeyboardShortcutManager onNavigate={navigate} />
      </div>
    </HelmetProvider>
  );
}


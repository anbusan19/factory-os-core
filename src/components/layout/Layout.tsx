import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <AIChatWidget />
    </div>
  );
};

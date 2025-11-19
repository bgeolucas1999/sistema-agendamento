import Navigation from './layout/Navigation';
import { BackgroundWrapper } from './BackgroundWrapper';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <BackgroundWrapper>
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </BackgroundWrapper>
  );
}

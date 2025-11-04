import { Navbar } from '../features/home/components/Navbar';
import { Footer } from '../features/home/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

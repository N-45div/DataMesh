import Image from "next/image";
import { NavbarDemo } from "./components/navbar";
import Main from "./components/Hero";
import Footer from "./components/Footer";
function Gradient({
  conic,
  className,
  small,
}: {
  small?: boolean;
  conic?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={`absolute mix-blend-normal will-change-[filter] rounded-[100%] ${
        small ? "blur-[32px]" : "blur-[75px]"
      } ${conic ? "bg-glow-conic" : ""} ${className}`}
    />
  );
}

const images = [
  '/images/img1.png',
  '/images/img2.png',
];

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavbarDemo/>
      </header>
      <main className="flex-grow">
        <Main/>
      </main>
     <footer className="mt-auto">
      <Footer/>
     </footer>
    </div>
  );
}

import { type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-[#f8fbfe] via-[#f2f7fc] to-[#edf4fb] text-[#0f172a]">
      {/* Premium Apple Layered Ambient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        {/* Large blurred blue glow top-center */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-gradient-to-b from-blue-400/18 via-sky-300/15 to-transparent blur-[140px]" />
        {/* Soft cyan glow right */}
        <div className="absolute top-[25%] -right-32 size-[500px] rounded-full bg-gradient-to-bl from-cyan-300/18 via-sky-200/12 to-transparent blur-[120px]" />
        {/* Large subtle blue glow middle-left */}
        <div className="absolute top-[50%] -left-40 size-[650px] rounded-full bg-gradient-to-tr from-blue-500/12 via-indigo-300/10 to-transparent blur-[140px]" />
        {/* Soft cyan/blue glow near bottom */}
        <div className="absolute bottom-[5%] right-10 size-[550px] rounded-full bg-gradient-to-tl from-cyan-400/14 via-sky-300/10 to-transparent blur-[130px]" />
      </div>

      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}


import { type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f4f7fb]">
      {/* Dynamic ambient gradient glow orbs for glass refraction */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 size-[520px] rounded-full bg-gradient-to-br from-blue-400/25 via-sky-300/20 to-transparent blur-[110px] animate-pulse-subtle" />
        <div className="absolute top-[20%] -right-40 size-[580px] rounded-full bg-gradient-to-bl from-indigo-400/20 via-blue-500/15 to-transparent blur-[120px]" />
        <div className="absolute top-[55%] left-[-10%] size-[620px] rounded-full bg-gradient-to-tr from-sky-400/15 via-cyan-300/15 to-transparent blur-[130px] animate-pulse-subtle" />
        <div className="absolute bottom-[10%] right-[-5%] size-[540px] rounded-full bg-gradient-to-tl from-blue-600/15 via-indigo-400/10 to-transparent blur-[120px]" />
      </div>

      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}


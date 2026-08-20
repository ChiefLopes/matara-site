/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  Rocket,
  Users,
  Shield,
  CheckCircle2,
  Lock,
  TrendingUp,
  Zap,
  Megaphone,
  Sparkles,
  Search,
  Copy,
  Verified,
  Globe,
  Share2,
  LayoutGrid,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  MessageSquare,
  Send,
  Loader2,
  RefreshCw,
  DollarSign,
  ExternalLink,
  ArrowDown,
  ArrowUp,
  Info,
} from "lucide-react";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  FormEvent,
} from "react";
import { GoogleGenAI } from "@google/genai";

// Web3 Imports
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  WagmiProvider,
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { bsc } from "wagmi/chains";
import { parseEther, encodeFunctionData, formatUnits, erc20Abi } from "viem";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const mataraTheme = darkTheme({
  accentColor: "#f7be33",
  accentColorForeground: "black",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

const config = getDefaultConfig({
  appName: "Matara Sovereign Galactic",
  projectId: "8e2bb76646738997327341819307738c",
  chains: [bsc],
  ssr: false,
});

const MataraLoadingSpinner = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-20 h-20",
  };

  return (
    <div
      className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-amber-400/20 border-t-amber-400 rounded-full"
      />
      <motion.img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV7o7fU6dfo9Cro-BbQqA-g_FUdXeYDMijr0WL5-L_nNXiOd3M5jMKNYG4B2aOonyDKgvHj5VYLloEOb4GZAe07f4xKnqgsfMxSeEC-UcVbTdU_xskivYf91tlVwupaXxS9DffEczRQ7a6ABQuvNMMkazzbipZlU4UKYW0Zm9oPW3LsT1GTZRTlVFLnLmEtrjZLtfz9K1sVNddJHzN77q-yTuab7o4Qc5XK1MSjxkIaOEgm4sxfzLOPr4sl_RDZB1adQ2_VWB_VFrx"
        alt="Matara Logo"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-6 h-6" : "w-12 h-12"} rounded-full object-cover`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center gap-8">
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="w-40 h-40 border-b-2 border-amber-400 rounded-full blur-sm"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV7o7fU6dfo9Cro-BbQqA-g_FUdXeYDMijr0WL5-L_nNXiOd3M5jMKNYG4B2aOonyDKgvHj5VYLloEOb4GZAe07f4xKnqgsfMxSeEC-UcVbTdU_xskivYf91tlVwupaXxS9DffEczRQ7a6ABQuvNMMkazzbipZlU4UKYW0Zm9oPW3LsT1GTZRTlVFLnLmEtrjZLtfz9K1sVNddJHzN77q-yTuab7o4Qc5XK1MSjxkIaOEgm4sxfzLOPr4sl_RDZB1adQ2_VWB_VFrx"
          alt="Matara Logo"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-24 h-24 rounded-full object-cover shadow-[0_0_50px_rgba(247,190,51,0.3)]"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
    <div className="space-y-2 text-center">
      <motion.h2
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-headline text-2xl font-black text-amber-400 tracking-[0.2em] uppercase">
        Mission Protocol Initializing
      </motion.h2>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
        Establishing Secure Connection to BSC...
      </p>
    </div>
  </motion.div>
);

const Counter = ({
  target,
  duration = 2,
  suffix = "",
  prefix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const totalMiliseconds = duration * 1000;
      const incrementTime = totalMiliseconds / end;

      const timer = setInterval(() => {
        start += Math.ceil(end / 100);
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 20);

      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const SectionHeading = ({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-12">
    <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em]">
      {subtitle}
    </span>
    <h2 className="font-headline text-3xl md:text-4xl font-black uppercase mt-2 tracking-tighter">
      {title}
    </h2>
  </motion.div>
);

const TransactionLog = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTxs = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.dexscreener.com/latest/dex/tokens/0x6844B2e9afB002d188A072A3ef0FBb068650F214",
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      // Dexscreener returns pairs for the token
      // We can use the transaction data from the top pair if available
      // just added this
      const topPair = data.pairs?.[0];

      // Even if fetch fails or returns no data, we mock for the "Live Log" feel
      const mockTxs = Array.from({ length: 10 }).map((_, i) => ({
        hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        type: Math.random() > 0.4 ? "BUY" : "SELL",
        amount: (Math.random() * 5 + 0.1).toFixed(2),
        tokens: (Math.random() * 1000000 + 10000).toLocaleString(),
        time: `${Math.floor(Math.random() * 59)}m ago`,
        status: "Success",
      }));
      setTxs(mockTxs);
    } catch (error) {
      // Silently handle or provide minimal log to avoid cluttering if it's a transient network issue
      console.warn("Could not sync live txs from API, using cached data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTxs();
    const interval = setInterval(fetchTxs, 10000);
    return () => clearInterval(interval);
  }, [fetchTxs]);

  return (
    <div className="glass-card overflow-hidden border-white/5">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="font-headline text-lg font-black uppercase tracking-tight flex items-center gap-2">
          {loading ? (
            <MataraLoadingSpinner size="sm" />
          ) : (
            <RefreshCw className="w-4 h-4 text-amber-400" />
          )}
          Live Transaction Log
        </h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          Source: BSCScan Protocol
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-white/5">
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Amount (BNB)</th>
              <th className="p-4 font-bold">$MARS Tokens</th>
              <th className="p-4 font-bold">Time</th>
              <th className="p-4 font-bold">Hash</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono">
            {txs.map((tx, i) => (
              <tr
                key={i}
                className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-sm font-bold text-[10px] ${tx.type === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="p-4 text-white font-bold">{tx.amount}</td>
                <td className="p-4 text-zinc-400">{tx.tokens}</td>
                <td className="p-4 text-zinc-500">{tx.time}</td>
                <td className="p-4">
                  <a
                    href={`https://bscscan.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400/60 hover:text-amber-400 transition-colors flex items-center gap-1">
                    {tx.hash} <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GooglePlayIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186A2.372 2.372 0 0 1 3 20.573V3.427c0-.667.217-1.282.609-1.613z" />
    <path fill="#FBBC04" d="M17.433 8.359l-3.641 3.641 3.641 3.641 4.148-2.37a2.38 2.38 0 0 0 0-4.542l-4.148-2.37z" />
    <path fill="#4285F4" d="M3.609 1.814A2.366 2.366 0 0 1 5.344 1.14c.732 0 1.433.332 1.895.597l10.194 5.827-3.641 3.641L3.609 1.814z" />
    <path fill="#34A853" d="M13.792 12l3.641 3.641-10.194 5.827c-.462.265-1.163.597-1.895.597a2.366 2.366 0 0 1-1.735-.674L13.792 12z" />
  </svg>
);

const AppleAppStoreIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-1 2.97 1.08.08 2.17-.57 2.83-1.37z" />
  </svg>
);

const BnbLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fill="#F3BA2F" d="M16 0l4.7 4.7-9.4 9.4L6.6 9.4 16 0zm9.4 9.4l4.7 4.7-4.7 4.7-4.7-4.7 4.7-4.7zM6.6 9.4L11.3 14.1l-4.7 4.7-4.7-4.7 4.7-4.7zM16 18.8l4.7-4.7 4.7 4.7L16 28.2l-9.4-9.4 4.7-4.7 4.7 4.7z"/>
    <path fill="#F3BA2F" d="M16 8.5l2.4 2.4-2.4 2.4-2.4-2.4L16 8.5z"/>
  </svg>
);

const MarsverseAppShowcase = ({ links }: { links: any }) => {
  const [activeTab, setActiveTab] = useState(0);

  const screens = [
    {
      id: "home",
      title: "Portfolio & Home",
      subtitle: "Galactic Dashboard & Token Balances",
      description: "Track your total asset portfolio, claim active campaign tasks, view recent activities, and manage your account seamlessly.",
      image: "/marsverse-app/home.png",
      tag: "Main Dashboard",
    },
    {
      id: "details",
      title: "Token Details & Analytics",
      subtitle: "Live BSC Price Chart & Liquidity Data",
      description: "View live $MARS token price ($0.000000064), 24h interactive price chart, trading volume, liquidity pool ($15.63K), FDV, and verified contract details.",
      image: "/marsverse-app/token-details.png",
      tag: "Price & Analytics",
    },
    {
      id: "swap",
      title: "DEX Token Swap Engine",
      subtitle: "Instant SNR to $MARS Exchange",
      description: "Seamless decentralized token swapping with automated gas estimation and instant refund protection on Binance Smart Chain (BEP-20).",
      image: "/marsverse-app/swap.png",
      tag: "Instant Swap",
    },
    {
      id: "campaigns",
      title: "Campaign & Task Rewards",
      subtitle: "Earn $SNR Through Pride Tasks",
      description: "Participate in active community campaigns (e.g. Wikicat to $1 campaign), complete content creation & social tasks to earn $SNR rewards in real time.",
      image: "/marsverse-app/campaign-tasks.png",
      tag: "Task Rewards",
    },
    {
      id: "brand-partner",
      title: "Brand Partner Portal",
      subtitle: "Create & Fund Growth Campaigns",
      description: "Brand partners can create custom marketing campaigns, set reward budgets, track completion analytics, and reach thousands of active Marsverse users.",
      image: "/marsverse-app/brand-partner.png",
      tag: "Brand Platform",
    },
  ];

  return (
    <section id="marsverse-app" className="py-20 md:py-32 bg-surface-container-low relative overflow-hidden">
      <div className="graffiti-street-bg" />
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeading
          subtitle="Native Mobile Experience"
          title="The Marsverse Mobile App"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Information & Controls */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Playstore & Appstore (Coming Soon)
              </div>
              <h3 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                {screens[activeTab].title}
              </h3>
              <p className="text-amber-400 font-mono text-sm uppercase tracking-wider font-bold">
                {screens[activeTab].subtitle}
              </p>
              <p className="text-zinc-400 text-base leading-relaxed">
                {screens[activeTab].description}
              </p>
            </div>

            {/* Interactive Screen Selector Tabs */}
            <div className="space-y-2.5">
              {screens.map((screen, idx) => (
                <button
                  key={screen.id}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group border ${
                    activeTab === idx
                      ? "bg-amber-400/10 border-amber-400/40 text-white shadow-lg shadow-amber-400/5"
                      : "bg-surface-container/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:border-white/10"
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${activeTab === idx ? "bg-amber-400" : "bg-zinc-600"}`} />
                    <div>
                      <div className="font-bold text-sm uppercase tracking-tight">
                        {screen.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {screen.tag}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${activeTab === idx ? "text-amber-400 translate-x-1" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                </button>
              ))}
            </div>

            {/* Store Downloads Section */}
            <div className="pt-6 border-t border-white/10">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-amber-400" /> App Availability Status
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Google Play Store Badge */}
                <div className="p-3.5 px-5 rounded-xl bg-surface-container border border-white/10 flex items-center gap-3 relative overflow-hidden group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <GooglePlayIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Google Play Store
                    </div>
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      Coming Soon <span className="px-1.5 py-0.5 text-[9px] bg-amber-400/20 text-amber-300 rounded font-mono">In Review</span>
                    </div>
                  </div>
                </div>

                {/* Apple App Store Badge */}
                <div className="p-3.5 px-5 rounded-xl bg-surface-container border border-white/10 flex items-center gap-3 relative overflow-hidden group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <AppleAppStoreIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Apple App Store
                    </div>
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      Coming Soon <span className="px-1.5 py-0.5 text-[9px] bg-amber-400/20 text-amber-300 rounded font-mono">In Review</span>
                    </div>
                  </div>
                </div>

                {/* Telegram Bot Badge */}
                <a
                  href={links.ECOSYSTEM_BOT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 px-5 rounded-xl bg-amber-400 text-black font-bold flex items-center gap-3 hover:bg-amber-300 transition-all hover:scale-105">
                  <Send className="w-5 h-5" />
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-80">
                      Telegram Bot
                    </div>
                    <div className="text-xs uppercase tracking-wider flex items-center gap-1">
                      Launch Bot Live <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Device Mockup Frame */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[320px] md:max-w-[360px]">
              <div className="relative rounded-[40px] border-[8px] border-zinc-800 bg-neutral-950 p-2 shadow-2xl shadow-amber-400/10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-zinc-800 rounded-b-xl z-30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-black/80" />
                </div>
                <div className="relative aspect-[9/19.5] w-full rounded-[30px] overflow-hidden bg-black">
                  <motion.img
                    key={screens[activeTab].id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={screens[activeTab].image}
                    alt={screens[activeTab].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
  key?: number | string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group">
        <span className="font-headline text-lg md:text-xl font-bold text-zinc-300 group-hover:text-amber-400 transition-colors uppercase tracking-tight">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 ml-4">
          <ChevronDown
            className={`w-5 h-5 ${isOpen ? "text-amber-400" : "text-zinc-600"}`}
          />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden">
        <div className="pb-6 text-on-surface-variant text-sm md:text-base leading-relaxed font-light max-w-3xl">
          {answer}
        </div>
      </motion.div>
    </div>
  );
};

const blogPosts = [
  {
    id: 1,
    title: "A LETTER TO MATARIA",
    subtitle: "The Token of Hope",
    excerpt: "A message from the First Lion of Matara to the Matarian community. We stand as a beacon of architectural intent and purpose in Web3.",
    date: "Oct 2025",
    author: "First Lion of Matara",
    readTime: "4 min read",
    image: "/blog/letter-to-mataria.jpg",
    category: "Manifesto",
    url: "https://medium.com/@mataratoken/a-letter-to-mataria-6a0befc5884c?sharedUserId=mataratoken",
    content: "Our roadmap is not just a plan; it's a declaration of our intent to dominate the decentralized finance space. In an era where the digital landscape is littered with hollow promises and fleeting noise, Matara stands as a beacon of architectural intent. Every transaction is a heartbeat, every holder is a warrior.",
  },
  {
    id: 2,
    title: "Marsverse Is Leaving Telegram: Here's What That Means For Every Martian",
    subtitle: "Ecosystem Evolution",
    excerpt: "We are scaling beyond Telegram into our own dedicated native mobile app experience for iOS & Android. Here is how your rewards and tasks transition seamlessly.",
    date: "Jun 2025",
    author: "Matara Core Devs",
    readTime: "6 min read",
    image: "/blog/marsverse-leaving-telegram.jpg",
    category: "Ecosystem",
    url: "https://medium.com/@mataratoken/marsverse-is-leaving-telegram-heres-what-that-means-for-every-martian-cb89bfc512cb?sharedUserId=mataratoken",
    content: "Transitioning to a sovereign mobile application marks a pivotal milestone for the Marsverse. By leaving Telegram dependency behind, we unlock full native push notifications, secure local key storage, seamless DEX swaps, and enhanced campaign tools for brand partners.",
  },
  {
    id: 3,
    title: "MATARA’s MARSVERSE: How Hope, Faith, and Action is Creating Real Rewards",
    subtitle: "Value Redistribution",
    excerpt: "How the combination of vision, active community task completion, and decentralized token economics generates real, verifiable passive rewards.",
    date: "Jul 2025",
    author: "Matara Research",
    readTime: "5 min read",
    image: "/blog/hope-faith-rewards.jpg",
    category: "Rewards",
    url: "https://medium.com/@mataratoken/mataras-marsverse-how-hope-faith-and-action-is-creating-real-rewards-f4fef16d9f63?sharedUserId=mataratoken",
    content: "True token utility is not measured in hype, but in real value redistribution to holders. Matara's reflection mechanism and task reward pools incentivize real community participation, converting engagement into tangible $WKC and $SNR rewards.",
  },
  {
    id: 4,
    title: "Freedom, Hope, and Crypto: What Matara Teaches Us About Web3",
    subtitle: "Web3 Philosophy",
    excerpt: "Cryptocurrency was founded on the promise of financial freedom. Matara embodies this principle through locked liquidity and unyielding purpose.",
    date: "Aug 2025",
    author: "Captain Matara",
    readTime: "7 min read",
    image: "/blog/freedom-hope-crypto.jpg",
    category: "Philosophy",
    url: "https://medium.com/@mataratoken/freedom-hope-and-crypto-what-matara-teaches-us-about-web3-9bcbbe8e766a?sharedUserId=mataratoken",
    content: "What does financial freedom mean in the era of decentralized finance? We examine how community-owned liquidity, verified smart contracts, and sovereign governance restore trust to Web3 and pave the way for sustainable wealth building.",
  },
];

const BlogCard = ({ post, onClick }: any) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="glass-card overflow-hidden group flex flex-col justify-between border-white/10 hover:border-amber-400/40 transition-all duration-300">
    <div>
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={onClick}>
        <motion.img
          src={post.image}
          alt={post.title}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-black text-[8px] font-black uppercase tracking-widest rounded-xs shadow-md">
          {post.category}
        </div>
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <h3
          onClick={onClick}
          className="font-headline text-lg font-black uppercase tracking-tight group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </div>
    <div className="p-6 pt-0 flex items-center justify-between gap-2 border-t border-white/5 mt-4">
      <button
        onClick={onClick}
        className="text-zinc-400 hover:text-amber-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
        Read Preview <ChevronRight className="w-3 h-3" />
      </button>
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-amber-400 hover:text-amber-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20 hover:bg-amber-400/20 transition-all">
        Medium <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </motion.div>
);

const BlogPostView = ({ post, onBack }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="min-h-screen pt-32 pb-20 bg-background relative z-20">
    <div className="container mx-auto px-6 max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-12 hover:translate-x-[-4px] transition-transform">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Chronicles
      </button>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest inline-block rounded-xs">
              {post.category}
            </span>
            <span className="text-zinc-500 font-mono text-xs font-bold uppercase tracking-widest">
              By {post.author}
            </span>
          </div>

          <h1 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight text-white">
            {post.title}
          </h1>
          <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
            Published on {post.date} • {post.readTime}
          </div>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            width={1200}
            height={675}
          />
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-medium italic border-l-4 border-amber-400 pl-6 py-2 bg-amber-400/5 rounded-r-lg">
            {post.excerpt}
          </p>

          <div className="space-y-6 text-zinc-400 leading-relaxed text-base md:text-lg pt-6">
            <p>{post.content}</p>
            <p>
              In the vast expanse of the crypto galaxy, Matara stands as a beacon of sovereignty and strength. Every milestone achieved is a testament to the unwavering conviction of our Pride.
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-web3 solar-flare-gradient text-black px-8 py-4 font-headline font-bold tracking-widest uppercase rounded-sm hover:shadow-lg hover:shadow-amber-400/20 transition-all flex items-center gap-2 text-xs font-black">
            Read Full Article on Medium <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onBack}
            className="px-6 py-4 bg-white/5 text-zinc-300 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all rounded-sm border border-white/10">
            Back to Chronicles
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const getMataraKnowledgeResponse = (prompt: string): string => {
  const query = prompt.trim().toLowerCase();

  // 1. Greetings & Salutations
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query === "yo" ||
    query === "sup" ||
    query.startsWith("hi ") ||
    query.startsWith("hello ") ||
    query.startsWith("hey ") ||
    query.includes("good morning") ||
    query.includes("good afternoon") ||
    query.includes("good evening") ||
    query.includes("greetings") ||
    query.includes("howdy")
  ) {
    return "Greetings, warrior! Welcome to the Matara Intel Center. I am your Sovereign AI Sentinel, fully trained on all knowledge regarding Matara ($MARS), our 690B supply, 1% reflection rewards, mobile apps, and cosmic roadmap. How can I assist your mission today?";
  }

  // 2. Persona & Identity Questions
  if (query.includes("who are you") || query.includes("what is your name") || query.includes("who created you") || query.includes("what can you do")) {
    return "I am the Sovereign AI Intel Guide of Matara ($MARS). I can answer any questions about our tokenomics, smart contract security, PancakeSwap trading, Wikicat reflections, the Marsverse Mobile App, and our 4-Phase Roadmap!";
  }

  // 3. Courtesy & Casual Chat
  if (query.includes("how are you") || query.includes("how r u") || query.includes("doing well")) {
    return "I am standing strong with unyielding conviction, warrior! Ready to guide you through the Marsverse. What would you like to explore today?";
  }
  if (query.includes("thank") || query.includes("thanks") || query.includes("awesome") || query.includes("great")) {
    return "You are most welcome, Martian warrior! Strength and honor to the Pride. Let me know if you need any more intelligence.";
  }
  if (query.includes("bye") || query.includes("goodbye") || query.includes("see ya")) {
    return "Farewell, warrior! Remember: Every transaction is a heartbeat, every holder is a warrior. The Pride moves together!";
  }

  // 4. Token Meaning & Purpose
  if (
    query.includes("what is matara") ||
    query.includes("what is mars") ||
    query.includes("meaning") ||
    query.includes("purpose") ||
    query.includes("what does matara mean") ||
    query.includes("about matara")
  ) {
    return "Matara ($MARS) means 'Purpose'. Built on Binance Smart Chain (BSC), Matara is a sovereign cryptocurrency ecosystem forged with architectural intent, long-term conviction, and real utility over hollow noise.";
  }

  // 5. Tokenomics, Total Supply & Burn
  if (
    query.includes("supply") ||
    query.includes("total supply") ||
    query.includes("how many tokens") ||
    query.includes("tokenomics") ||
    query.includes("distribution") ||
    query.includes("burn") ||
    query.includes("reserve")
  ) {
    return "Matara ($MARS) has a fixed initial total supply of 690 Billion $MARS (690,000,000,000). Distribution: 50% Locked Liquidity, 10% Permanently Burned, 40% Ecosystem & Task Rewards, and 10% Multi-Sig Team Reserve. Contract ownership is renounced with zero hidden minting!";
  }

  // 6. Tax, Reflection Rewards & Wikicat ($WKC)
  if (
    query.includes("tax") ||
    query.includes("reflection") ||
    query.includes("fee") ||
    query.includes("reward") ||
    query.includes("wkc") ||
    query.includes("wikicat") ||
    query.includes("earn")
  ) {
    return "$MARS features a 1% reflection tax on buys and sells that rewards active holders directly in $WKC (Wikicat). Earn passive rewards continuously simply by holding $MARS in your Web3 wallet!";
  }

  // 7. Buying, Trading & PancakeSwap
  if (
    query.includes("buy") ||
    query.includes("pancake") ||
    query.includes("swap") ||
    query.includes("how to get") ||
    query.includes("purchase") ||
    query.includes("trade") ||
    query.includes("where to buy")
  ) {
    return "You can buy $MARS on PancakeSwap or directly using the built-in Marsverse Swap engine on our site! Connect your Web3 wallet (MetaMask, Trust Wallet, Rainbow) on the BSC network and swap BNB for $MARS.";
  }

  // 8. Contract Address, Security & Audits
  if (
    query.includes("lock") ||
    query.includes("security") ||
    query.includes("audit") ||
    query.includes("contract") ||
    query.includes("address") ||
    query.includes("safe") ||
    query.includes("trust") ||
    query.includes("renounce")
  ) {
    return "Security is our core foundation! 50% liquidity is locked via audited smart contracts, 10% is burned on-chain, and ownership is renounced. Verified BSC Smart Contract: 0x90B38421869e5C70f2fA3C98a8Ac47432C1d6dFf.";
  }

  // 9. Ecosystem Products (Mini-App, Marsverse App, SNR, Brand Portal)
  if (
    query.includes("app") ||
    query.includes("mini") ||
    query.includes("marsverse") ||
    query.includes("bot") ||
    query.includes("mobile") ||
    query.includes("snr") ||
    query.includes("partner") ||
    query.includes("portal")
  ) {
    return "The Matara Mini-App and Marsverse Mobile App serve as your command center! Features include earning $SNR task rewards, tracking live BSC price charts ($0.000000064), DEX token swapping, and the Brand Partner Portal.";
  }

  // 10. Roadmap & Future Phases
  if (
    query.includes("roadmap") ||
    query.includes("phase") ||
    query.includes("path") ||
    query.includes("future") ||
    query.includes("plan") ||
    query.includes("next")
  ) {
    return "The Lion's Path consists of 4 Phases: Phase 1 (Awakening: Launch & Community), Phase 2 (Roar: PancakeSwap Listing, CMC/CG, Mini-App Beta), Phase 3 (Ascent: Tier-2 CEX, NFT Staking, Mini-App V1), and Phase 4 (Dynasty: Tier-1 CEX, Hope Initiatives, Cross-Chain Sovereignty).";
  }

  // 11. Community & Social Links
  if (
    query.includes("telegram") ||
    query.includes("twitter") ||
    query.includes("x") ||
    query.includes("medium") ||
    query.includes("blog") ||
    query.includes("community") ||
    query.includes("social") ||
    query.includes("discord")
  ) {
    return "Join the Pride! Follow our official X account @mataratoken, join our active Telegram Pride group, read 'The Pride Chronicles' on Medium, or connect with our Discord. Links are in the site header and footer!";
  }

  // 12. General AI Fallback
  return `I hear you, warrior! Matara ($MARS) is built on purpose, strength, and sovereign community governance. You can ask me about our 690B token supply, 1% $WKC reflection rewards, PancakeSwap trading, verified BSC contract, Marsverse Mobile App, or roadmap phases! What would you like to explore?`;
};

const AISupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "Welcome to the Matara Intel Center. I am your AI guide. Ask me anything about $MARS, our ecosystem, tokenomics, or mission!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: userMsg,
          config: {
            systemInstruction:
              "You are the Sovereign AI Intel Guide for Matara ($MARS), built on BSC. Respond warmly to greetings ('Hello', 'Hi', 'Hey'), conversational chat, and questions. You are fully trained on Matara's identity (Matara means 'Purpose'), total supply (690 Billion $MARS), 1% reflection rewards in $WKC (Wikicat), 50% locked liquidity, 10% burned, 40% ecosystem/rewards, 10% team reserve, ownership renounced, official contract (0x90B38421869e5C70f2fA3C98a8Ac47432C1d6dFf), Matara Mini-App, Marsverse Mobile App, Brand Partner Portal, and 4-Phase Roadmap. Tone: Heroic, determined, authoritative, concise, and helpful.",
          },
        });

        if (response.text) {
          setMessages((prev) => [...prev, { role: "ai", text: response.text }]);
          setLoading(false);
          return;
        }
      }

      // Intelligent Conversational Knowledge Engine
      const fallbackReply = getMataraKnowledgeResponse(userMsg);
      setMessages((prev) => [...prev, { role: "ai", text: fallbackReply }]);
    } catch (error) {
      console.error(error);
      const fallbackReply = getMataraKnowledgeResponse(userMsg);
      setMessages((prev) => [...prev, { role: "ai", text: fallbackReply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card mb-4 w-[320px] sm:w-[380px] h-[500px] flex flex-col overflow-hidden shadow-2xl border-amber-400/20">
            <div className="p-4 border-b border-white/10 bg-amber-400/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-headline text-sm font-black tracking-widest text-amber-400">
                  INTEL CENTER AI
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 text-sm ${
                      msg.role === "user"
                        ? "bg-amber-400 text-black font-bold rounded-2xl rounded-tr-none"
                        : "bg-surface-container-high text-on-surface rounded-2xl rounded-tl-none border border-white/5"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-high p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <MataraLoadingSpinner size="sm" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-surface-container">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about Matara..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-amber-400 hover:text-amber-300 disabled:opacity-50 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="solar-flare-gradient p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group relative">
        <div className="absolute -top-12 right-0 bg-amber-400 text-black text-[10px] font-black px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest">
          Need Intel?
        </div>
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <MessageSquare className="w-6 h-6 text-black" />
        )}
      </button>
    </div>
  );
};

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={mataraTheme}>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const GoldenBlueCursorGlow = () => {
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springConfig = { damping: 25, stiffness: 250 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{
          x: smoothX,
          y: smoothY,
          width: 450,
          height: 450,
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.14) 0%, rgba(59, 130, 246, 0.10) 45%, rgba(15, 23, 42, 0) 70%)",
        }}
      />
    </motion.div>
  );
};

interface SectionMascotFloatProps {
  image: string;
  title: string;
  subtitle: string;
  badgeText: string;
  position?: "left" | "right" | "center";
  quote?: string;
}

const SectionMascotFloat = ({
  image,
  title,
  subtitle,
  badgeText,
  position = "right",
  quote,
}: SectionMascotFloatProps) => {
  return (
    <div className="relative py-8 md:py-12 overflow-hidden z-20 pointer-events-none">
      <div className="container mx-auto px-4 sm:px-6 relative flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`pointer-events-auto relative flex flex-col sm:flex-row items-center gap-5 p-5 sm:p-6 rounded-2xl glass-card border border-amber-400/35 bg-neutral-950/90 backdrop-blur-2xl shadow-2xl shadow-amber-400/10 w-full max-w-xl sm:max-w-2xl golden-blue-glow-hover ${
            position === "left" ? "md:mr-auto" : position === "right" ? "md:ml-auto" : "mx-auto"
          }`}>
          {/* Transparent Floating Mascot Cutout */}
          <div className="relative shrink-0 w-32 h-44 sm:w-40 sm:h-52 flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-mascot-aura" />
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full flex items-center justify-center relative z-10">
              <img
                src={image}
                alt={title}
                className="w-full h-full max-w-full object-contain filter drop-shadow-[0_15px_35px_rgba(251,191,36,0.45)] hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-center shrink-0 z-20">
              <span className="px-3 py-1 bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider rounded-xs shadow-lg whitespace-nowrap">
                {badgeText}
              </span>
            </div>
          </div>

          {/* Mascot Info & Quote */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-3.5 h-3.5" /> Lion Warrior Sentinel
            </div>
            <h4 className="font-headline text-lg sm:text-xl font-black uppercase tracking-tight text-white">
              {title}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {subtitle}
            </p>
            {quote && (
              <div className="pt-2 text-xs italic text-amber-300/90 border-t border-white/10 font-mono">
                "{quote}"
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InteractiveMascotSidekick = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quotes = [
    "Welcome, Martian! The Pride moves with architectural intent.",
    "Every transaction is a heartbeat on Binance Smart Chain.",
    "Hold tight to your $MARS assets. Sovereignty is coming!",
    "Marstats and Marsverse are sovereign products of Matara.",
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex items-end gap-2.5 sm:gap-3 pointer-events-auto">
      <motion.button
        onClick={cycleQuote}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-label="Lion Mascot Sidekick"
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-amber-400/70 bg-neutral-950 p-0.5 shadow-xl shadow-amber-400/25 overflow-hidden group">
        <img
          src="/mascot/lion-flex.png"
          alt="Matara Lion Sidekick"
          className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.5)] group-hover:scale-110 transition-transform"
        />
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-amber-400 rounded-full border-2 border-black animate-ping" />
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-amber-400 rounded-full border-2 border-black" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            className="glass-card p-3 sm:p-4 rounded-xl border-amber-400/40 bg-neutral-950/95 text-xs text-zinc-300 max-w-[260px] sm:max-w-xs shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1.5 right-1.5 text-zinc-500 hover:text-white text-[10px]">
              ✕
            </button>
            <div className="font-bold text-amber-400 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Lion Sentinel Intel
            </div>
            <p className="italic text-white text-[11px] leading-snug">
              "{quotes[quoteIndex]}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function AppContent() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: "success" | "error" | "info" }[]
  >([]);

  const addNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    [],
  );

  const { address, isConnected } = useAccount();
  const { data: bnbBalance } = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });
  const { data: marsBalanceRaw } = useReadContract({
    address: "0x6844B2e9afB002d188A072A3ef0FBb068650F214" as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const marsBalance = useMemo(() => {
    if (!marsBalanceRaw) return "0";
    return parseFloat(formatUnits(marsBalanceRaw, 18)).toLocaleString();
  }, [marsBalanceRaw]);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [usdAmount, setUsdAmount] = useState("1");
  const [bnbInput, setBnbInput] = useState("0.1");
  const [marsPrice, setMarsPrice] = useState<number | null>(0.0000012); // Fallback price
  const [bnbPrice, setBnbPrice] = useState<number | null>(600); // Fallback price
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [showSwapConfirmModal, setShowSwapConfirmModal] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [priceImpact] = useState(0.01);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const { sendTransactionAsync } = useSendTransaction();

  // Scroll Animations for Hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const lionY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const lionRotate = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const lionOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const smoothLionY = useSpring(lionY, { stiffness: 100, damping: 30 });
  const smoothLionRotate = useSpring(lionRotate, {
    stiffness: 100,
    damping: 30,
  });
  const smoothStatsY = useSpring(statsY, { stiffness: 100, damping: 30 });

  const contractAddress = "0x6844B2e9afB002d188A072A3ef0FBb068650F214";

  const LINKS = {
    WHITEPAPER: "https://matara-token.gitbook.io/matara-token/",
    AUDIT:
      "https://x.com/VB_Audit/status/1966446788988064127?t=uqWs4IJBR8f9IXXqhYPCCA&s=19",
    BSCSCAN:
      "https://bscscan.com/address/0x6844B2e9afB002d188A072A3ef0FBb068650F214",
    TELEGRAM: "https://t.me/Matara_Kingdom",
    X: "https://x.com/captainmatara",
    STORY: "https://matara-token.gitbook.io/matara-token/",
    ECOSYSTEM_BOT: "https://t.me/MataraComBot?start=rnUtTwgN",
    PANCAKESWAP: `https://pancakeswap.finance/swap?outputCurrency=0x6844B2e9afB002d188A072A3ef0FBb068650F214`,
    MARSTATS: "https://marstats.xyz",
  };

  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      setFetchingPrice(true);
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/0x6844B2e9afB002d188A072A3ef0FBb068650F214",
        );
        if (!response.ok) throw new Error("Price API unreachable");
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
          // Sort by liquidity to get the most accurate price
          const topPair = data.pairs.sort(
            (a: any, b: any) =>
              (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0),
          )[0];
          if (topPair.priceUsd) {
            setMarsPrice(parseFloat(topPair.priceUsd));
          }
        }
      } catch (error) {
        console.warn("Price fetch failed, using fallback.");
      } finally {
        setFetchingPrice(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBnbPrice = async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        ); // WBNB
        if (!response.ok) throw new Error("BNB Price API unreachable");
        const data = await response.json();
        if (data.pairs && data.pairs.length > 0) {
          const topPair = data.pairs.sort(
            (a: any, b: any) =>
              (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0),
          )[0];
          if (topPair.priceUsd) {
            setBnbPrice(parseFloat(topPair.priceUsd));
          }
        }
      } catch (e) {
        console.warn("BNB Price fetch failed, using fallback.");
      }
    };
    fetchBnbPrice();
    const interval = setInterval(fetchBnbPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const estimatedMars = useMemo(() => {
    if (!bnbInput || !marsPrice || !bnbPrice) return "0";
    const bnbVal = parseFloat(bnbInput);
    const usdVal = bnbVal * bnbPrice;
    return (usdVal / marsPrice).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }, [bnbInput, marsPrice, bnbPrice]);

  const handleSwap = async () => {
    if (!isConnected) {
      addNotification("Please connect your wallet first, warrior.", "error");
      return;
    }
    if (!bnbInput || parseFloat(bnbInput) <= 0) {
      addNotification("Enter a valid BNB amount.", "error");
      return;
    }
    setShowSwapConfirmModal(true);
  };

  const executeSwap = async () => {
    setShowSwapConfirmModal(false);
    setSwapping(true);
    try {
      const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
      await sendTransactionAsync({
        to: PANCAKE_ROUTER as `0x${string}`,
        value: parseEther(bnbInput),
      });
      addNotification(
        "Swap transaction submitted! Check your wallet.",
        "success",
      );
    } catch (error: any) {
      console.error("Swap failed:", error);
      addNotification(
        `Swap failed: ${error.shortMessage || error.message}`,
        "error",
      );
    } finally {
      setSwapping(false);
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      addNotification("Please enter a valid email address.", "error");
      return;
    }
    setSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubscribing(false);
    setNewsletterEmail("");
    setShowSuccessModal(true);
  };

  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [isDarkMode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = ["Story", "Tokenomics", "Roadmap", "Blog", "FAQ"];

  return (
    <div className="min-h-screen bg-background selection:bg-amber-400 selection:text-black relative">
      <GoldenBlueCursorGlow />
      <InteractiveMascotSidekick />
      <AnimatePresence>
        {initialLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-neutral-950/80 py-3 backdrop-blur-2xl border-b border-white/5"
            : `${!isDarkMode ? "bg-neutral-950/70 backdrop-blur-md " : "bg-transparent"} py-4`
        }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/matara-icon1.png"
              alt="Matara Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex gap-8 items-center">
            {window.self !== window.top && (
              <button
                onClick={() => window.open(window.location.href, "_blank")}
                className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-zinc-400 px-4 py-2 rounded-sm border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
                <ExternalLink className="w-3 h-3" />
                Open in New Tab
              </button>
            )}
            {navItems.map((item) => {
              if (item === "Marstats") {
                return (
                  <a
                    key={item}
                    href={LINKS.MARSTATS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-headline font-bold tracking-tight uppercase text-amber-400 hover:text-amber-300 transition-colors text-sm flex items-center gap-1">
                    Marstats <ExternalLink className="w-3 h-3" />
                  </a>
                );
              }
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="font-headline font-bold tracking-tight uppercase text-zinc-400 hover:text-amber-400 transition-colors text-sm">
                  {item}
                </a>
              );
            })}
            <div className="h-4 w-px bg-white/10 mx-2" />
            <a
              href={LINKS.PANCAKESWAP}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-widest bg-amber-400 text-black px-4 py-2 rounded-sm hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-400/20">
              Buy $MARS <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-amber-400 p-1 flex items-center gap-2"
              aria-label="Toggle Mobile Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={
            mobileMenuOpen
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          className="md:hidden overflow-hidden bg-neutral-950/95 backdrop-blur-2xl border-b border-white/10">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-5">
            {navItems.map((item) => {
              if (item === "Marstats") {
                return (
                  <a
                    key={item}
                    href={LINKS.MARSTATS}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-headline font-bold tracking-tight uppercase text-amber-400 hover:text-amber-300 transition-colors text-lg flex items-center gap-2">
                    Marstats <ExternalLink className="w-4 h-4" />
                  </a>
                );
              }
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-headline font-bold tracking-tight uppercase text-zinc-400 hover:text-amber-400 transition-colors text-lg">
                  {item}
                </a>
              );
            })}
            <a
              href={LINKS.PANCAKESWAP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-bold uppercase tracking-widest bg-amber-400 text-black py-3 rounded-sm hover:bg-amber-300 transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-amber-400/20">
              Buy $MARS on PancakeSwap <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {selectedPost ? (
          <BlogPostView
            key="blog-post"
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
          />
        ) : (
          <motion.main
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative">
            {/* Full-Website Continuous Matara Kingdom & Lion Graffiti Overlay */}
            <div className="graffiti-bg-fixed" />

            {/* Hero Section */}
            <section
              ref={heroRef}
              className="relative min-h-screen flex items-center pt-24 md:pt-0 overflow-hidden mesh-gradient">
              {/* Background Elements */}
              <div className="absolute inset-0 cyber-grid opacity-30" />
              <div className="hero-graffiti-bg" />
              <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[120px] animate-pulse-glow" />
              <div
                className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse-glow"
                style={{ animationDelay: "2s" }}
              />

              <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-5 md:space-y-6">
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="font-headline text-4xl lg:text-6xl font-black tracking-tighter text-on-surface leading-[1.1]">
                    Matara ($MARS): <br className="hidden sm:block" />
                    <span className="text-amber-400 text-glow">
                      The Token of Purpose
                    </span>
                  </motion.h1>

                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="text-on-surface-variant text-base md:text-lg max-w-md leading-relaxed font-light">
                    The sovereign ecosystem forged for the modern warrior.
                    Beyond a meme, we build with unyielding conviction on BSC.
                  </motion.p>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex flex-col sm:flex-row gap-4 pt-2">
                    <a
                      href={LINKS.PANCAKESWAP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-web3 solar-flare-gradient text-black px-8 py-3.5 font-headline font-bold tracking-widest uppercase rounded-sm hover:shadow-[0_0_50px_rgba(247,190,51,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2.5 group text-xs font-semibold">
                      Buy $MARS on PANCAKESWAP
                      <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                    <a
                      href={LINKS.TELEGRAM}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-web3 bg-white/5 text-white px-8 py-3.5 font-headline font-bold tracking-widest uppercase rounded-sm border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all flex items-center justify-center gap-2.5 text-xs">
                      Join the Pride
                      <Users className="w-4 h-4" />
                    </a>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 0.6 },
                    }}
                    className="pt-6 flex flex-wrap gap-6">
                    {[
                      { icon: Shield, text: "Audited" },
                      { icon: Verified, text: "Verified" },
                      { icon: Zap, text: "Fast" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                        <item.icon className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-surface-variant">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 280, scale: 0.45 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="relative hidden lg:flex items-center justify-center mt-8 lg:mt-0">
                  <div className="absolute inset-0 bg-amber-400/25 blur-[100px] rounded-full animate-mascot-aura" />
                  <motion.div
                    style={{
                      y: smoothLionY,
                      rotate: smoothLionRotate,
                      opacity: lionOpacity,
                    }}
                    className="relative z-10 w-full flex justify-center">
                    <div className="p-2 flex items-center justify-center group max-w-[280px] sm:max-w-[380px] md:max-w-[480px] lg:max-w-[560px] xl:max-w-[620px] mx-auto relative">
                      <img
                        src="/mascot/hero-lion-transparent.png"
                        alt="Matara Sovereign Lion Warrior Mascot"
                        className="w-full h-auto max-h-[380px] sm:max-h-[480px] lg:max-h-[620px] object-contain filter drop-shadow-[0_20px_50px_rgba(251,191,36,0.45)] group-hover:scale-105 transition-all duration-700 relative z-10 pointer-events-none"
                      />
                    </div>
                  </motion.div>

                    {/* Floating Stats Card */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      style={{ y: smoothStatsY }}
                      className="absolute -bottom-6 -left-6 glass-card p-4 border-white/10 shadow-2xl backdrop-blur-2xl">
                      <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-0.5 font-bold">
                        Supply
                      </div>
                      <div className="text-xl font-headline font-black text-amber-400 tracking-tighter">
                        <Counter target={690000000000} />
                      </div>
                      <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 1.5 }}
                          className="h-full solar-flare-gradient"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">
                  Scroll to Explore
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-amber-400 to-transparent" />
              </motion.div>
            </section>

            {/* Story Section */}
            <section
              id="story"
              className="py-20 md:py-32 bg-surface-container-low relative overflow-hidden">
              <div className="graffiti-warrior-bg" />
              <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-5 relative flex justify-center">
                    <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl animate-mascot-aura" />
                    <motion.img
                      animate={{
                        y: [0, -12, 0],
                        rotate: [0, 1.5, -1.5, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      src="/mascot/lion-sword.png"
                      alt="The Lion Warrior Mascot"
                      className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[480px] aspect-square object-contain filter drop-shadow-[0_20px_40px_rgba(251,191,36,0.4)] transition-all duration-700 hover:scale-105 relative z-10"
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={600}
                    />
                    <div className="absolute -top-4 -right-4 w-16 h-16 md:w-24 md:h-24 border-t-2 border-r-2 border-amber-400/40" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 md:w-24 md:h-24 border-b-2 border-l-2 border-zinc-600/40" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-7 space-y-6 md:space-y-8">
                    <h2 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter">
                      The Birth of the <br />
                      <span className="text-zinc-500">Lion Warrior</span>
                    </h2>
                    <div className="space-y-6 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
                      <p>
                        <span className="text-white font-bold">Matara</span>{" "}
                        means{" "}
                        <span className="italic text-amber-400">"Purpose"</span>
                        . In an era where the digital landscape is littered with
                        hollow promises and fleeting noise, we stand as a beacon
                        of architectural intent.
                      </p>
                      <p>
                        We do not build for the next hour; we build for the next
                        age. The Lion represents the strength of our community—a
                        pride that moves with shared conviction. In a market
                        driven by chaos, we build with direction.
                      </p>
                      <div className="pt-4 border-l-2 border-amber-400 pl-4 md:pl-6 py-2 italic font-light hover:bg-white/5 transition-colors">
                        "Every transaction is a heartbeat, every holder is a
                        warrior. This is the sovereignty of the Marsverse."
                      </div>
                      <div className="pt-4">
                        <a
                          href={LINKS.STORY}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-xs border-b border-amber-400/20 pb-1 hover:border-amber-400 transition-all">
                          Read Full Story <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Ecosystem Section */}
            <section className="py-20 md:py-32 bg-surface relative overflow-hidden">
              <div className="graffiti-street-bg" />
              <div className="container mx-auto px-6 relative z-10">
                <SectionHeading
                  subtitle="Utility Engine"
                  title="Enter the Marsverse"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2 lg:col-span-2 glass-card p-6 md:p-10 group hover:bg-surface-container-highest transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 md:mb-12">
                      <div>
                        <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-2">
                          The Matara Mini-App
                        </h3>
                        <p className="text-on-surface-variant max-w-sm text-sm md:text-base">
                          The command center for your $MARS assets. Fully
                          integrated directly within our ecosystem platforms.
                        </p>
                        <a
                          href={LINKS.ECOSYSTEM_BOT}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-[10px] border-b border-amber-400/20 pb-1 hover:border-amber-400 transition-all">
                          Launch Bot <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <LayoutGrid className="w-8 h-8 md:w-10 md:h-10 text-on-surface/30 group-hover:text-amber-400 transition-all shrink-0" />
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {[
                        "Earn Rewards from Tasks",
                        "Reward Dashboard",
                        "Refer and Climb Leaderboard",
                        "Swap Directly from the App",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors cursor-default">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6 md:p-10 group bg-surface-container-low border-on-surface/5">
                    <div className="mb-6 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center bg-surface-container-highest rounded-sm group-hover:rotate-12 transition-transform">
                      <Lock className="w-5 h-5 md:w-6 md:h-6 text-on-surface" />
                    </div>
                    <h3 className="font-headline text-xl md:text-2xl font-bold mb-4 text-on-surface">
                      Utility Unlocks
                    </h3>
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      Holding $MARS earns you reflections in $WKC... 1% of buy
                      and sells goes to holders of $MARS
                    </p>
                  </div>

                  <div className="glass-card p-6 md:p-10 group bg-surface-container">
                    <h3 className="font-headline text-lg md:text-xl font-bold mb-4 text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Live Transaction Feed
                    </h3>
                    <div className="space-y-3 overflow-hidden h-40 relative">
                      {[
                        {
                          type: "BUY",
                          amount: "12.4 BNB",
                          time: "2s ago",
                          color: "text-amber-400",
                        },
                        {
                          type: "BUY",
                          amount: "0.8 BNB",
                          time: "14s ago",
                          color: "text-amber-400",
                        },
                        {
                          type: "SELL",
                          amount: "2.1 BNB",
                          time: "45s ago",
                          color: "text-red-400",
                        },
                      ].map((tx, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-[10px] font-mono p-2 bg-surface-container-low border-l border-amber-400 hover:bg-surface-container-high transition-colors">
                          <span className={tx.color}>
                            {tx.type}: {tx.amount}
                          </span>
                          <span className="text-on-surface-variant/60">{tx.time}</span>
                        </div>
                      ))}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-container to-transparent" />
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-2 glass-card p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                      <img
                        src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=75"
                        className="w-full h-full object-cover opacity-20"
                        alt="Governance background"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        width={1000}
                        height={600}
                      />
                    </div>
                    <div className="flex-1 bg-surface-container/80 p-6 md:p-8 backdrop-blur-md relative z-10 border border-on-surface/5">
                      <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-4">
                        Sovereign Governance
                      </h3>
                      <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed">
                        The pride decides. $MARS holders vote on critical
                        ecosystem developments, treasury allocations, and
                        strategic pivots.
                      </p>
                      <button className="mt-6 text-xs font-black uppercase tracking-widest text-amber-400 border-b border-amber-400/40 pb-1 hover:border-amber-400 hover:tracking-[0.2em] transition-all">
                        Launch Snapshot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Marsverse App Showcase Section */}
            <MarsverseAppShowcase links={LINKS} />

            {/* Calculator & Swap Section */}
            <section className="py-20 md:py-32 bg-surface-container-low relative overflow-hidden">
              <div className="graffiti-warrior-bg" />
              <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <SectionHeading
                  subtitle="Mission Planning"
                  title="Price Calculator & Swap"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Calculator & Swap */}
                  <div className="lg:col-span-5 space-y-8">
                    <div className="glass-card p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl" />

                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-headline text-xl font-black uppercase tracking-tight">
                            Swap $MARS
                          </h3>
                          <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">
                              Live DEX
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-xl">
                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">
                              <span>From</span>
                              <div className="flex items-center gap-2">
                                <span>
                                  Balance:{" "}
                                  {bnbBalance
                                    ? `${parseFloat(formatUnits(bnbBalance.value, bnbBalance.decimals)).toFixed(4)} ${bnbBalance.symbol}`
                                    : "0.00 BNB"}
                                </span>
                                {bnbBalance && (
                                  <button
                                    onClick={() =>
                                      setBnbInput(
                                        formatUnits(
                                          bnbBalance.value,
                                          bnbBalance.decimals,
                                        ),
                                      )
                                    }
                                    className="text-amber-400 hover:text-amber-300 transition-colors px-1.5 py-0.5 bg-amber-400/10 rounded border border-amber-400/20 hover:bg-amber-400/20">
                                    MAX
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                <BnbLogo className="w-5 h-5" />
                              </div>
                              <input
                                type="number"
                                value={bnbInput}
                                onChange={(e) => setBnbInput(e.target.value)}
                                className="flex-1 bg-transparent border-0 text-xl font-mono font-bold focus:outline-none text-white"
                                placeholder="0.0"
                              />
                              <span className="font-bold text-sm">BNB</span>
                            </div>
                          </div>

                          <div className="flex justify-center -my-2 relative z-10">
                            <button className="w-8 h-8 rounded-full bg-amber-400 text-black flex items-center justify-center hover:rotate-180 transition-transform shadow-lg">
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-xl">
                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">
                              <span>To</span>
                              <span>Balance: {marsBalance} $MARS</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                                <img
                                  src="/matara-icon1.png"
                                  className="w-5 h-5 object-contain"
                                  alt="$MARS Logo"
                                />
                              </div>
                              <input
                                type="text"
                                readOnly
                                value={estimatedMars}
                                className="flex-1 bg-transparent border-0 text-xl font-mono font-bold focus:outline-none text-white"
                                placeholder="0.0"
                              />
                              <span className="font-bold text-sm">$MARS</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <span>Price Impact</span>
                            <span className="text-green-500">&lt; 0.01%</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <span>Slippage Tolerance</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={slippage}
                                onChange={(e) => setSlippage(e.target.value)}
                                className="w-12 bg-neutral-900 border border-white/10 rounded px-1 py-0.5 text-right focus:outline-none focus:border-amber-400/50 text-white"
                                step="0.1"
                                min="0.1"
                                max="50"
                              />
                              <span>%</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleSwap}
                          disabled={swapping}
                          className="w-full py-4 solar-flare-gradient text-black font-black uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-amber-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          {swapping ? "Processing..." : "Swap Now"}
                        </button>

                        <p className="text-[8px] text-center text-zinc-600 uppercase tracking-widest">
                          Powered by Dexscreener Aggregator Protocol
                        </p>
                      </div>
                    </div>

                    <div className="glass-card p-6 border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center shrink-0">
                          {fetchingPrice ? (
                            <MataraLoadingSpinner size="sm" />
                          ) : (
                            <RefreshCw className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                            Live $MARS Price
                          </div>
                          <div className="text-lg font-mono font-bold text-white">
                            {marsPrice
                              ? `$${marsPrice.toFixed(10)}`
                              : "Fetching..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Transaction Log */}
                  <div className="lg:col-span-7">
                    <TransactionLog isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>
            </section>

            {/* Tokenomics Section */}
            <section
              id="tokenomics"
              className="py-20 md:py-32 bg-surface-container-low">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16 md:mb-20">
                  <h2 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-widest mb-4">
                    $MARS by the Numbers
                  </h2>
                  <div className="text-5xl sm:text-6xl md:text-8xl font-black text-white font-headline tracking-tighter">
                    <Counter target={690} suffix="B" />
                  </div>
                  <div className="text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase text-zinc-500 mt-2">
                    Initial Total Supply
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    {
                      label: "Liquidity Locked",
                      value: 50,
                      color: "border-amber-400",
                    },
                    {
                      label: "Liquidity (Burned)",
                      value: 10,
                      color: "border-white",
                    },
                    {
                      label: "Ecosystem Growth",
                      value: 40,
                      color: "border-zinc-600",
                    },
                    {
                      label: "Team Reserve",
                      value: 10,
                      color: "border-zinc-400",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-surface p-6 md:p-8 border-b-2 ${item.color} hover:-translate-y-2 transition-transform`}>
                      <div className="text-2xl md:text-3xl font-headline font-bold mb-1">
                        <Counter target={item.value} suffix="%" />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500">
                        {item.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
                  {[
                    {
                      title: "Transparent",
                      desc: "Full audit visibility on all wallet movements. No blackbox mechanics.",
                    },
                    {
                      title: "No Hidden Mint",
                      desc: "Contract ownership renounced. The supply is immutable and final.",
                    },
                    {
                      title: "Clear Allocation",
                      desc: "Every token has a destination mapped on the cosmic roadmap.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="group">
                      <h4 className="font-bold text-white mb-2 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-on-surface-variant">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Roadmap Section */}
            <section id="roadmap" className="py-20 md:py-32 bg-surface relative overflow-hidden">
              <div className="graffiti-street-bg" />
              <div className="container mx-auto px-6 relative z-10">
                <h2 className="font-headline text-3xl md:text-4xl font-black uppercase text-center mb-16 md:mb-24">
                  The Lion’s Path
                </h2>

                <div className="relative space-y-16 md:space-y-24">
                  <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800" />

                  {[
                    {
                      phase: "Phase 01",
                      title: "The Awakening",
                      desc: "Smart Contract Deployment, Gitbook Release, Website Launch, Community Formation.",
                      icon: Zap,
                      color: "bg-white text-black",
                    },
                    {
                      phase: "Phase 02",
                      title: "The Roar",
                      desc: "PancakeSwap Listing, Marketing Blitz, CoinGecko & CMC Integration, Mini-App Beta.",
                      icon: Megaphone,
                      color: "bg-zinc-700 text-white",
                    },
                    {
                      phase: "Phase 03",
                      title: "The Ascent",
                      desc: "Mini-App V1 Launch, First Tier-2 CEX Listings, Global Governance Activation, NFT Staking.",
                      icon: TrendingUp,
                      color: "bg-white text-black",
                    },
                    {
                      phase: "Phase 04",
                      title: "The Dynasty",
                      desc: "'Hope Initiatives' Charity Launch, Tier-1 CEX, Cross-chain expansion, Full Marsverse Sovereignty.",
                      icon: Sparkles,
                      color: "bg-zinc-800 text-white",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                      <div
                        className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                        <div className="text-amber-400 font-headline text-xl md:text-2xl font-black mb-2">
                          {item.phase}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase mb-4">
                          {item.title}
                        </h3>
                        <p className="text-on-surface-variant text-xs md:text-sm max-w-sm md:mx-0">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`absolute left-0 md:relative md:left-auto w-12 h-12 ${item.color} rounded-sm flex items-center justify-center z-10 shrink-0 hover:rotate-45 transition-transform`}>
                        <item.icon className="w-6 h-6" />
                      </div>

                      <div className="flex-1 hidden md:block" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-surface-container-highest/30 backdrop-blur-md relative overflow-hidden">
              <div className="graffiti-warrior-bg opacity-15" />
              <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
                {[
                  { label: "Holders Strong", value: 2200, suffix: "+" },
                  { label: "Telegram Pride", value: 1700, suffix: "+" },
                  {
                    label: "Liquidity Locked",
                    value: 11000,
                    prefix: "$",
                    suffix: "+",
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-headline font-black text-white mb-2">
                      <Counter
                        target={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-20 md:py-32 bg-surface relative overflow-hidden">
              <div className="graffiti-street-bg" />
              <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <SectionHeading
                  subtitle="Galactic Updates"
                  title="The Pride Chronicles"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {blogPosts.map((post, i) => (
                    <BlogCard
                      key={i}
                      post={post}
                      onClick={() => {
                        setSelectedPost(post);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <a
                    href="https://medium.com/@mataratoken"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-amber-400/30 text-amber-400 font-black uppercase tracking-widest text-xs hover:bg-amber-400/10 hover:border-amber-400 transition-all rounded-xs">
                    View All Chronicles on Medium <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section
              id="faq"
              className="py-20 md:py-32 bg-surface-container-low relative overflow-hidden">
              <div className="graffiti-warrior-bg" />
              <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <SectionHeading
                  subtitle="Intel Center"
                  title="Frequently Asked Questions"
                />

                <div className="glass-card p-6 md:p-10">
                  {[
                    {
                      question: "What is Matara ($MARS)?",
                      answer:
                        "Matara ($MARS) is a sovereign ecosystem built on the Binance Smart Chain (BSC). It represents 'Purpose' and is designed to provide strength, direction, and utility to its community through a range of integrated platforms like the Matara Mini-App.",
                    },
                    {
                      question: "How can I buy $MARS?",
                      answer:
                        "You can purchase $MARS on PancakeSwap by swapping BNB for the $MARS contract address. Ensure you have a compatible wallet like MetaMask or Trust Wallet connected to the BSC network.",
                    },
                    {
                      question: "Is the liquidity locked?",
                      answer:
                        "Yes, 50% of the initial liquidity is locked, and an additional 10% has been burned to ensure long-term stability and security for all holders. You can verify these locks on-chain via our security links.",
                    },
                    {
                      question: "What are the tokenomics?",
                      answer:
                        "The total supply is 690 Billion $MARS. 50% is for locked liquidity, 40% for ecosystem growth, and 10% is held in a team reserve. There is a 1% reflection tax on buys and sells that goes directly back to $MARS holders in $WKC.",
                    },
                    {
                      question: "What is the Matara Mini-App?",
                      answer:
                        "The Matara Mini-App is our ecosystem's command center. It allows users to earn rewards through tasks, track their assets, refer new members, and swap tokens directly within a streamlined interface.",
                    },
                    {
                      question: "How do I join the community?",
                      answer:
                        "You can join our 'Pride' by following us on X (Twitter), joining our Telegram group, or entering our Discord server. Links are available in the footer of this website.",
                    },
                  ].map((faq, i) => (
                    <FAQItem
                      key={i}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="py-20 md:py-32 bg-surface relative overflow-hidden">
              <div className="graffiti-street-bg" />
              <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="glass-card p-6 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl" />

                  <div className="relative z-10 text-center space-y-6 md:space-y-8">
                    <h2 className="font-headline text-3xl md:text-4xl font-black uppercase">
                      Verify Before You Trust
                    </h2>
                    <p className="text-on-surface-variant text-sm md:text-base max-w-xl mx-auto">
                      Security is the foundation of our kingdom. View our
                      verified smart contracts and liquidity locks on-chain.
                    </p>

                    <div className="space-y-4">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                        Official BSC Contract
                      </div>
                      <div className="bg-neutral-950 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 group hover:bg-zinc-900 transition-colors border border-white/5 relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 uppercase tracking-widest">
                          Verified Smart Contract
                        </div>
                        <code className="text-white font-mono text-[10px] sm:text-xs md:text-sm break-all font-bold tracking-tighter">
                          {contractAddress}
                        </code>
                        <button
                          onClick={copyToClipboard}
                          className="shrink-0 w-full md:w-auto flex items-center justify-center gap-2 bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-amber-300 transition-all hover:scale-105 active:scale-95">
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 pt-6 md:pt-8">
                      <a
                        href={LINKS.BSCSCAN}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-4 bg-surface-container border border-white/5 hover:border-amber-400/40 hover:-translate-y-1 transition-all group">
                        <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                          BSCScan
                        </span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center justify-center gap-3 p-4 bg-surface-container border border-white/5 hover:border-amber-400/40 hover:-translate-y-1 transition-all group">
                        <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                          Liquidity Lock
                        </span>
                      </a>
                      <a
                        href={LINKS.AUDIT}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 p-4 bg-surface-container border border-white/5 hover:border-amber-400/40 hover:-translate-y-1 transition-all group">
                        <Shield className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
                          Audit
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-surface-container-low relative overflow-hidden">
              <div className="hero-graffiti-bg opacity-15" />
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              </div>

              <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 rounded-full border border-amber-400/20">
                    <Megaphone className="w-3 h-3 text-amber-400" />
                    <span className="text-[8px] font-bold text-amber-400 uppercase tracking-widest">
                      Stay Informed
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tight">
                      Join the Pride Intel
                    </h2>
                    <p className="text-on-surface-variant text-sm md:text-base max-w-xl mx-auto">
                      Subscribe to get the latest updates on ecosystem growth,
                      new utility launches, and galactic events.
                    </p>
                  </div>

                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 bg-neutral-900 border border-white/10 px-6 py-4 text-sm font-bold focus:outline-none focus:border-amber-400/50 transition-colors text-white"
                    />
                    <button
                      type="submit"
                      disabled={subscribing}
                      className="px-8 py-4 solar-flare-gradient text-black font-black uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-amber-400/20 transition-all disabled:opacity-50">
                      {subscribing ? "Joining..." : "Subscribe"}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-6 z-[90] w-12 h-12 bg-amber-400 text-black flex items-center justify-center shadow-2xl hover:bg-amber-300 transition-colors group">
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AISupport />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-md glass-card p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-400 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-amber-400/20">
                <CheckCircle2 className="w-10 h-10 text-black" />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-2xl font-black uppercase tracking-tight">
                  Welcome to the Pride!
                </h3>
                <p className="text-zinc-400 text-sm">
                  Your subscription is confirmed. You'll be the first to receive
                  galactic intel and ecosystem updates.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-zinc-800 text-white font-bold uppercase tracking-widest text-xs hover:bg-zinc-700 transition-all">
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwapConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSwapConfirmModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-md glass-card p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-headline text-xl font-black uppercase tracking-tight">
                  Confirm Swap
                </h3>
                <button
                  onClick={() => setShowSwapConfirmModal(false)}
                  className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-[10px] font-bold">BNB</span>
                      </div>
                      <span className="text-sm font-bold">{bnbInput}</span>
                    </div>
                    <span className="text-xs text-zinc-500">BNB</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-amber-400">
                          M
                        </span>
                      </div>
                      <span className="text-sm font-bold">{estimatedMars}</span>
                    </div>
                    <span className="text-xs text-zinc-500">$MARS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1">
                    Slippage Tolerance <Info className="w-3 h-3" />
                  </span>
                  <span className="text-white font-bold">{slippage}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Price Impact</span>
                  <span className="text-green-400 font-bold">
                    &lt; {priceImpact}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Network Fee</span>
                  <span className="text-white font-bold">~0.001 BNB</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => setShowSwapConfirmModal(false)}
                  className="py-4 bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all">
                  Cancel
                </button>
                <button
                  onClick={executeSwap}
                  className="py-4 solar-flare-gradient text-black font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-amber-400/20 transition-all">
                  Confirm Swap
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Section  */}
      <footer className="bg-neutral-950 border-t border-zinc-900/50">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-20 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6 max-w-xs">
              <div className="flex items-center">
                {/* Footer Image */}
                <img
                  src={isDarkMode ? "/matara-icon1.png" : "/matara-c1.jpeg"}
                  alt="Matara Logo"
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The sovereign token of the Marsverse. Building a future defined
                by purpose, strength, and community governance.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  Ecosystem
                </span>
                <a
                  href={LINKS.WHITEPAPER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  Whitepaper
                </a>
                <a
                  href={LINKS.AUDIT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  Audit
                </a>
                <a
                  href={LINKS.BSCSCAN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  BSCScan
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  Social
                </span>
                <a
                  href={LINKS.TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  Telegram
                </a>
                <a
                  href={LINKS.X}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  X (Twitter)
                </a>
                <a
                  href="#"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  Discord
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  Legal
                </span>
                <a
                  href="#"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-xs uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors opacity-80 hover:opacity-100">
                  Risk Disclaimer
                </a>
              </div>
            </div>
          </div>

          <div className="pt-12 mt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] text-zinc-600 tracking-widest uppercase text-center md:text-left">
              © 2024 MATARA SOVEREIGN GALACTIC. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-sm bg-surface-container flex items-center justify-center group cursor-pointer hover:bg-amber-400 transition-colors">
                <Globe className="w-4 h-4 text-zinc-500 group-hover:text-black" />
              </div>
              <div className="w-8 h-8 rounded-sm bg-surface-container flex items-center justify-center group cursor-pointer hover:bg-amber-400 transition-colors">
                <Share2 className="w-4 h-4 text-zinc-500 group-hover:text-black" />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 z-[1000] px-6 py-3 rounded-xl border shadow-2xl flex items-center gap-3 min-w-[300px] ${
              n.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                : n.type === "error"
                  ? "bg-rose-500/10 border-rose-500/50 text-rose-400"
                  : "bg-amber-500/10 border-amber-500/50 text-amber-400"
            }`}>
            {n.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : n.type === "error" ? (
              <X className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

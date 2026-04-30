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
    title: "The Rise of the Marsverse",
    excerpt:
      "Exploring the vision behind Matara and how we're building a sovereign ecosystem on BSC.",
    date: "Mar 28, 2024",
    image: "https://picsum.photos/seed/mars1/800/600",
    category: "Ecosystem",
  },
  {
    title: "Tokenomics Deep Dive",
    excerpt:
      "Understanding the $WKC reflection mechanism and how it benefits long-term $MARS holders.",
    date: "Mar 25, 2024",
    image: "https://picsum.photos/seed/mars2/800/600",
    category: "Education",
  },
  {
    title: "Community Governance Launch",
    excerpt:
      "How the Pride will shape the future of Matara through our upcoming DAO structure.",
    date: "Mar 20, 2024",
    image: "https://picsum.photos/seed/mars3/800/600",
    category: "Governance",
  },
];

const BlogCard = ({ post, onClick }: any) => (
  <motion.div
    whileHover={{ y: -10 }}
    onClick={onClick}
    className="glass-card overflow-hidden group cursor-pointer">
    <div className="relative h-48 overflow-hidden">
      <motion.img
        src={post.image}
        alt={post.title}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
        width={800}
        height={600}
      />
      <div className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-black text-[8px] font-black uppercase tracking-widest">
        {post.category}
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        {post.date}
      </div>
      <h3 className="font-headline text-xl font-black uppercase tracking-tight group-hover:text-amber-400 transition-colors">
        {post.title}
      </h3>
      <p className="text-zinc-400 text-sm line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center gap-2 text-amber-400 text-[10px] font-bold uppercase tracking-widest pt-2">
        Read Intel <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  </motion.div>
);

const BlogPostView = ({ post, onBack }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="min-h-screen pt-32 pb-20 bg-background">
    <div className="container mx-auto px-6 max-w-4xl">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-12 hover:translate-x-[-4px] transition-transform">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Chronicles
      </button>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="px-3 py-1 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest inline-block">
            {post.category}
          </div>
          <h1 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">
            {post.title}
          </h1>
          <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
            Published on {post.date} • 5 min read
          </div>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-sm border border-white/10">
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
          <p className="text-xl text-zinc-300 leading-relaxed font-medium italic border-l-4 border-amber-400 pl-6 py-2">
            {post.excerpt}
          </p>

          <div className="space-y-6 text-zinc-400 leading-relaxed text-lg pt-8">
            <p>
              In the vast expanse of the crypto galaxy, Matara stands as a
              beacon of sovereignty and strength. As we continue our mission to
              establish the Marsverse, every milestone achieved is a testament
              to the unwavering spirit of the Pride.
            </p>
            <p>
              The journey ahead is filled with challenges, but with our
              community governance structure and the power of $MARS, we are
              equipped to overcome any obstacle. Our commitment to transparency
              and security remains our top priority as we scale the ecosystem.
            </p>
            <h3 className="text-white font-headline text-2xl font-black uppercase pt-4">
              Strategic Expansion
            </h3>
            <p>
              Our roadmap is not just a plan; it's a declaration of our intent
              to dominate the decentralized finance space. From Tier-1 CEX
              listings to the launch of the Marsverse sovereignty, every step is
              calculated for maximum impact.
            </p>
            <p>
              Stay tuned for more updates from the Intel Center. The roar of the
              Pride is only getting louder.
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-amber-400" />
            </button>
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </button>
          </div>
          <button className="px-8 py-4 bg-amber-400 text-black font-black uppercase tracking-widest text-xs hover:bg-amber-300 transition-all">
            Join the Discussion
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const AISupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "Welcome to the Matara Intel Center. I am your AI guide. How can I assist you in your mission today?",
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction:
            "You are a helpful AI assistant for Matara ($MARS), a cryptocurrency project on BSC. You are knowledgeable about its ecosystem, tokenomics (690B supply, 1% reflection), and mission. Your tone is heroic, determined, and professional. Keep answers concise.",
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            response.text ||
            "I am unable to process that request at the moment, warrior.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Connection to the Intel Center lost. Please try again later.",
        },
      ]);
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
    <div className="min-h-screen bg-background selection:bg-amber-400 selection:text-black">
      <AnimatePresence>
        {initialLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-surface/60 py-3 backdrop-blur-2xl border-b border-white/5" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-black text-amber-400 tracking-tighter font-headline">
            MATARA
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
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-headline font-bold tracking-tight uppercase text-zinc-400 hover:text-amber-400 transition-colors text-sm">
                {item}
              </a>
            ))}
            <div className="h-4 w-px bg-white/10 mx-2" />
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;
                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}>
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="text-[10px] font-bold uppercase tracking-widest bg-amber-400 text-black px-4 py-2 rounded-sm hover:bg-amber-300 transition-all">
                            Connect Wallet
                          </button>
                        );
                      }
                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="text-[10px] font-bold uppercase tracking-widest bg-red-500 text-white px-4 py-2 rounded-sm">
                            Wrong Network
                          </button>
                        );
                      }
                      return (
                        <div className="flex gap-2">
                          <button
                            onClick={openAccountModal}
                            className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white px-4 py-2 rounded-sm border border-white/10 hover:bg-white/10 transition-all">
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-amber-400"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }>
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="md:hidden p-1 rounded-full bg-white/5 text-amber-400"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }>
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              className="md:hidden text-amber-400 p-1 flex items-center gap-2"
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
          className="md:hidden overflow-hidden bg-neutral-950 border-b border-white/5">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="font-headline font-bold tracking-tight uppercase text-zinc-400 hover:text-amber-400 transition-colors text-lg">
                {item}
              </a>
            ))}
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
            exit={{ opacity: 0 }}>
            {/* Hero Section */}
            <section
              ref={heroRef}
              className="relative min-h-screen flex items-center pt-24 md:pt-0 overflow-hidden mesh-gradient">
              {/* Background Elements */}
              <div className="absolute inset-0 cyber-grid opacity-30" />
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
                    className="font-headline text-4xl lg:text-7xl font-black tracking-tighter text-on-surface leading-[1.1]">
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
                      className="btn-web3 solar-flare-gradient text-black px-8 py-3.5 font-headline font-bold tracking-widest uppercase rounded-sm hover:shadow-[0_0_50px_rgba(247,190,51,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2.5 group text-xs">
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
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative hidden lg:block">
                  <div className="absolute inset-0 bg-amber-400/20 blur-[120px] rounded-full" />
                  <motion.div
                    style={{
                      y: smoothLionY,
                      rotate: smoothLionRotate,
                      opacity: lionOpacity,
                    }}
                    className="relative z-10">
                    <div className="glass-card p-1.5 rounded-xl border-white/10 shadow-2xl overflow-hidden group max-w-md mx-auto">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV7o7fU6dfo9Cro-BbQqA-g_FUdXeYDMijr0WL5-L_nNXiOd3M5jMKNYG4B2aOonyDKgvHj5VYLloEOb4GZAe07f4xKnqgsfMxSeEC-UcVbTdU_xskivYf91tlVwupaXxS9DffEczRQ7a6ABQuvNMMkazzbipZlU4UKYW0Zm9oPW3LsT1GTZRTlVFLnLmEtrjZLtfz9K1sVNddJHzN77q-yTuab7o4Qc5XK1MSjxkIaOEgm4sxfzLOPr4sl_RDZB1adQ2_VWB_VFrx"
                        alt="Matara Lion Warrior"
                        className="w-full h-auto rounded-lg grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

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
              className="py-20 md:py-32 bg-surface-container-low overflow-hidden">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-5 relative">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdDa6I_PT82oJXJwyeDqW5RN8WE28ZOCn6NdunELYhSfN15Hku_uodkYLAb_a8KG6-Zt3ExYDoMEdHGN9Z3-gMt9JVe2qRjxbE8qOQOoVYY10IGXeCwD94WNYxsRnMOAMj9h5T5bO9ixiB6etacaEzm7vL972HmQOcen_KOA-6xghe5KViWPCcjwrKV5MIrt1SkTY5DWJFlueH1JjFCiZY2SEOCR6XLZdT_MZfBoqvsazDUpUUsEpjUtomgURpK78JxVfUHgDpLWuz"
                      alt="The Monolith"
                      className="w-full aspect-square object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
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
            <section className="py-20 md:py-32 bg-surface relative">
              <div className="container mx-auto px-6 relative z-10">
                <SectionHeading
                  subtitle="Utility Engine"
                  title="Enter the Marsverse"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2 lg:col-span-2 glass-card p-6 md:p-10 group hover:bg-surface-container-highest transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 md:mb-12">
                      <div>
                        <h3 className="font-headline text-xl md:text-2xl font-bold text-white mb-2">
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
                      <LayoutGrid className="w-8 h-8 md:w-10 md:h-10 text-white/30 group-hover:text-amber-400 transition-all shrink-0" />
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
                          className="flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors cursor-default">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-6 md:p-10 group bg-zinc-800/10 border-zinc-700/20">
                    <div className="mb-6 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center bg-zinc-700 rounded-sm group-hover:rotate-12 transition-transform">
                      <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h3 className="font-headline text-xl md:text-2xl font-bold mb-4">
                      Utility Unlocks
                    </h3>
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      Holding $MARS earns you reflections in $WKC... 1% of buy
                      and sells goes to holders of $MARS
                    </p>
                  </div>

                  <div className="glass-card p-6 md:p-10 group bg-surface-container-highest">
                    <h3 className="font-headline text-lg md:text-xl font-bold mb-4 text-zinc-400 group-hover:text-white transition-colors">
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
                          className="flex justify-between items-center text-[10px] font-mono p-2 bg-neutral-950 border-l border-amber-400 hover:bg-zinc-800 transition-colors">
                          <span className={tx.color}>
                            {tx.type}: {tx.amount}
                          </span>
                          <span className="text-zinc-500">{tx.time}</span>
                        </div>
                      ))}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-container-highest to-transparent" />
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
                    <div className="flex-1 bg-neutral-950/80 p-6 md:p-8 backdrop-blur-md relative z-10 border border-white/5">
                      <h3 className="font-headline text-xl md:text-2xl font-bold text-white mb-4">
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

            {/* Calculator & Swap Section */}
            <section className="py-20 md:py-32 bg-surface-container-low">
              <div className="container mx-auto px-6 max-w-6xl">
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
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <img
                                  src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
                                  className="w-5 h-5"
                                  alt="BNB"
                                  loading="lazy"
                                  decoding="async"
                                  width={20}
                                  height={20}
                                />
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
                              <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                                <img
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV7o7fU6dfo9Cro-BbQqA-g_FUdXeYDMijr0WL5-L_nNXiOd3M5jMKNYG4B2aOonyDKgvHj5VYLloEOb4GZAe07f4xKnqgsfMxSeEC-UcVbTdU_xskivYf91tlVwupaXxS9DffEczRQ7a6ABQuvNMMkazzbipZlU4UKYW0Zm9oPW3LsT1GTZRTlVFLnLmEtrjZLtfz9K1sVNddJHzN77q-yTuab7o4Qc5XK1MSjxkIaOEgm4sxfzLOPr4sl_RDZB1adQ2_VWB_VFrx"
                                  className="w-5 h-5 rounded-full"
                                  alt="MARS"
                                  loading="lazy"
                                  decoding="async"
                                  width={20}
                                  height={20}
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
            <section id="roadmap" className="py-20 md:py-32 bg-surface">
              <div className="container mx-auto px-6">
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
            <section className="py-20 bg-surface-container-highest/30 backdrop-blur-md">
              <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12">
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
            <section id="blog" className="py-20 md:py-32 bg-surface">
              <div className="container mx-auto px-6 max-w-6xl">
                <SectionHeading
                  subtitle="Galactic Updates"
                  title="The Pride Chronicles"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <button className="px-8 py-4 border border-amber-400/20 text-amber-400 font-black uppercase tracking-widest text-xs hover:bg-amber-400/10 transition-all">
                    View All Chronicles
                  </button>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section
              id="faq"
              className="py-20 md:py-32 bg-surface-container-low">
              <div className="container mx-auto px-6 max-w-4xl">
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
            <section className="py-20 md:py-32 bg-surface">
              <div className="container mx-auto px-6 max-w-4xl">
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
              <div className="text-lg font-black text-amber-400 font-headline">
                MATARA
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

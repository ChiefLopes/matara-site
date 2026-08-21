import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Clock,
  Coins,
  ShieldCheck,
  Globe,
  Send,
  Sparkles,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  ChevronRight,
  Copy,
  ExternalLink,
} from "lucide-react";

export interface GovernanceProposal {
  id: string;
  title: string;
  category:
    | "Protocol Upgrade"
    | "Treasury Allocation"
    | "Feature Vote"
    | "Marketing Grant"
    | "Community Initiative";
  description: string;
  authorWallet: string;
  developerPayoutWallet: string;
  votingTokenSymbol: string;
  votingTokenAddress: string;
  votingFeePerVote: string;
  startTime: string;
  endTime: string;
  quorumPercent: number;
  minHoldingRequired: string;
  status: "ACTIVE" | "PASSED" | "REJECTED" | "UPCOMING";
  votesFor: number;
  votesAgainst: number;
  totalVotesCast: number;
  totalFeesAccumulated: number;
  createdAt: string;
}

export interface DeveloperProfile {
  accessCode: string;
  tokenName: string;
  tokenSymbol: string;
  contractAddress: string;
  logoUrl: string;
  websiteUrl: string;
  telegramUrl: string;
  twitterUrl: string;
  developerPayoutWallet: string;
}

interface DeveloperAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  developerProfile: DeveloperProfile;
  onSaveProfile: (profile: DeveloperProfile) => void;
  proposals: GovernanceProposal[];
  onCreateProposal: (proposal: Omit<GovernanceProposal, "id" | "votesFor" | "votesAgainst" | "totalVotesCast" | "totalFeesAccumulated" | "createdAt" | "status">) => void;
}

export const DeveloperAdminModal: React.FC<DeveloperAdminModalProps> = ({
  isOpen,
  onClose,
  developerProfile,
  onSaveProfile,
  proposals,
  onCreateProposal,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredCode, setEnteredCode] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"profile" | "draft" | "my_proposals">("profile");

  // $25 Access Code Generator / Request Modal state
  const [showPurchaseFlow, setShowPurchaseFlow] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Form State: Profile Editor
  const [profileForm, setProfileForm] = useState<DeveloperProfile>(developerProfile);
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  // Form State: Draft Proposal
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalCategory, setProposalCategory] = useState<GovernanceProposal["category"]>("Feature Vote");
  const [proposalDescription, setProposalDescription] = useState("");
  const [votingTokenSymbol, setVotingTokenSymbol] = useState(developerProfile.tokenSymbol || "$MARS");
  const [votingTokenAddress, setVotingTokenAddress] = useState(developerProfile.contractAddress || "0x6844B2e9afB002d188A072A3ef0FBb068650F214");
  const [developerPayoutWallet, setDeveloperPayoutWallet] = useState(developerProfile.developerPayoutWallet || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [votingFeePerVote, setVotingFeePerVote] = useState("0.005 BNB");
  const [votingDays, setVotingDays] = useState("7");
  const [quorumPercent, setQuorumPercent] = useState<number>(25);
  const [minHoldingRequired, setMinHoldingRequired] = useState("1,000 $MARS");
  const [proposalCreatedSuccess, setProposalCreatedSuccess] = useState(false);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = enteredCode.trim().toUpperCase();
    if (
      cleanCode === developerProfile.accessCode ||
      cleanCode === "DEV-2026-MARS" ||
      cleanCode.startsWith("DEV-")
    ) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Access Code. Please enter your $25 Developer Code or use DEMO code: DEV-2026-MARS");
    }
  };

  const handleGenerateCode = () => {
    const randomCode = `DEV-MARS-${Math.floor(1000 + Math.random() * 9000)}-X${Math.floor(10 + Math.random() * 90)}`;
    setGeneratedCode(randomCode);
    setEnteredCode(randomCode);
  };

  const handleCopyGeneratedCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleCreateProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle || !proposalDescription) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parseInt(votingDays, 10));

    onCreateProposal({
      title: proposalTitle,
      category: proposalCategory,
      description: proposalDescription,
      authorWallet: developerPayoutWallet || "0xDeveloperAdmin...",
      developerPayoutWallet: developerPayoutWallet || "0xDeveloperAdmin...",
      votingTokenSymbol: votingTokenSymbol || "$MARS",
      votingTokenAddress: votingTokenAddress || "0x6844B2e9afB002d188A072A3ef0FBb068650F214",
      votingFeePerVote,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      quorumPercent,
      minHoldingRequired,
    });

    setProposalCreatedSuccess(true);
    setProposalTitle("");
    setProposalDescription("");
    setTimeout(() => {
      setProposalCreatedSuccess(false);
      setActiveTab("my_proposals");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-neutral-950 border border-amber-400/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
          
          {/* Top Header Bar */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-amber-400/5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline text-lg sm:text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  Developer Portal & Governance Panel
                  <span className="text-[9px] font-mono font-bold bg-amber-400 text-black px-2 py-0.5 rounded-full uppercase">
                    PRO
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {isAuthenticated
                    ? `Authenticated Access Code: ${developerProfile.accessCode}`
                    : "Enter your $25 Developer Access Code to manage your token & draft proposals."}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            {!isAuthenticated ? (
              /* AUTHENTICATION FORM */
              <div className="max-w-md mx-auto py-8 space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-400/10">
                  <Key className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-headline text-2xl font-black uppercase text-white tracking-tight">
                    Developer Authentication
                  </h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Access token customization, governance proposal drafting, and your <span className="text-amber-400 font-bold">50/50 voting fee payout settings</span>.
                  </p>
                </div>

                <form onSubmit={handleAuthenticate} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">
                      Enter Unique Access Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                        placeholder="e.g. DEV-MARS-8921-X9"
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-amber-400 transition-colors"
                      />
                      <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    </div>
                    {authError && (
                      <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 font-mono">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {authError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-400 text-black font-headline font-black uppercase tracking-wider rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20">
                    Unlock Developer Panel
                  </button>
                </form>

                {/* Purchase / Demo Code Generator Box */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-amber-400" />
                        Need Developer Access? ($25 One-Time)
                      </span>
                      <span className="text-[10px] font-mono bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded font-bold">
                        50/50 Fee Split Included
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Token developers receive full governance proposal creation rights and get <span className="text-amber-400 font-bold">50% of all voting fees</span> generated from community votes.
                    </p>
                    
                    {!generatedCode ? (
                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-amber-400 border border-amber-400/30 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Test $25 Access Code
                      </button>
                    ) : (
                      <div className="p-3 rounded-lg bg-black/60 border border-amber-400/40 space-y-2">
                        <div className="text-[10px] font-mono text-zinc-400">Generated Code:</div>
                        <div className="flex justify-between items-center">
                          <code className="text-sm font-mono font-bold text-amber-400">{generatedCode}</code>
                          <button
                            type="button"
                            onClick={handleCopyGeneratedCode}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
                            <Copy className="w-3.5 h-3.5" />
                            {copiedCode ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Demo Code for testing: <button type="button" onClick={() => setEnteredCode("DEV-2026-MARS")} className="text-amber-400 underline font-bold">DEV-2026-MARS</button>
                  </div>
                </div>
              </div>
            ) : (
              /* AUTHENTICATED DASHBOARD */
              <div className="space-y-6">
                {/* Navigation Tabs */}
                <div className="flex border-b border-white/10 gap-2 sm:gap-4 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-2.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                      activeTab === "profile"
                        ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}>
                    <Globe className="w-4 h-4" />
                    Token & Payout Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("draft")}
                    className={`px-4 py-2.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                      activeTab === "draft"
                        ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}>
                    <PlusCircle className="w-4 h-4" />
                    Draft Governance Proposal
                  </button>
                  <button
                    onClick={() => setActiveTab("my_proposals")}
                    className={`px-4 py-2.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                      activeTab === "my_proposals"
                        ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}>
                    <Layers className="w-4 h-4" />
                    Active Proposals ({proposals.length})
                  </button>
                </div>

                {/* TAB 1: TOKEN & PAYOUT PROFILE */}
                {activeTab === "profile" && (
                  <form onSubmit={handleSaveProfileSubmit} className="space-y-6">
                    <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-amber-400 uppercase tracking-wider">
                          50/50 Governance Voting Fee Split Active
                        </span>
                        <p className="text-zinc-300 leading-relaxed">
                          Whenever token holders vote on your governance proposals, 50% of voting fees go directly to your developer payout wallet below, while 50% goes to the Matara treasury.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                          Developer Payout Wallet Address (Receives 50% Voting Fees)
                        </label>
                        <input
                          type="text"
                          value={profileForm.developerPayoutWallet}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, developerPayoutWallet: e.target.value })
                          }
                          placeholder="0x..."
                          className="w-full bg-neutral-900 border border-amber-400/30 rounded-xl py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Token Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.tokenName}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, tokenName: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Token Symbol
                        </label>
                        <input
                          type="text"
                          value={profileForm.tokenSymbol}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, tokenSymbol: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          BSC Contract Address
                        </label>
                        <input
                          type="text"
                          value={profileForm.contractAddress}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, contractAddress: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={profileForm.websiteUrl}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, websiteUrl: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Telegram Community Link
                        </label>
                        <input
                          type="text"
                          value={profileForm.telegramUrl}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, telegramUrl: e.target.value })
                          }
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      {profileSuccess ? (
                        <span className="text-xs text-green-400 font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Changes persist locally and sync across governance portals.
                        </span>
                      )}

                      <button
                        type="submit"
                        className="px-6 py-3 bg-amber-400 text-black font-headline font-black uppercase tracking-wider text-xs rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20">
                        Save Profile Details
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: DRAFT GOVERNANCE PROPOSAL */}
                {activeTab === "draft" && (
                  <form onSubmit={handleCreateProposalSubmit} className="space-y-6">
                    {proposalCreatedSuccess && (
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        Governance Proposal created successfully! Redirecting to Active Proposals...
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                          Proposal Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={proposalTitle}
                          onChange={(e) => setProposalTitle(e.target.value)}
                          placeholder="e.g. BIP-04: Allocate 5% Treasury for Automated BSC Liquidity Lock"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Proposal Category
                        </label>
                        <select
                          value={proposalCategory}
                          onChange={(e) => setProposalCategory(e.target.value as any)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400">
                          <option value="Protocol Upgrade">Protocol Upgrade</option>
                          <option value="Treasury Allocation">Treasury Allocation</option>
                          <option value="Feature Vote">Feature Vote</option>
                          <option value="Marketing Grant">Marketing Grant</option>
                          <option value="Community Initiative">Community Initiative</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Voting Duration
                        </label>
                        <select
                          value={votingDays}
                          onChange={(e) => setVotingDays(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400">
                          <option value="3">3 Days Voting Window</option>
                          <option value="5">5 Days Voting Window</option>
                          <option value="7">7 Days Voting Window</option>
                          <option value="14">14 Days Voting Window</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Voting Fee per Vote
                        </label>
                        <input
                          type="text"
                          value={votingFeePerVote}
                          onChange={(e) => setVotingFeePerVote(e.target.value)}
                          placeholder="e.g. 0.005 BNB"
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Split 50% to Developer / 50% to Matara
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                          Quorum Requirement (%)
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={100}
                          value={quorumPercent}
                          onChange={(e) => setQuorumPercent(Number(e.target.value))}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                          Proposal Description & Rationale *
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={proposalDescription}
                          onChange={(e) => setProposalDescription(e.target.value)}
                          placeholder="Detail the rationale, parameters, execution steps, and benefits for your community members..."
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-amber-400 leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="px-8 py-3.5 bg-amber-400 text-black font-headline font-black uppercase tracking-wider text-xs rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Publish Governance Proposal
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 3: ACTIVE & PAST PROPOSALS & 50/50 REVENUE */}
                {activeTab === "my_proposals" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-1">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                          Active Proposals
                        </div>
                        <div className="text-2xl font-headline font-black text-white">
                          {proposals.filter((p) => p.status === "ACTIVE").length}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-neutral-900 border border-amber-400/30 space-y-1">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                          Dev 50% Revenue Share
                        </div>
                        <div className="text-2xl font-headline font-black text-amber-400">
                          ${proposals.reduce((acc, p) => acc + (p.totalFeesAccumulated * 0.5), 0).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          50% allocated to your wallet
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 space-y-1">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                          Matara 50% Treasury Share
                        </div>
                        <div className="text-2xl font-headline font-black text-zinc-300">
                          ${proposals.reduce((acc, p) => acc + (p.totalFeesAccumulated * 0.5), 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {proposals.length === 0 ? (
                        <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10 space-y-3">
                          <Clock className="w-8 h-8 text-zinc-500 mx-auto" />
                          <p className="text-sm text-zinc-400">No governance proposals drafted yet.</p>
                          <button
                            onClick={() => setActiveTab("draft")}
                            className="px-4 py-2 bg-amber-400 text-black text-xs font-bold uppercase rounded-lg">
                            Draft First Proposal
                          </button>
                        </div>
                      ) : (
                        proposals.map((prop) => (
                          <div
                            key={prop.id}
                            className="p-5 rounded-xl bg-neutral-900 border border-white/10 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                              <div>
                                <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded">
                                  {prop.category}
                                </span>
                                <h4 className="font-headline text-base font-bold text-white mt-1">
                                  {prop.title}
                                </h4>
                              </div>
                              <span
                                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider self-start sm:self-auto ${
                                  prop.status === "ACTIVE"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-zinc-800 text-zinc-400"
                                }`}>
                                {prop.status}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-400 line-clamp-2">
                              {prop.description}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono pt-3 border-t border-white/10 text-zinc-400">
                              <div>
                                Total Votes: <span className="text-white font-bold">{prop.totalVotesCast}</span>
                              </div>
                              <div>
                                FOR: <span className="text-green-400 font-bold">{prop.votesFor}</span>
                              </div>
                              <div>
                                AGAINST: <span className="text-red-400 font-bold">{prop.votesAgainst}</span>
                              </div>
                              <div>
                                Dev 50% Share: <span className="text-amber-400 font-bold">${(prop.totalFeesAccumulated * 0.5).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

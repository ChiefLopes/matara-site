import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  DollarSign,
  TrendingUp,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Building,
} from "lucide-react";
import { GovernanceProposal } from "./DeveloperAdminModal";

interface GovernancePortalProps {
  proposals: GovernanceProposal[];
  onVote: (proposalId: string, choice: "FOR" | "AGAINST", voterWallet: string) => void;
  onOpenDeveloperModal: () => void;
}

export const GovernancePortal: React.FC<GovernancePortalProps> = ({
  proposals,
  onVote,
  onOpenDeveloperModal,
}) => {
  const [selectedProposal, setSelectedProposal] = useState<GovernanceProposal | null>(null);
  const [voteChoice, setVoteChoice] = useState<"FOR" | "AGAINST">("FOR");
  const [voterWallet, setVoterWallet] = useState("");
  const [voteSuccess, setVoteSuccess] = useState(false);

  const handleCastVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal || !voterWallet) return;

    onVote(selectedProposal.id, voteChoice, voterWallet);
    setVoteSuccess(true);
    setTimeout(() => {
      setVoteSuccess(false);
      setSelectedProposal(null);
      setVoterWallet("");
    }, 2000);
  };

  return (
    <section id="governance" className="py-20 md:py-32 bg-neutral-950 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-2">
              <Vote className="w-4 h-4" /> Sovereign Governance Engine
            </div>
            <h2 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Community Governance & Voting
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-2 leading-relaxed">
              Token holders vote directly on developer proposals. Every vote distributes 50% fees to the developer wallet and 50% to the Matara treasury.
            </p>
          </div>

          <button
            onClick={onOpenDeveloperModal}
            className="px-6 py-3.5 bg-amber-400/10 border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-black font-headline font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            Developer Portal & Proposal Builder
          </button>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.length === 0 ? (
            <div className="p-12 text-center glass-card border-white/10 rounded-2xl space-y-4">
              <Clock className="w-12 h-12 text-amber-400/50 mx-auto" />
              <h3 className="font-headline text-xl font-bold text-white uppercase">No Active Proposals Yet</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Developers can authenticate using their $25 access code to draft community proposals.
              </p>
              <button
                onClick={onOpenDeveloperModal}
                className="px-5 py-2.5 bg-amber-400 text-black text-xs font-bold uppercase rounded-lg">
                Access Developer Panel
              </button>
            </div>
          ) : (
            proposals.map((prop) => {
              const totalVotes = prop.votesFor + prop.votesAgainst;
              const percentFor = totalVotes > 0 ? Math.round((prop.votesFor / totalVotes) * 100) : 0;
              const percentAgainst = totalVotes > 0 ? Math.round((prop.votesAgainst / totalVotes) * 100) : 0;

              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 md:p-8 rounded-2xl border-white/10 hover:border-amber-400/30 transition-all space-y-6 golden-blue-glow-hover">
                  
                  {/* Card Top */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-amber-400/20 text-amber-400 px-2.5 py-0.5 rounded">
                          {prop.category}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Token: {prop.votingTokenSymbol}
                        </span>
                      </div>
                      <h3 className="font-headline text-xl font-bold text-white tracking-tight">
                        {prop.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {prop.status}
                      </span>
                      <button
                        onClick={() => setSelectedProposal(prop)}
                        className="px-5 py-2.5 bg-amber-400 text-black font-headline font-black uppercase text-xs tracking-wider rounded-xl hover:bg-amber-300 transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5">
                        Vote Now <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-4xl">
                    {prop.description}
                  </p>

                  {/* Vote Progress Bars */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> FOR: {prop.votesFor} Votes ({percentFor}%)
                      </span>
                      <span className="text-red-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> AGAINST: {prop.votesAgainst} Votes ({percentAgainst}%)
                      </span>
                    </div>

                    <div className="h-2.5 w-full bg-neutral-900 rounded-full overflow-hidden flex border border-white/5">
                      <div
                        style={{ width: `${percentFor}%` }}
                        className="h-full bg-green-500 transition-all duration-500"
                      />
                      <div
                        style={{ width: `${percentAgainst}%` }}
                        className="h-full bg-red-500 transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Card Footer Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-400">
                    <div>
                      Fee per Vote: <span className="text-amber-400 font-bold">{prop.votingFeePerVote}</span>
                    </div>
                    <div>
                      Quorum Required: <span className="text-white font-bold">{prop.quorumPercent}%</span>
                    </div>
                    <div className="col-span-2 text-right text-zinc-500 flex items-center justify-end gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      50% Fee Split: Developer <code className="text-amber-400 font-bold">{prop.developerPayoutWallet.slice(0, 6)}...{prop.developerPayoutWallet.slice(-4)}</code>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* CAST VOTE MODAL */}
        {selectedProposal && (
          <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg bg-neutral-950 border border-amber-400/30 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      {selectedProposal.category}
                    </span>
                    <h3 className="font-headline text-xl font-bold text-white mt-1">
                      Cast Vote: {selectedProposal.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="text-zinc-500 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {voteSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-headline text-xl font-bold text-white uppercase">Vote Successfully Recorded!</h4>
                    <p className="text-xs text-zinc-400 font-mono">
                      Your vote has been counted and 50/50 fees distributed.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCastVoteSubmit} className="space-y-6">
                    {/* Select FOR or AGAINST */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setVoteChoice("FOR")}
                        className={`p-4 rounded-xl border font-headline font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          voteChoice === "FOR"
                            ? "bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/20"
                            : "bg-neutral-900 border-white/10 text-zinc-400 hover:text-white"
                        }`}>
                        <CheckCircle2 className="w-5 h-5" />
                        Vote FOR
                      </button>

                      <button
                        type="button"
                        onClick={() => setVoteChoice("AGAINST")}
                        className={`p-4 rounded-xl border font-headline font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          voteChoice === "AGAINST"
                            ? "bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/20"
                            : "bg-neutral-900 border-white/10 text-zinc-400 hover:text-white"
                        }`}>
                        <XCircle className="w-5 h-5" />
                        Vote AGAINST
                      </button>
                    </div>

                    {/* Voter Wallet Address */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                        Your BSC Wallet Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={voterWallet}
                        onChange={(e) => setVoterWallet(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Transparent 50/50 Fee Split Box */}
                    <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-amber-400 font-bold uppercase">
                        <span>Voting Fee Required:</span>
                        <span>{selectedProposal.votingFeePerVote}</span>
                      </div>
                      <div className="pt-2 border-t border-amber-400/20 text-[10px] text-zinc-300 space-y-1">
                        <div className="flex justify-between">
                          <span>50% Share to Developer Wallet:</span>
                          <span className="text-white font-bold">{selectedProposal.developerPayoutWallet.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between">
                          <span>50% Share to Matara Treasury:</span>
                          <span className="text-white font-bold">0x6844...F214</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-amber-400 text-black font-headline font-black uppercase tracking-wider text-xs rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20">
                      Confirm & Cast Vote
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

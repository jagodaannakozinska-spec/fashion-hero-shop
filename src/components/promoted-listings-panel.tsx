"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type BadgeType = "featured" | "bestseller" | "new-arrival";
type DailyBudget = 10 | 20 | 50;
type Duration = 7 | 14 | 30;

interface PromotedListingsPanelProps {
  products: Product[];
  onPromotedProductChange?: (productId: string | null) => void;
}

const BASE_IMPRESSIONS: Record<DailyBudget, number> = { 10: 450, 20: 1050, 50: 2800 };
const BADGE_MULTIPLIER: Record<BadgeType, number> = { featured: 1.3, bestseller: 1.1, "new-arrival": 1.0 };
const CTR = 0.025;

const BADGE_LABELS: Record<BadgeType, string> = {
  featured: "Featured",
  bestseller: "Best Seller",
  "new-arrival": "New Arrival",
};

const BADGE_COLORS: Record<BadgeType, string> = {
  featured: "bg-amber-100 text-amber-800 border-amber-300",
  bestseller: "bg-emerald-100 text-emerald-800 border-emerald-300",
  "new-arrival": "bg-sky-100 text-sky-800 border-sky-300",
};

function fmt(n: number): string {
  return n.toLocaleString("pl-PL");
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
}

function StatCard({ label, value, sub, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-black/8 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-charcoal/5 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-warm-gray uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-[20px] font-light text-charcoal leading-none">{value}</p>
        {sub && <p className="text-[11px] text-warm-gray mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function PromotedListingsPanel({ products, onPromotedProductChange }: PromotedListingsPanelProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [badge, setBadge] = useState<BadgeType>("featured");
  const [budget, setBudget] = useState<DailyBudget>(20);
  const [duration, setDuration] = useState<Duration>(14);
  const [launched, setLaunched] = useState(false);

  const reach = useMemo(() => {
    const daily = Math.round(BASE_IMPRESSIONS[budget] * BADGE_MULTIPLIER[badge]);
    const total = daily * duration;
    const clicks = Math.round(total * CTR);
    const cost = budget * duration;
    return { daily, total, clicks, cost };
  }, [budget, badge, duration]);

  function handleProductChange(id: string) {
    setSelectedProductId(id);
    setLaunched(false);
    onPromotedProductChange?.(id || null);
  }

  function handleLaunch() {
    if (!selectedProductId) return;
    setLaunched(true);
  }

  return (
    <div className="mb-8 bg-cream-light border border-black/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-charcoal px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
            <path d="M3 10l7-7 7 7" />
            <path d="M5 8v8a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8" />
          </svg>
          <h3 className="text-[13px] font-medium text-white uppercase tracking-wider">Promoted Listings</h3>
        </div>
        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
          Seller Tools
        </span>
      </div>

      <div className="p-6 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT — form */}
        <div className="space-y-5">
          {/* Product selector */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-charcoal mb-2">
              Select product to promote
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full border border-black/15 rounded-lg px-3 py-2.5 text-[13px] text-charcoal bg-white focus:outline-none focus:ring-1 focus:ring-charcoal transition-shadow"
            >
              <option value="">— Choose a product —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.price} PLN
                </option>
              ))}
            </select>
          </div>

          {/* Badge type */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-charcoal mb-2">
              Badge type
            </label>
            <div className="flex flex-wrap gap-2">
              {(["featured", "bestseller", "new-arrival"] as BadgeType[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setBadge(b)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all",
                    badge === b
                      ? BADGE_COLORS[b] + " shadow-sm"
                      : "bg-white border-black/15 text-warm-gray hover:border-charcoal/40"
                  )}
                >
                  {BADGE_LABELS[b]}
                </button>
              ))}
            </div>
          </div>

          {/* Daily budget */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-charcoal mb-2">
              Daily budget
            </label>
            <div className="flex gap-2">
              {([10, 20, 50] as DailyBudget[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg border text-[13px] font-medium transition-all",
                    budget === b
                      ? "bg-charcoal text-white border-charcoal shadow-sm"
                      : "bg-white border-black/15 text-charcoal hover:border-charcoal/50"
                  )}
                >
                  {b} PLN
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-charcoal mb-2">
              Duration
            </label>
            <div className="flex gap-2">
              {([7, 14, 30] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg border text-[13px] font-medium transition-all",
                    duration === d
                      ? "bg-charcoal text-white border-charcoal shadow-sm"
                      : "bg-white border-black/15 text-charcoal hover:border-charcoal/50"
                  )}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleLaunch}
            disabled={!selectedProductId}
            className={cn(
              "w-full py-3 rounded-xl text-[13px] font-medium uppercase tracking-wider transition-all",
              selectedProductId
                ? "bg-charcoal text-white hover:bg-charcoal-light active:scale-[0.98]"
                : "bg-black/10 text-warm-gray cursor-not-allowed"
            )}
          >
            {launched ? "✓ Campaign Active" : "Start Campaign"}
          </button>

          {launched && (
            <p className="text-[11px] text-warm-gray text-center -mt-2">
              Your listing will appear as <strong className="text-charcoal">{BADGE_LABELS[badge]}</strong> for {duration} days · Total: <strong className="text-charcoal">{reach.cost} PLN</strong>
            </p>
          )}
        </div>

        {/* RIGHT — estimated reach */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[11px] font-medium uppercase tracking-wider text-charcoal">
              Estimated Reach
            </h4>
            <span className="text-[10px] text-warm-gray bg-white border border-black/10 px-2 py-0.5 rounded-full">
              {BADGE_LABELS[badge]} · {budget} PLN/day · {duration}d
            </span>
          </div>

          <StatCard
            label="Daily impressions"
            value={fmt(reach.daily)}
            sub="views per day"
            icon={
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-charcoal/60">
                <ellipse cx="8" cy="8" rx="7" ry="5" />
                <circle cx="8" cy="8" r="2" />
              </svg>
            }
          />

          <StatCard
            label="Total impressions"
            value={fmt(reach.total)}
            sub={`over ${duration} days`}
            icon={
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-charcoal/60">
                <rect x="1" y="10" width="3" height="5" rx="0.5" />
                <rect x="6" y="6" width="3" height="9" rx="0.5" />
                <rect x="11" y="2" width="3" height="13" rx="0.5" />
              </svg>
            }
          />

          <StatCard
            label="Estimated clicks"
            value={fmt(reach.clicks)}
            sub="~2.5% click-through rate"
            icon={
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-charcoal/60">
                <path d="M3 3l10 5.5-5 1-2.5 5L3 3z" />
              </svg>
            }
          />

          {/* Total cost */}
          <div className="bg-charcoal rounded-xl p-4 text-white">
            <p className="text-[11px] uppercase tracking-wide text-white/60 mb-1">Total campaign cost</p>
            <p className="text-[28px] font-light leading-none">{reach.cost} <span className="text-[14px]">PLN</span></p>
            <p className="text-[11px] text-white/50 mt-1">{budget} PLN/day × {duration} days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

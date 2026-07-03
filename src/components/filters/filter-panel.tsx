import { useEffect, useState } from "react";
import type { FilterState } from "./types";
import { PRICE_MAX, ALL_CATEGORIES, SUBCATEGORIES_BY_CATEGORY } from "./types";

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
  activeCount: number;
}

const RATINGS = [3, 4, 4.5] as const;

export default function FilterPanel({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  activeCount,
}: FilterPanelProps) {
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const toggleCat = (cat: string) => {
    const wasSelected = filters.categories.includes(cat);
    const nextCats = wasSelected
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];

    // if deselecting a category, also remove its subcategories
    let nextSubs = filters.subcategories;
    if (wasSelected) {
      const subs = SUBCATEGORIES_BY_CATEGORY[cat] ?? [];
      nextSubs = nextSubs.filter((s) => !subs.includes(s));
    }
    onChange({ ...filters, categories: nextCats, subcategories: nextSubs });
  };

  const toggleSub = (sub: string) => {
    const next = filters.subcategories.includes(sub)
      ? filters.subcategories.filter((s) => s !== sub)
      : [...filters.subcategories, sub];
    onChange({ ...filters, subcategories: next });
  };

  const toggleRating = (r: number) => {
    onChange({ ...filters, minRating: filters.minRating === r ? 0 : r });
  };

  // Subcategories to show — union of selected categories, or all if none selected
  const visibleSubs: { category: string; subs: string[] }[] =
    filters.categories.length > 0
      ? filters.categories.map((cat) => ({
          category: cat,
          subs: SUBCATEGORIES_BY_CATEGORY[cat] ?? [],
        }))
      : ALL_CATEGORIES.map((cat) => ({
          category: cat,
          subs: SUBCATEGORIES_BY_CATEGORY[cat] ?? [],
        }));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.2)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-screen z-50 flex flex-col w-full sm:w-[25%]"
        style={{
          // width: "300px",
          background: "#ffffff",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: open ? "-2px 0 32px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between shrink-0 px-5 py-4"
          style={{ borderBottom: "1px solid #e5e7eb" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-gray-800">
              Filters
            </span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-sm bg-gray-200 text-gray-600 text-[9px] font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}
        >
          {/* Price */}
          <AccordionSection title="Price" defaultOpen>
            <PriceSection
              priceMax={filters.priceMax}
              onChange={(priceMax) => onChange({ ...filters, priceMax })}
            />
          </AccordionSection>

          {/* Category */}
          <AccordionSection title="Category" defaultOpen>
            {ALL_CATEGORIES.map((cat) => (
              <Checkbox
                key={cat}
                label={cat}
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCat(cat)}
              />
            ))}
          </AccordionSection>

          {/* Subcategory — per category group */}
          {visibleSubs.map(({ category, subs }) => (
            <AccordionSection key={category} title={category}>
              {subs.map((sub) => (
                <Checkbox
                  key={sub}
                  label={sub}
                  checked={filters.subcategories.includes(sub)}
                  onChange={() => toggleSub(sub)}
                />
              ))}
            </AccordionSection>
          ))}

          {/* Rating */}
          <AccordionSection title="Min Rating">
            {RATINGS.map((r) => (
              <Checkbox
                key={r}
                label={`${r} ★ & above`}
                checked={filters.minRating === r}
                onChange={() => toggleRating(r)}
              />
            ))}
          </AccordionSection>
        </div>

        {/* ── Footer ── */}
        <div
          className="shrink-0 px-5 py-4 flex gap-2"
          style={{ borderTop: "1px solid #e5e7eb" }}
        >
          <button
            onClick={onClear}
            className="flex-1 h-9 text-[11px] tracking-[0.1em] uppercase border transition-colors hover:bg-gray-50"
            style={{ border: "1px solid #d1d5db", color: "#6b7280" }}
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-9 text-[11px] tracking-[0.1em] uppercase transition-colors hover:opacity-80"
            style={{ background: "#1c1917", color: "#fff" }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}

// ── Accordion Section ──────────────────────────────────────

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <span className="text-[13px] font-medium text-gray-700">{title}</span>
        <span className="text-gray-400">
          {open ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </span>
      </button>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? "600px" : "0px",
          transition: "max-height 0.25s ease",
        }}
      >
        <div className="px-5 pb-4 space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Checkbox ───────────────────────────────────────────────

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-3 w-full py-0.5 group"
    >
      <span
        className="w-3.5 h-3.5 shrink-0 flex items-center justify-center transition-colors"
        style={{
          border: checked ? "1.5px solid #111827" : "1.5px solid #9ca3af",
          background: checked ? "#111827" : "transparent",
        }}
      >
        {checked && (
          <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span
        className="text-[13px] leading-none text-left"
        style={{ color: checked ? "#111827" : "#6b7280" }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Price Section ──────────────────────────────────────────

function PriceSection({
  priceMax,
  onChange,
}: {
  priceMax: number;
  onChange: (v: number) => void;
}) {
  const pct = (priceMax / PRICE_MAX) * 100;

  return (
    <div className="space-y-3">
      {/* Custom slider */}
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-[2px] rounded-full bg-gray-200" />
        <div
          className="absolute h-[2px] rounded-full bg-gray-200"
          style={{ left: 0, width: `${pct}%` }}
        />
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={100}
          value={priceMax}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-5 z-10"
        />
        {/* left thumb */}
        <span
          className="absolute w-2 h-2 rounded-full bg-gray-400 pointer-events-none"
          style={{ left: 0, transform: "translateX(-50%)" }}
        />
        {/* right thumb */}
        <span
          className="absolute w-2 h-2 rounded-full bg-gray-400 pointer-events-none"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
        />
      </div>

      {/* Input boxes */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1 flex-1 px-2 py-1.5 border border-gray-200"
        >
          <span className="text-[11px] text-gray-400">₹</span>
          <span className="text-[12px] flex-1 text-right text-gray-700">0</span>
        </div>
        <span className="text-[12px] text-gray-400">–</span>
        <div className="flex items-center gap-1 flex-1 px-2 py-1.5 border border-gray-200">
          <span className="text-[11px] text-gray-400">₹</span>
          <input
            type="number"
            min={0}
            max={PRICE_MAX}
            step={100}
            value={priceMax}
            onChange={(e) => onChange(Math.min(PRICE_MAX, Math.max(0, Number(e.target.value))))}
            className="flex-1 text-right text-[12px] outline-none bg-transparent w-0 min-w-0 text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}

import { ALL_CATEGORIES } from "./types";

interface CategoryFilterProps {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const toggle = (cat: string) => {
    onChange(
      selected.includes(cat)
        ? selected.filter((c) => c !== cat)
        : [...selected, cat]
    );
  };

  return (
    <div className="space-y-0.5">
      {ALL_CATEGORIES.map((cat) => {
        const on = selected.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className="w-full flex items-center gap-2.5 py-1.5 group"
          >
            <span
              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                on
                  ? "bg-gray-900 border-gray-900"
                  : "border-gray-300 group-hover:border-gray-500"
              }`}
            >
              {on && (
                <svg
                  className="w-2 h-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span
              className={`text-[12px] leading-none transition-colors ${
                on ? "text-gray-900 font-medium" : "text-gray-500"
              }`}
            >
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}

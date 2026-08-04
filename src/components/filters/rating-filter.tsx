const RATINGS = [0, 3, 4, 4.5] as const;

interface RatingFilterProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {RATINGS.map((r) => {
        const on = value === r;
        return (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`py-1.5 text-[11px] border rounded transition-colors ${
              on
                ? "bg-gray-900 border-gray-900 text-white font-medium"
                : "border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
          >
            {r === 0 ? "All" : `${r} ★`}
          </button>
        );
      })}
    </div>
  );
}

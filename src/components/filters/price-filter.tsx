import { PRICE_MAX } from "./types";

interface PriceFilterProps {
  value: number;
  onChange: (max: number) => void;
}

export default function PriceFilter({ value, onChange }: PriceFilterProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-gray-400">₹ 0</span>
        <span className="text-[12px] text-gray-800 font-medium">
          ₹ {value.toLocaleString("en-IN")}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={PRICE_MAX}
        step={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-[3px] accent-gray-900 cursor-pointer"
      />
      <div className="flex justify-end mt-1">
        <span className="text-[10px] text-gray-400">
          max ₹ {PRICE_MAX.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

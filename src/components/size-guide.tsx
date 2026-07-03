import { useEffect } from "react";

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
}

const CLOTHING_SIZES = [
  { size: "XS",  chest: "32–33", waist: "26–27", hips: "35–36", inseam: "30" },
  { size: "S",   chest: "34–35", waist: "28–29", hips: "37–38", inseam: "30" },
  { size: "M",   chest: "36–37", waist: "30–31", hips: "39–40", inseam: "31" },
  { size: "L",   chest: "38–40", waist: "32–34", hips: "41–43", inseam: "31" },
  { size: "XL",  chest: "41–43", waist: "35–37", hips: "44–46", inseam: "32" },
  { size: "XXL", chest: "44–46", waist: "38–40", hips: "47–49", inseam: "32" },
];

const HOW_TO_MEASURE = [
  {
    label: "Chest",
    desc: "Measure around the fullest part of your chest, keeping the tape parallel to the ground.",
  },
  {
    label: "Waist",
    desc: "Measure around your natural waistline, at the narrowest part of your torso.",
  },
  {
    label: "Hips",
    desc: "Measure around the fullest part of your hips and seat, about 20 cm below your waist.",
  },
  {
    label: "Inseam",
    desc: "Measure from the crotch seam down to the bottom of the leg.",
  },
];

export default function SizeGuide({ open, onClose }: SizeGuideProps) {
  // close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:px-4 mt-8 sm:mt-0"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      {/* Modal panel — fixed height, flex column so header is sticky */}
      <div
        className="relative bg-white w-full max-w-lg rounded flex flex-col mt-8 h-full sm:max-h-[85vh]"
       
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="flex items-center bg-gray-50 rounded-t justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-[13px] font-medium tracking-widest uppercase text-gray-800">
            Size Guide
          </h2>
          <button
            onClick={onClose}
            aria-label="Close size guide"
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body with custom thin scrollbar ── */}
        <div
          className="overflow-y-auto flex-1 px-4 sm:px-6 py-5 space-y-4 sm:space-y-7"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db transparent",
          }}
        >
          {/* Unit note */}
          <p className="text-[11px] text-gray-400 leading-relaxed">
            All measurements are in{" "}
            <strong className="text-gray-600">inches</strong>. Measure yourself
            and compare to the chart below for the best fit.
          </p>

          {/* Size chart */}
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-gray-500 mb-3">
              Clothing Sizes
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {["Size", "Chest", "Waist", "Hips", "Inseam"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 text-gray-500 font-medium border border-gray-100 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLOTHING_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 font-semibold text-gray-800 border border-gray-100">{row.size}</td>
                      <td className="px-3 py-2 text-gray-600 border border-gray-100">{row.chest}</td>
                      <td className="px-3 py-2 text-gray-600 border border-gray-100">{row.waist}</td>
                      <td className="px-3 py-2 text-gray-600 border border-gray-100">{row.hips}</td>
                      <td className="px-3 py-2 text-gray-600 border border-gray-100">{row.inseam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to measure */}
          <div>
            <p className="text-[11px] font-medium tracking-widest uppercase text-gray-500 mb-3">
              How to Measure
            </p>
            <ul className="space-y-3">
              {HOW_TO_MEASURE.map((item) => (
                <li key={item.label} className="flex gap-3 text-[12px]">
                  <span className="font-medium text-gray-700 w-14 shrink-0">{item.label}</span>
                  <span className="text-gray-500 leading-relaxed">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tip */}
          <div className="border border-gray-100 rounded p-3 text-[11px] text-gray-500 leading-relaxed">
            <strong className="text-gray-700">Tip:</strong> If you're between
            sizes, size up for a more comfortable fit. Still unsure?{" "}
            <a href="#" className="underline hover:text-gray-800 transition-colors">
              Chat with us
            </a>{" "}
            and we'll help you pick the right size.
          </div>
        </div>
      </div>
    </div>
  );
}

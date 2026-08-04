import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import products from "../../data/products.json";
import ProductCard from "../product/productcard";

interface FeatureListProps {
    title?: string;
    subtitle?: string;
    category?: string;
    subcategory?: string;
    limit?: number;
}

const FeatureList = ({
    title = "Explore Our Collection",
    subtitle = "Checkout what's latest at ELSAJ",
    category,
    subcategory,
    limit = 20,
}: FeatureListProps) => {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const items = products
        .filter((p) => {
            if (category && p.category !== category) return false;
            if (subcategory && p.subcategory !== subcategory) return false;
            return true;
        })
        .slice(0, limit);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const cardW = el.offsetWidth / 6;
        el.scrollBy({ left: dir === "left" ? -(cardW * 3) : cardW * 3, behavior: "smooth" });
    };



    if (items.length === 0) {
        return
    }

    return (
        <section className="">



            {/* Header — arrows on same row as title */}
            <div className="flex items-center px-6 sm:px-10 mb-2 sm:mb-4">
                <div className="flex-1 text-center">
                    <h2
                        className="text-[22px] sm:text-[26px] md:text-[30px] font-extralight text-gray-900 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {title}
                    </h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>
                </div>

            </div>

            <div className="flex items-center  justify-between px-4 sm:px-8 mb-2 sm:mb-3">

                <button
                    onClick={() => scroll("left")}
                    aria-label="Scroll left"
                    className="w-4 sm:w-7 h-3 sm:h-7 shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="black"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                </button>



                <button
                    onClick={() => scroll("right")}
                    aria-label="Scroll right"
                    className="w-4 sm:w-7 h-3 shrink-0 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="black"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </button>
            </div>

            {/* Scrollable row — 6 cards visible */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto px-4 sm:px-8"
                style={{ scrollbarWidth: "none", gap: "10px" }}
            >
                {items.map((p) => (
                    <div
                        key={p.id}
                        className="shrink-0"
                        style={{ width: "calc((100% - 50px) / 6)", minWidth: "130px" }}
                    >
                        <ProductCard
                            name={p.name}
                            price={p.variants[0].sizes[0].price}
                            currency="₹"
                            images={p.variants[0].images}
                            onClick={() => navigate(`/product/${p.id}`)}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeatureList;

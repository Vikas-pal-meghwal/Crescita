import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import fashionbigvideo from "../../assets/fashion-big-video.mp4"
import fashioSmallVideo from "../../assets/fashion-small-video.mp4"

import menbigvideo from "../../assets/menbigvideo.mp4"
import menSmallVideo from "../../assets/menSmallVideo.mp4"

import womenbigvideo from "../../assets/womenbigvideo.mp4"
import womenSmallVideo from "../../assets/womenSmallVideo.mp4"

import beautybigvideo from "../../assets/beautybigvideo.mp4"
import beautySmallVideo from "../../assets/beautySmallVideo.mp4"


import humanliviingvideo from "../../assets/human-liviing-video.mp4"
import humanliviingSmallVideo from "../../assets/humanliviingSmallVideo.mp4"




const CATEGORIES = [
    {
        label: "Fashion",
        sub: "Clothing & Accessories",
        params: "category=Fashion",
        image:
            "https://plus.unsplash.com/premium_photo-1664202526047-405824c633e7?w=800&auto=format&fit=crop&q=60",
        desktopSpan: "col-span-2 row-span-2",
        smallImage: "https://plus.unsplash.com/premium_photo-1727943458940-ba9653405f9a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDMxfHx3b21lbiUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D",
        video: fashionbigvideo,
        // smallVideo: "https://www.pexels.com/download/video/7316982/"
        // smallVideo: "https://www.pexels.com/download/video/8061194/"
        smallVideo: fashioSmallVideo
    }, {
        label: "Shop Men",
        sub: "Men's Clothing",
        params: "category=Fashion&sub=Men%27s+Clothing",
        image:
            "https://images.unsplash.com/photo-1660983414429-66757ac8d03d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fG1lbnMlMjBmYXNoaW9uJTIwaW4lMjB3aGl0ZSUyMGJnfGVufDB8fDB8fHww",
        desktopSpan: "col-span-1 row-span-1",
        smallImage: "https://images.unsplash.com/photo-1633405044931-d59ce835743f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fG1lbiUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D",
        video: menbigvideo,
        smallVideo: menSmallVideo
    },
    {
        label: "Shop Women",
        sub: "Women's Clothing",
        params: "category=Fashion&sub=Women%27s+Clothing",
        image:
            "https://images.unsplash.com/photo-1595476147510-1a9b33600fc8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHdvbWVucyUyMGNsb3RoaW5nfGVufDB8fDB8fHww",
        desktopSpan: "col-span-1 row-span-1",
        smallImage: "https://images.unsplash.com/photo-1604436607823-d721dfe2df46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHdvbWVuJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
        video: womenbigvideo,
        smallVideo: womenSmallVideo

    },

    {
        label: "Beauty",
        sub: "Skincare & Makeup",
        params: "category=Beauty",
        image:
            "https://plus.unsplash.com/premium_photo-1661754333744-38817d55d79a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODl8fG1ha2V1cHxlbnwwfHwwfHx8MA%3D%3D",
        desktopSpan: "col-span-1 row-span-1",
        smallImage: "https://images.unsplash.com/photo-1600523063811-4e78e3e088b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxtYWtlJTIwdXB8ZW58MHx8MHx8fDA%3D",
        video: beautybigvideo,
        // video :"https://www.pexels.com/download/video/4960197/",
        smallVideo: beautySmallVideo
    },
    {
        label: "Home & Living",
        sub: "Decor & Essentials",
        params: "category=Home+%26+Living",
        image:
            "https://images.unsplash.com/photo-1759722665648-4b8501599042?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fEhvbWUlMjBMaXZpbmd8ZW58MHx8MHx8fDA%3D",
        desktopSpan: "col-span-1 row-span-1",
        smallImage: "https://plus.unsplash.com/premium_photo-1676968002767-1f6a09891350?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fEhvbWUlMjBMaXZpbmd8ZW58MHx8MHx8fDA%3D",
        video: humanliviingvideo,
        smallVideo: humanliviingSmallVideo
    },

];

const overlay = {
    background:
        "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
};

const CategoryCards = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);


    // Touch swipe
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const SWIPE_THRESHOLD = 40;

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const onTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) < SWIPE_THRESHOLD) return; // too small, ignore
        if (diff > 0) {
            // swiped left → next
            setActive((a) => (a + 1) % CATEGORIES.length);
        } else {
            // swiped right → prev
            setActive((a) => (a - 1 + CATEGORIES.length) % CATEGORIES.length);
        }
    };

    // Tap vs navigate — only navigate if no swipe happened
    const handleTap = (params: string) => {
        const diff = Math.abs(touchStartX.current - touchEndX.current);
        if (diff < SWIPE_THRESHOLD) {
            navigate(`/products?${params}`);
        }
    };

    return (
        <section className="px-1 sm:px-2 sm:pl-6 py-1 sm:py-2 ">

            {/* ── Mobile: swipeable full-screen slider ── */}
            <div className="sm:hidden">
                <div
                    className="relative w-full overflow-hidden rounded-sm h-[80vh]"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {CATEGORIES.map((cat, i) => (
                        <div
                            key={cat.label}
                            className="absolute inset-0 transition-opacity duration-400"
                            style={{
                                opacity: i === active ? 1 : 0,
                                pointerEvents: i === active ? "auto" : "none",
                            }}
                            onClick={() => handleTap(cat.params)}
                        >
                            {/* <img
                                src={cat.smallImage}
                                alt={cat.label}
                                className="w-full h-full object-cover"
                                draggable={false}
                            /> */}

                            <video
                                ref={videoRef}
                                src={cat.smallVideo}
                                muted
                                loop
                                playsInline
                                preload="auto"
                                autoPlay
                                onCanPlay={() => videoRef.current?.play().catch(() => { })}
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                            />
                            <div className="absolute inset-0" style={overlay} />
                            <div className="absolute bottom-0 left-0 p-4">
                                <p className="text-[9px] tracking-[0.14em] uppercase text-white/65 mb-0.5">
                                    {cat.sub}
                                </p>
                                <h3
                                    className="text-white font-normal leading-tight text-[1.2rem]"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {cat.label}
                                </h3>
                                <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] tracking-[0.1em] uppercase text-white/60">
                                    Shop now
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
                        {CATEGORIES.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                                className="transition-all duration-300 rounded-full"
                                style={{
                                    width: i === active ? "20px" : "6px",
                                    height: "3px",
                                    background: i === active ? "#fff" : "rgba(255,255,255,0.45)",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Desktop: bento grid ── */}
            <div
                className="hidden sm:grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-2 sm:gap-2"
                style={{ height: "560px" }}
            >
                {CATEGORIES.map((cat) => (
                    <DesktopCard
                        key={cat.label}
                        cat={cat}
                        onNavigate={() => navigate(`/products?${cat.params}`)}
                    />
                ))}
            </div>
        </section >
    );
};

export default CategoryCards;

// ── Desktop card with hover video ─────────────────────────

type CatItem = (typeof CATEGORIES)[number];

function DesktopCard({ cat, onNavigate }: { cat: CatItem; onNavigate: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        if (cat.video && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    return (
        <div
            onClick={onNavigate}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`${cat.desktopSpan} relative overflow-hidden cursor-pointer group rounded-sm`}
        >
            {/* Static image — shown by default */}
            <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />

            {/* Video — shown on hover */}
            <video
                ref={videoRef}
                src={cat.video}
                muted
                loop
                playsInline
                preload="auto"
                autoPlay
                onCanPlay={() => videoRef.current?.play().catch(() => { })}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />


            <div className="absolute inset-0" style={overlay} />
            <div className="absolute bottom-0 left-0 p-4">
                <p className="text-[10px] tracking-[0.14em] uppercase text-white/65 mb-0.5">
                    {cat.sub}
                </p>
                <h3
                    className="text-white font-normal leading-tight text-[1.2rem]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {cat.label}
                </h3>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] tracking-[0.1em] uppercase text-white/55 group-hover:text-white transition-colors">
                    Shop now
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
            </div>
        </div>
    );
}

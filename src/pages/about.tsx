import { useNavigate } from "react-router-dom";
import fashionBig from "../assets/fashion-big-video.mp4";
import womenBig from "../assets/womenbigvideo.mp4";
import beautyBig from "../assets/beautybigvideo.mp4";
import humanBig from "../assets/human-liviing-video.mp4";

/* ─── Reusable muted video poster ─── */
const VideoBlock = ({
  src,
  className = "",
  style = {},
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <video
    src={src}
    autoPlay
    muted
    loop
    playsInline
    className={`w-full h-full object-cover ${className}`}
    style={style}
  />
);

/* ─── Team data ─── */
const TEAM = [
  { name: "Aryan Mehta", role: "Founder & CEO", bg: "#e8e4de" },
  { name: "Priya Sharma", role: "Head of Curation", bg: "#dfe8e4" },
  { name: "Dev Kapoor", role: "Tech & Product", bg: "#dde3e8" },
  { name: "Nisha Rao", role: "Brand & Creative", bg: "#e8dde3" },
  { name: "Rohit Jain", role: "Operations", bg: "#e8e6dd" },
  { name: "Sneha Pillai", role: "Customer Experience", bg: "#dde8e6" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-white text-gray-900 font-sans">

      {/* ── 1. Intro text block ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-14 pb-10">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">About Us</p>
        <h1
          className="font-serif font-normal text-gray-900 leading-[1.15] mb-6"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
        >
          Crescita
        </h1>
        <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed max-w-2xl">
          We started Crescita with a simple belief — that beautiful, thoughtfully made things
          should be easy to find. Not buried under noise, not locked behind premium access.
          Just good products, honestly presented, for people who care about what they bring
          into their lives.
        </p>
      </section>

      {/* ── 2. Two-column editorial photo grid ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pb-14">
        <div className="grid grid-cols-2 gap-3">
          {/* Large left — portrait ratio */}
          <div className="overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4" }}>
            <VideoBlock src={womenBig} />
          </div>
          {/* Right column — two stacked */}
          <div className="flex flex-col gap-3">
            <div className="overflow-hidden bg-gray-100 flex-1">
              <VideoBlock src={fashionBig} className="h-full" />
            </div>
            <div className="overflow-hidden bg-gray-100 flex-1">
              <VideoBlock src={beautyBig} className="h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Story — text right, thin rule left ── */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-8 sm:gap-16 items-start">
          {/* Left: label */}
          <div className="sm:pt-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Our Story</p>
            <div className="mt-3 h-px w-8 bg-gray-300" />
          </div>
          {/* Right: body */}
          <div className="space-y-4">
            <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed">
              Crescita began as a personal project — a curated list of brands three friends
              trusted and returned to. The list grew into a shared document, the document
              into a newsletter, and the newsletter into this store.
            </p>
            <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed">
              Today Crescita carries Fashion, Beauty, and Home & Living across hundreds of
              products. Every item is chosen by hand. We don't list things we wouldn't buy
              ourselves. That filter is simple, but it changes everything.
            </p>
            <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed">
              We are a small team, independently run, and proud of it. No outside investors,
              no growth-at-all-costs mandate — just a genuine love for the craft of curation.
            </p>
            <div className="flex gap-6 pt-2">
              <button
                onClick={() => navigate("/products")}
                className="text-[11px] tracking-[0.14em] uppercase text-gray-900 border-b border-gray-900 pb-px hover:text-gray-500 hover:border-gray-500 transition-colors"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-[11px] tracking-[0.14em] uppercase text-gray-400 border-b border-gray-300 pb-px hover:text-gray-700 hover:border-gray-600 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Full-width wide landscape video ── */}
      <section className="w-full my-10 overflow-hidden bg-gray-100" style={{ height: "clamp(260px, 45vw, 560px)" }}>
        <VideoBlock src={humanBig} />
      </section>

      {/* ── 5. Philosophy — text left ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-8 sm:gap-16 items-start">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-5">
              What We Stand For
            </p>
            <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed">
              We believe commerce should feel honest. Prices are clear. Returns are fair.
              The brands we carry are chosen for quality, not margin. And when something
              doesn't meet that standard, it comes off the site — quietly, without fanfare.
            </p>
            <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed">
              We're also mindful of the bigger picture. We favour brands that are building
              responsibly — reducing waste, paying their workers fairly, and thinking past
              the next season. Not every brand we carry is perfect, but all of them are
              trying.
            </p>
          </div>
          {/* Right: pull quote */}
          <div className="sm:pt-1">
            <div className="border-l-2 border-gray-200 pl-5">
              <p
                className="font-serif font-normal text-gray-700 leading-snug"
                style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
              >
                "We don't list things we wouldn't buy ourselves."
              </p>
              <p className="text-[11px] text-gray-400 mt-3 tracking-wide">— Crescita founding principle</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Two portrait photos + text ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Photos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="overflow-hidden bg-gray-100" style={{ aspectRatio: "3/4" }}>
              <VideoBlock src={womenBig} />
            </div>
            <div className="overflow-hidden bg-gray-100 mt-8" style={{ aspectRatio: "3/4" }}>
              <VideoBlock src={fashionBig} className="h-full" />
            </div>
          </div>

          {/* Text */}
          <div className="sm:pl-6 sm:pt-6 space-y-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-4">
              The Crescita Edit
            </p>
            <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed">
              Each season our team revisits the catalogue. Some products stay for years —
              those are our classics. Others rotate as new brands catch our eye or existing
              ones raise their standards. Nothing stays on the site by default.
            </p>
            <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed">
              Fashion. Beauty. Home & Living. Three categories that touch daily life
              differently but share the same requirement: they have to be genuinely good.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("/products")}
                className="text-[11px] tracking-[0.14em] uppercase text-gray-900 border-b border-gray-900 pb-px hover:text-gray-400 hover:border-gray-400 transition-colors"
              >
                Explore the Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Thin divider ── */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-4">
        <div className="h-px bg-gray-100 w-full" />
      </div>

      {/* ── 8. Team grid ── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-12">
        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-10">
          Team / People
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
          {TEAM.map((member) => (
            <div key={member.name}>
              {/* Avatar photo placeholder — editorial greyscale feel */}
              <div
                className="w-full mb-3 overflow-hidden"
                style={{
                  aspectRatio: "3/4",
                  background: member.bg,
                  filter: "grayscale(20%)",
                }}
              >
                {/* Initials as editorial placeholder */}
                <div className="w-full h-full flex items-end p-4">
                  <span
                    className="font-serif text-[2.5rem] sm:text-[3rem] font-light leading-none text-gray-400/50 select-none"
                  >
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              </div>
              <p className="text-[13px] font-medium text-gray-800">{member.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. Bottom thin rule + closing line ── */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-16 pt-4">
        <div className="h-px bg-gray-100 w-full mb-10" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <p className="text-[13px] text-gray-400 leading-relaxed max-w-sm">
            Crescita is independently owned and operated.<br />
            Built with care in India.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="group inline-flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-gray-900 border border-gray-900 px-6 py-3 hover:bg-gray-900 hover:text-white transition-all duration-300 mt-2"
          >
            Shop the Collection
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>


      {/* ══════════════════════════════════════
          7. SPLIT — VIDEO LEFT + TEXT RIGHT
      ══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 pb-20 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Video */}
          <div className="overflow-hidden bg-gray-100" style={{ aspectRatio: "4/5" } as React.CSSProperties}>
            <video src={womenBig} />
           </div>
          {/* Text */}
          <div className="space-y-6">
            {/* <Reveal> */}
            <p className="text-[10px] tracking-[0.22em] uppercase text-gray-400">The Crescita Edit</p>
            {/* </Reveal> */}
            {/* <Reveal delay={80}> */}
            <p
              className="text-gray-900 leading-[1.25]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                fontWeight: 400,
              }}
            >
              Each season we revisit every product in the catalogue.
            </p>
            {/* </Reveal> */}
            {/* <Reveal delay={160}> */}
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Some products stay for years — those are our classics. Others rotate as
              new brands catch our eye or raise their standards. Nothing stays on the
              site by default. If it doesn't still earn its place, it goes.
            </p>
            {/* </Reveal> */}
            {/* <Reveal delay={220}> */}
            <p className="text-[14px] text-gray-400 leading-relaxed">
              Fashion. Beauty. Home & Living. Three categories that touch daily life
              differently but share one requirement: they have to be genuinely good.
            </p>
            {/* </Reveal> */}
            {/* <Reveal delay={280}> */}
            <button
              onClick={() => navigate("/products")}
              className="group inline-flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-gray-900 border border-gray-900 px-6 py-3 hover:bg-gray-900 hover:text-white transition-all duration-300 mt-2"
            >
              Shop the Collection
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
            {/* </Reveal> */}
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;

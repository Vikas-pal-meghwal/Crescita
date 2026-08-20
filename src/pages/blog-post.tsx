import { useParams, useNavigate } from "react-router-dom";
import { loadPosts } from "../data/blog-store";
import type { Section } from "../data/blog-data";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = loadPosts().find((p) => p.slug === slug);
  const others = loadPosts().filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center gap-4">
        <p
          className="text-[1.8rem] text-gray-300 font-normal"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Story not found
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="text-[11px] tracking-[0.18em] uppercase text-gray-500 hover:text-gray-900 transition-colors border-b border-gray-300 pb-px"
        >
          Back to Journal
        </button>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">

      {/* ══════════════════════════════════════
          HERO — full-bleed image with overlay
      ══════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ height: "92vh", minHeight: "520px" }}>
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 35%" }}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* back button — top left */}
        <button
          onClick={() => navigate("/blog")}
          className="absolute top-7 left-6 sm:left-10 z-10 inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Journal
        </button>

        {/* Hero text — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-12 lg:px-20 pb-12 sm:pb-16">
          {/* tag + num */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[9px] font-mono tracking-[0.18em] text-white/40">N°{post.num}</span>
            <span className="w-5 h-px bg-white/20" />
            <span className="text-[9px] tracking-[0.24em] uppercase text-white/60 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {post.tag}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-[2.4rem] sm:text-[3.6rem] lg:text-[4.4rem] font-normal text-white leading-[1.1] tracking-[-0.02em] max-w-5xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h1>

          {/* By-line */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[12px] font-medium text-white/80">{post.author}</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-[11px] text-white/50">{post.date}</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-white/50">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
              {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BODY — two-column on desktop
          Left: sticky sidebar  |  Right: article
      ══════════════════════════════════════ */}
      <div className="w-full px-6 sm:px-12 lg:px-20 py-12 sm:py-16">
        <div className="flex gap-16 xl:gap-24 max-w-screen-xl mx-auto">

          {/* ── Sidebar (desktop only) ── */}
          <aside className="hidden lg:flex flex-col gap-6 w-[200px] xl:w-[220px] shrink-0 pt-1">
            <div className="sticky top-28">
              {/* Excerpt */}
              <p className="text-[12px] text-gray-400 leading-[1.8] font-light border-l-2 border-gray-100 pl-4 mb-8">
                {post.excerpt}
              </p>

              {/* Divider */}
              <div className="w-8 h-px bg-gray-100 mb-8" />

              {/* Share label */}
              <p className="text-[9px] tracking-[0.22em] uppercase text-gray-300 mb-4">Share</p>
              <div className="flex flex-col gap-2">
                {["Twitter / X", "LinkedIn", "Copy link"].map((label) => (
                  <button
                    key={label}
                    className="text-left text-[11px] text-gray-400 hover:text-gray-900 transition-colors tracking-wide"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Article body ── */}
          <article className="flex-1 min-w-0 max-w-[780px]">

            {/* Lead / excerpt (mobile only) */}
            <p className="lg:hidden text-[16px] text-gray-500 leading-[1.75] font-light border-l-[3px] border-gray-100 pl-4 mb-10">
              {post.excerpt}
            </p>

            {/* Content blocks */}
            <div>
              {post.content.map((section: Section, i: number) => (
                <ContentBlock key={i} section={section} />
              ))}
            </div>

            {/* End mark */}
            <div className="flex items-center gap-4 mt-16 pt-8 border-t border-gray-100">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[9px] tracking-[0.28em] uppercase text-gray-300">End of story</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
          </article>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MORE STORIES — full width grid
      ══════════════════════════════════════ */}
      {others.length > 0 && (
        <div className="bg-[#fafaf9] border-t border-gray-100 px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-1">Continue reading</p>
                <h2
                  className="text-[1.6rem] font-normal text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  More from the Journal
                </h2>
              </div>
              <button
                onClick={() => navigate("/blog")}
                className="hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-gray-400 hover:text-gray-900 transition-colors border-b border-gray-200 pb-px"
              >
                All stories
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {others.map((other) => (
                <article
                  key={other.slug}
                  onClick={() => navigate(`/blog/${other.slug}`)}
                  className="group cursor-pointer"
                >
                  <div className="overflow-hidden rounded-sm mb-4" style={{ aspectRatio: "16/10" }}>
                    <img
                      src={other.image}
                      alt={other.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-[9px] font-mono tracking-[0.15em] text-gray-300">N°{other.num}</span>
                    <span className="w-5 h-px bg-gray-200" />
                    <span className="text-[9px] tracking-[0.18em] uppercase text-gray-400">{other.tag}</span>
                  </div>
                  <h3
                    className="text-[1.05rem] sm:text-[1.1rem] font-normal text-gray-900 leading-snug mb-2 group-hover:text-gray-600 transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {other.title}
                  </h3>
                  <p className="text-[12px] text-gray-400 leading-relaxed mb-3 line-clamp-2">
                    {other.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-gray-400 group-hover:text-gray-900 transition-colors">
                    {other.readTime}
                    <svg className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

/* ══════════════════════════════════════
   Content block renderer
══════════════════════════════════════ */
const ContentBlock = ({ section }: { section: Section }) => {
  switch (section.type) {

    case "paragraph":
      return (
        <p className="text-[16px] sm:text-[17px] text-gray-600 leading-[1.95] font-light mt-6 first:mt-0">
          {section.text}
        </p>
      );

    case "heading":
      return (
        <h2
          className="text-[1.4rem] sm:text-[1.65rem] font-normal text-gray-900 leading-snug mt-12 mb-2 tracking-[-0.01em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {section.text}
        </h2>
      );

    case "list":
      return (
        <ul className="mt-6 space-y-3.5 pl-0">
          {section.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-4 text-[15.5px] sm:text-[16px] text-gray-500 leading-[1.8] font-light"
            >
              <span className="mt-[10px] w-[5px] h-[5px] rounded-full bg-gray-200 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="relative my-12 py-8 px-10 bg-[#fafaf9] border-l-[3px] border-gray-800 rounded-r-sm">
          <span
            className="absolute top-3 left-6 text-[5rem] leading-none text-gray-100 select-none pointer-events-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
            aria-hidden
          >
            "
          </span>
          <p
            className="relative text-[1.15rem] sm:text-[1.3rem] font-normal text-gray-800 leading-[1.7] italic pt-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {section.text}
          </p>
          {section.attribution && (
            <cite className="block mt-4 text-[10px] tracking-[0.2em] uppercase text-gray-400 not-italic font-normal">
              — {section.attribution}
            </cite>
          )}
        </blockquote>
      );

    case "image":
      return (
        <figure className="my-10 -mx-6 sm:-mx-12 lg:-mx-0">
          <img
            src={section.src}
            alt={section.caption ?? ""}
            className="w-full object-cover"
          />
          {section.caption && (
            <figcaption className="mt-3 text-center text-[11px] text-gray-400 tracking-[0.08em] px-6">
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
};

export default BlogPost;

import { useNavigate } from "react-router-dom";
import { loadPosts } from "../data/blog-store";

const BLOG_POSTS = loadPosts();

const Blog = () => {
  const navigate = useNavigate();
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <main className="bg-[#fafaf9] min-h-screen">
      {/* ── Page Header ── */}
      <div className="border-b border-gray-100 bg-white px-4 sm:px-10 lg:px-20 py-10 sm:py-14">
        <p className="text-[9px] tracking-[0.28em] uppercase text-gray-400 mb-3">
          Crescita Stories
        </p>
        <h1
          className="text-[2.2rem] sm:text-[3.2rem] font-normal text-gray-900 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          From the Journal
        </h1>
        <p className="mt-3 text-[13px] text-gray-400 max-w-md leading-relaxed">
          Style guides, beauty rituals, and home ideas — stories to inspire your everyday.
        </p>
      </div>

      <div className="px-4 sm:px-10 lg:px-20 py-10 sm:py-14">

        {/* ── Featured Post ── */}
        <article
          onClick={() => navigate(`/blog/${featured.slug}`)}
          className="group cursor-pointer mb-14 sm:mb-20 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-14 items-center"
        >
          <div className="overflow-hidden rounded-sm" style={{ aspectRatio: "4/3" }}>
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] font-mono tracking-[0.15em] text-gray-300">
                N°{featured.num}
              </span>
              <span className="w-6 h-px bg-gray-200" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-gray-400">
                {featured.tag}
              </span>
            </div>
            <h2
              className="text-[1.6rem] sm:text-[2rem] font-normal text-gray-900 leading-snug mb-4 group-hover:text-gray-600 transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {featured.title}
            </h2>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-6 max-w-sm">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-4 text-[10px] text-gray-400">
              <span className="tracking-[0.12em] uppercase">{featured.readTime}</span>
              <span>·</span>
              <span>{featured.date}</span>
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-gray-900 border-b border-gray-300 pb-px group-hover:border-gray-600 transition-colors">
              Read story
              <svg className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </article>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[9px] tracking-[0.22em] uppercase text-gray-300">More Stories</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* ── Rest of Posts ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rest.map((post) => (
            <article
              key={post.slug}
              onClick={() => navigate(`/blog/${post.slug}`)}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-sm mb-4" style={{ aspectRatio: "4/3" }}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-[9px] font-mono tracking-[0.15em] text-gray-300">
                  N°{post.num}
                </span>
                <span className="w-6 h-px bg-gray-200" />
                <span className="text-[9px] tracking-[0.18em] uppercase text-gray-400">
                  {post.tag}
                </span>
              </div>
              <h3
                className="text-[1rem] sm:text-[1.1rem] font-normal text-gray-900 leading-snug mb-2 group-hover:text-gray-600 transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {post.title}
              </h3>
              <p className="text-[12px] text-gray-400 leading-relaxed mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-gray-400 group-hover:text-gray-900 transition-colors">
                {post.readTime}
                <svg className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;

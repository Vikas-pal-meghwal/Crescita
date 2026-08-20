import { useNavigate } from "react-router-dom";
import { BLOG_POSTS } from "../../data/blog-data";

const POSTS = BLOG_POSTS.map((p) => ({
  num: p.num,
  tag: p.tag,
  title: p.title,
  excerpt: p.excerpt,
  readTime: p.readTime,
  image: p.image,
  link: `/blog/${p.slug}`,
}));

const Journal = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#fafaf9]">

      {/* Header */}
      <div className="flex items-end justify-between mb-8 sm:mb-10">
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">
            Crescita Stories
          </p>
          <h2
            className="text-[1.8rem] sm:text-[2.4rem] font-normal leading-tight text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            From the Journal
          </h2>
        </div>
        <button
          onClick={() => navigate("/blog")}
          className="hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-gray-400 hover:text-gray-900 transition-colors pb-1"
        >
          All stories
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {POSTS.map((post) => (
          <article
            key={post.num}
            onClick={() => navigate(post.link)}
            className="group cursor-pointer"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-sm mb-4" style={{ aspectRatio: "4/3" }}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[9px] font-mono tracking-[0.15em] text-gray-300">
                N°{post.num}
              </span>
              <span className="w-6 h-px bg-gray-200" />
              <span className="text-[9px] tracking-[0.18em] uppercase text-gray-400">
                {post.tag}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-[1rem] sm:text-[1.1rem] font-normal text-gray-900 leading-snug mb-2 group-hover:text-gray-600 transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-[12px] text-gray-400 leading-relaxed mb-3 line-clamp-2">
              {post.excerpt}
            </p>

            {/* Read more */}
            <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-gray-400 group-hover:text-gray-900 transition-colors">
              {post.readTime}
              <svg className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Journal;

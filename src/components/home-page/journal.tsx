import { useNavigate } from "react-router-dom";

const POSTS = [
  {
    num: "01",
    tag: "Style Guide",
    title: "10 Wardrobe Essentials You Need This Season",
    excerpt:
      "Build a capsule wardrobe that works year-round with these timeless, versatile pieces.",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80&crop=center",
    link: "/products?category=Fashion",
  },
  {
    num: "02",
    tag: "Beauty Tips",
    title: "Your Morning Skincare Routine, Simplified",
    excerpt:
      "Less is more — the five products that dermatologists actually recommend every day.",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop&q=80&crop=center",
    link: "/products?category=Beauty",
  },
  {
    num: "03",
    tag: "Home Decor",
    title: "How to Style Your Living Room Like a Pro",
    excerpt:
      "Small changes, big impact — interior tricks that transform any space without a renovation.",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1729811985748-9e248b1517d8?q=80&w=1268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/products?category=Home+%26+Living",
  },
];

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

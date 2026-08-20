export interface BlogPost {
  slug: string;
  num: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  date: string;
  author: string;
  content: Section[];
}

export type Section =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; src: string; caption?: string };

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "10-wardrobe-essentials",
    num: "01",
    tag: "Style Guide",
    title: "10 Wardrobe Essentials You Need This Season",
    excerpt:
      "Build a capsule wardrobe that works year-round with these timeless, versatile pieces.",
    readTime: "4 min read",
    date: "August 12, 2026",
    author: "Crescita Editorial",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80",
    content: [
      {
        type: "paragraph",
        text: "A capsule wardrobe isn't about owning less — it's about owning better. The right ten pieces can carry you from Monday morning meetings to weekend getaways without a second thought about what to wear.",
      },
      {
        type: "heading",
        text: "1. The Crisp White Shirt",
      },
      {
        type: "paragraph",
        text: "Nothing cuts through styling dilemmas faster than a well-fitted white shirt. Tuck it into tailored trousers for boardroom energy, or leave it open over a slip dress for weekend ease. Look for 100% cotton or a cotton-linen blend — it breathes, irons beautifully, and only gets better with age.",
      },
      {
        type: "heading",
        text: "2. High-Waist Straight-Leg Jeans",
      },
      {
        type: "paragraph",
        text: "The straight-leg silhouette flatters every body type and transitions effortlessly from casual to smart-casual. A dark indigo wash is the most versatile — pair with sneakers for day, swap to block heels for evening.",
      },
      {
        type: "quote",
        text: "Style is a way to say who you are without having to speak.",
        attribution: "Rachel Zoe",
      },
      {
        type: "heading",
        text: "3. A Tailored Blazer",
      },
      {
        type: "paragraph",
        text: "One well-cut blazer does the work of three jackets. Choose a neutral — camel, charcoal, or ivory — and watch it elevate jeans, dresses, and even tracksuit bottoms into a considered look.",
      },
      {
        type: "heading",
        text: "4. The Little Black Dress",
      },
      {
        type: "paragraph",
        text: "Simple, structured, and endlessly re-styleable. Opt for a midi length in a matte fabric — it photographs beautifully and flatters in every season.",
      },
      {
        type: "heading",
        text: "5. Quality Knitwear",
      },
      {
        type: "paragraph",
        text: "A merino or cashmere-blend crew neck in a neutral tone is the workhorse of cold-weather dressing. Layer it under a shirt collar for a preppy look, or wear it solo tucked into a midi skirt.",
      },
      {
        type: "list",
        items: [
          "Crisp white shirt",
          "High-waist straight-leg jeans",
          "Tailored blazer in a neutral",
          "Little black dress (midi length)",
          "Quality knitwear in neutral tones",
          "Trench coat",
          "Slip skirt",
          "White sneakers",
          "Leather belt",
          "Classic ankle boots",
        ],
      },
      {
        type: "paragraph",
        text: "The secret to making this list work is resisting the urge to buy trendy versions. Classics age forward — trends age out. Invest slowly, care well, wear often.",
      },
    ],
  },
  {
    slug: "morning-skincare-routine",
    num: "02",
    tag: "Beauty Tips",
    title: "Your Morning Skincare Routine, Simplified",
    excerpt:
      "Less is more — the five products that dermatologists actually recommend every day.",
    readTime: "3 min read",
    date: "August 5, 2026",
    author: "Crescita Beauty Desk",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&auto=format&fit=crop&q=80",
    content: [
      {
        type: "paragraph",
        text: "The skincare industry thrives on complexity. Twelve-step routines, layering rules, and ingredient stacking can feel more like chemistry homework than self-care. But dermatologists have been saying the same thing for decades: a great morning routine needs only five things.",
      },
      {
        type: "heading",
        text: "Step 1 — Gentle Cleanser",
      },
      {
        type: "paragraph",
        text: "Your skin repairs itself overnight. A gentle, low-pH cleanser removes sweat and any overnight products without stripping the barrier. Avoid foaming cleansers with sulfates if your skin leans dry or sensitive.",
      },
      {
        type: "heading",
        text: "Step 2 — Vitamin C Serum",
      },
      {
        type: "paragraph",
        text: "L-ascorbic acid at 10–15% concentration is the gold standard for brightening and antioxidant protection. Apply it after cleansing on dry skin, wait 60 seconds, then move on. It amplifies your SPF's protective effect significantly.",
      },
      {
        type: "quote",
        text: "The best skincare routine is one you actually stick to.",
        attribution: "Dr. Shereene Idriss, Dermatologist",
      },
      {
        type: "heading",
        text: "Step 3 — Moisturiser",
      },
      {
        type: "paragraph",
        text: "Hydration seals in your serum and fortifies your barrier. Choose a formula with ceramides, hyaluronic acid, or niacinamide depending on your skin's primary concern. You don't need a separate eye cream — a well-formulated moisturiser applied gently around the eye area does the same job.",
      },
      {
        type: "heading",
        text: "Step 4 — SPF 30+ (Non-Negotiable)",
      },
      {
        type: "paragraph",
        text: "Sun damage is responsible for 90% of visible skin ageing. A broad-spectrum SPF 30 or higher — applied as the last step — is the single highest-ROI skincare product you own. Mineral (zinc oxide) formulas are ideal for sensitive skin; chemical filters tend to sit more elegantly under makeup.",
      },
      {
        type: "list",
        items: [
          "Gentle low-pH cleanser",
          "Vitamin C serum (10–15% L-ascorbic acid)",
          "Lightweight moisturiser with ceramides",
          "Broad-spectrum SPF 30+",
          "Lip balm with SPF (often forgotten)",
        ],
      },
      {
        type: "paragraph",
        text: "That's it. Consistency over complexity. The same five products used diligently for six months will outperform a complicated routine you abandon by week three.",
      },
    ],
  },
  {
    slug: "style-living-room-like-a-pro",
    num: "03",
    tag: "Home Decor",
    title: "How to Style Your Living Room Like a Pro",
    excerpt:
      "Small changes, big impact — interior tricks that transform any space without a renovation.",
    readTime: "5 min read",
    date: "July 28, 2026",
    author: "Crescita Living",
    image:
      "https://images.unsplash.com/photo-1729811985748-9e248b1517d8?q=80&w=1268&auto=format&fit=crop",
    content: [
      {
        type: "paragraph",
        text: "Interior designers work with the same walls, floors, and furniture the rest of us have. What separates a pulled-together room from a chaotic one isn't budget — it's a handful of principles applied consistently.",
      },
      {
        type: "heading",
        text: "Start With a Grounding Rug",
      },
      {
        type: "paragraph",
        text: "The single most impactful change you can make in a living room is adding — or replacing — a rug. A rug anchors your seating arrangement and signals to the eye where the 'room' begins and ends. The most common mistake: buying too small. Your sofa's front legs should sit on the rug at minimum; all legs on for a more luxurious feel.",
      },
      {
        type: "heading",
        text: "Layer Your Lighting",
      },
      {
        type: "paragraph",
        text: "Overhead lighting is a ceiling's worst gift to a living room — it's flat, harsh, and creates no atmosphere. Layer three types: ambient (overhead or floor lamp), task (reading lamp), and accent (candles, picture lights, or LED strips behind a TV unit). Switch off the overhead after 6 pm and notice the transformation.",
      },
      {
        type: "quote",
        text: "A room should feel collected, not decorated.",
        attribution: "Sister Parish, Interior Designer",
      },
      {
        type: "heading",
        text: "The 60-30-10 Colour Rule",
      },
      {
        type: "paragraph",
        text: "60% of your room should be a dominant colour (walls, large sofa), 30% a secondary colour (curtains, accent chair, rug), and 10% an accent (cushions, vase, artwork). This ratio creates balance without flatness.",
      },
      {
        type: "heading",
        text: "Odd Numbers Win",
      },
      {
        type: "paragraph",
        text: "When grouping objects — books on a shelf, candles on a coffee table, cushions on a sofa — odd numbers create visual interest. Three or five items in a vignette feel curated; even numbers feel corporate.",
      },
      {
        type: "heading",
        text: "Bring in Something Living",
      },
      {
        type: "paragraph",
        text: "Plants, fresh flowers, or even a bowl of seasonal fruit add organic texture that no decor item can replicate. A single large-leaf plant (a monstera, fiddle-leaf fig, or pothos) in a terracotta or stone pot is worth more to a room's warmth than a dozen throw pillows.",
      },
      {
        type: "list",
        items: [
          "Size up your rug — most people go too small",
          "Layer three light sources, eliminate harsh overhead",
          "Apply the 60-30-10 colour rule",
          "Group objects in threes or fives",
          "Add one large plant in a quality planter",
          "Edit ruthlessly — empty space is not wasted space",
        ],
      },
      {
        type: "paragraph",
        text: "The most beautiful rooms always have one thing in common: they look like someone actually lives in them. Don't style your living room for a photograph. Style it for Tuesday evening.",
      },
    ],
  },
];

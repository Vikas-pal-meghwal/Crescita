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
      { type: "heading", text: "1. The Crisp White Shirt" },
      {
        type: "paragraph",
        text: "Nothing cuts through styling dilemmas faster than a well-fitted white shirt. Tuck it into tailored trousers for boardroom energy, or leave it open over a slip dress for weekend ease. Look for 100% cotton or a cotton-linen blend — it breathes, irons beautifully, and only gets better with age.",
      },
      { type: "heading", text: "2. High-Waist Straight-Leg Jeans" },
      {
        type: "paragraph",
        text: "The straight-leg silhouette flatters every body type and transitions effortlessly from casual to smart-casual. A dark indigo wash is the most versatile — pair with sneakers for day, swap to block heels for evening.",
      },
      { type: "quote", text: "Style is a way to say who you are without having to speak.", attribution: "Rachel Zoe" },
      { type: "heading", text: "3. A Tailored Blazer" },
      {
        type: "paragraph",
        text: "One well-cut blazer does the work of three jackets. Choose a neutral — camel, charcoal, or ivory — and watch it elevate jeans, dresses, and even tracksuit bottoms into a considered look.",
      },
      { type: "heading", text: "4. The Little Black Dress" },
      {
        type: "paragraph",
        text: "Simple, structured, and endlessly re-styleable. Opt for a midi length in a matte fabric — it photographs beautifully and flatters in every season.",
      },
      { type: "heading", text: "5. Quality Knitwear" },
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
      { type: "heading", text: "Step 1 — Gentle Cleanser" },
      {
        type: "paragraph",
        text: "Your skin repairs itself overnight. A gentle, low-pH cleanser removes sweat and any overnight products without stripping the barrier. Avoid foaming cleansers with sulfates if your skin leans dry or sensitive.",
      },
      { type: "heading", text: "Step 2 — Vitamin C Serum" },
      {
        type: "paragraph",
        text: "L-ascorbic acid at 10–15% concentration is the gold standard for brightening and antioxidant protection. Apply it after cleansing on dry skin, wait 60 seconds, then move on. It amplifies your SPF's protective effect significantly.",
      },
      { type: "quote", text: "The best skincare routine is one you actually stick to.", attribution: "Dr. Shereene Idriss, Dermatologist" },
      { type: "heading", text: "Step 3 — Moisturiser" },
      {
        type: "paragraph",
        text: "Hydration seals in your serum and fortifies your barrier. Choose a formula with ceramides, hyaluronic acid, or niacinamide depending on your skin's primary concern. You don't need a separate eye cream — a well-formulated moisturiser applied gently around the eye area does the same job.",
      },
      { type: "heading", text: "Step 4 — SPF 30+ (Non-Negotiable)" },
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
      { type: "heading", text: "Start With a Grounding Rug" },
      {
        type: "paragraph",
        text: "The single most impactful change you can make in a living room is adding — or replacing — a rug. A rug anchors your seating arrangement and signals to the eye where the 'room' begins and ends. The most common mistake: buying too small. Your sofa's front legs should sit on the rug at minimum; all legs on for a more luxurious feel.",
      },
      { type: "heading", text: "Layer Your Lighting" },
      {
        type: "paragraph",
        text: "Overhead lighting is a ceiling's worst gift to a living room — it's flat, harsh, and creates no atmosphere. Layer three types: ambient (overhead or floor lamp), task (reading lamp), and accent (candles, picture lights, or LED strips behind a TV unit). Switch off the overhead after 6 pm and notice the transformation.",
      },
      { type: "quote", text: "A room should feel collected, not decorated.", attribution: "Sister Parish, Interior Designer" },
      { type: "heading", text: "The 60-30-10 Colour Rule" },
      {
        type: "paragraph",
        text: "60% of your room should be a dominant colour (walls, large sofa), 30% a secondary colour (curtains, accent chair, rug), and 10% an accent (cushions, vase, artwork). This ratio creates balance without flatness.",
      },
      { type: "heading", text: "Odd Numbers Win" },
      {
        type: "paragraph",
        text: "When grouping objects — books on a shelf, candles on a coffee table, cushions on a sofa — odd numbers create visual interest. Three or five items in a vignette feel curated; even numbers feel corporate.",
      },
      { type: "heading", text: "Bring in Something Living" },
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

  /* ── Post 04 ── */
  {
    slug: "perfume-guide-for-beginners",
    num: "04",
    tag: "Beauty Tips",
    title: "How to Find Your Signature Scent",
    excerpt:
      "Fragrance is the most personal luxury — here's how to navigate the counter without getting overwhelmed.",
    readTime: "4 min read",
    date: "July 20, 2026",
    author: "Crescita Beauty Desk",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&auto=format&fit=crop&q=80",
    content: [
      {
        type: "paragraph",
        text: "Choosing a perfume online, or even in a store, can feel impossibly overwhelming. Hundreds of bottles, abstract descriptions, and a nose that goes numb after three sprays. But fragrance shopping has a logic to it — once you understand the structure, it becomes one of the most enjoyable things you can buy for yourself.",
      },
      { type: "heading", text: "Understand the Fragrance Pyramid" },
      {
        type: "paragraph",
        text: "Every perfume has three layers. Top notes are what you smell in the first 15 minutes — usually citrus, herbs, or light florals. Heart notes emerge as the top notes fade and define the character of the fragrance — rose, jasmine, spice. Base notes are what linger for hours — woods, musks, resins, vanilla. When testing a fragrance, always wait for the dry-down before deciding.",
      },
      { type: "heading", text: "The Four Main Families" },
      {
        type: "list",
        items: [
          "Floral — rose, jasmine, peony. Romantic and feminine, but incredibly varied",
          "Oriental / Amber — vanilla, oud, incense. Warm, rich, and long-lasting",
          "Fresh / Citrus — bergamot, neroli, green tea. Light and energising, ideal for daytime",
          "Woody / Chypre — cedar, vetiver, patchouli. Grounding, earthy, unisex",
        ],
      },
      {
        type: "quote",
        text: "A woman who doesn't wear perfume has no future.",
        attribution: "Coco Chanel",
      },
      { type: "heading", text: "Test Smart, Not Fast" },
      {
        type: "paragraph",
        text: "Spray on skin, not paper. Your skin chemistry changes how a fragrance smells on you versus someone else. Test a maximum of three fragrances per visit. Come back later in the day and smell the one that's still interesting — that's the one to buy.",
      },
      { type: "heading", text: "Where to Apply It" },
      {
        type: "paragraph",
        text: "Pulse points — wrists, neck, inner elbows, behind knees — are warm and radiate scent outward. Don't rub your wrists together after spraying; it crushes the top notes and distorts the fragrance's intended arc.",
      },
      {
        type: "paragraph",
        text: "Your signature scent isn't always the one that smells best in the bottle. It's the one that still smells like you, six hours later.",
      },
    ],
  },

  /* ── Post 05 ── */
  {
    slug: "mens-style-basics",
    num: "05",
    tag: "Style Guide",
    title: "The Men's Style Basics Nobody Tells You About",
    excerpt:
      "Fit, fabric, and a few rules that quietly separate well-dressed men from everyone else.",
    readTime: "5 min read",
    date: "July 14, 2026",
    author: "Crescita Editorial",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80",
    content: [
      {
        type: "paragraph",
        text: "Most men's style advice starts with 'buy these items.' That's the wrong place to begin. The real fundamentals aren't about what you own — they're about how you wear it, how it fits, and what it's made of.",
      },
      {
        type: "quote",
        text: "Elegance is not about being noticed, it's about being remembered.",
        attribution: "Giorgio Armani",
      },
      { type: "heading", text: "Fit Is Everything" },
      {
        type: "paragraph",
        text: "A ₹500 t-shirt that fits perfectly will always look better than a ₹5,000 shirt that doesn't. Shoulders should sit at the shoulder seam. Trousers should break lightly at the shoe. Jacket sleeves should show a centimetre of shirt cuff. These aren't rules — they're the baseline your eye has already been trained to expect.",
      },
      { type: "heading", text: "Fabric Before Colour" },
      {
        type: "paragraph",
        text: "Cheap fabric photographs and wears badly. Before you think about colour or pattern, ask what the garment is made of. Cotton, linen, wool, and their blends age well and look more expensive than synthetics at any price point. Polyester can work in structured pieces (a suit lining, a technical jacket) but rarely in anything that sits close to the body.",
      },
      { type: "heading", text: "Build From Neutral" },
      {
        type: "paragraph",
        text: "Start with navy, grey, white, and tan. These four neutrals work with almost anything and make getting dressed in the morning genuinely fast. Once your wardrobe base is solid, add two or three accent pieces in bolder tones — burgundy, forest green, rust — that still coordinate with your neutral foundation.",
      },
      {
        type: "list",
        items: [
          "One pair of dark indigo or black jeans — no distressing",
          "A navy or grey crewneck sweatshirt in heavyweight cotton",
          "White and grey t-shirts in slim or regular fit",
          "Chinos in tan or olive",
          "A leather or suede Chelsea boot — the most versatile men's shoe",
          "One quality watch with a leather or NATO strap",
        ],
      },
      { type: "heading", text: "The One Piece Rule" },
      {
        type: "paragraph",
        text: "Let one piece of your outfit lead. If you're wearing a great jacket, keep everything else simple. If you have interesting trousers, wear a plain top. Trying to make every item the hero creates visual noise. The best outfits have one moment — everything else supports it.",
      },
    ],
  },

  /* ── Post 06 ── */
  {
    slug: "bedroom-refresh-ideas",
    num: "06",
    tag: "Home Decor",
    title: "5 Weekend Changes That Will Transform Your Bedroom",
    excerpt:
      "No contractor, no major spend — just five thoughtful moves that make a bedroom feel like a retreat.",
    readTime: "4 min read",
    date: "July 7, 2026",
    author: "Crescita Living",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&auto=format&fit=crop&q=80",
    content: [
      {
        type: "paragraph",
        text: "The bedroom is the most personal room in the house and usually the most neglected when it comes to intentional styling. We sleep in it, but we rarely think about how it feels to be in it. Five changes — none of which require a contractor — can shift a functional room into something that actually restores you.",
      },
      { type: "heading", text: "1. Invest in One Great Pillow" },
      {
        type: "paragraph",
        text: "Most people have too many decorative pillows and the wrong sleeping pillow. A single high-quality pillow — down alternative at medium firmness for most sleepers — changes the quality of sleep immediately. Strip the decorative pile down to two or three with matching cases in a linen or cotton percale.",
      },
      { type: "heading", text: "2. Swap Your Overhead Bulb" },
      {
        type: "paragraph",
        text: "Bedrooms almost never need bright white overhead light. Replace it with a warm-toned LED (2700K or lower) and add a bedside lamp with a dimmer. The shift in atmosphere is immediate and costs less than a dinner out.",
      },
      {
        type: "quote",
        text: "The details are not the details. They make the design.",
        attribution: "Charles Eames",
      },
      { type: "heading", text: "3. Clear the Floor" },
      {
        type: "paragraph",
        text: "Nothing makes a bedroom feel smaller and more chaotic than a cluttered floor. Give every item on the floor a designated home — a hook, a drawer, a basket — and keep the floor clear for one week. The difference in how the room feels, even without buying a single thing, is significant.",
      },
      { type: "heading", text: "4. Add One Piece of Art at Eye Level" },
      {
        type: "paragraph",
        text: "One framed print or photograph hung at sitting eye level (not standing eye level — bedrooms are experienced horizontally) adds enormous warmth. It doesn't need to be expensive. A well-framed page from a coffee table book, a photograph printed at A3, or a textile hung from a rod all work equally well.",
      },
      { type: "heading", text: "5. Introduce a Scent" },
      {
        type: "paragraph",
        text: "Scent is processed directly by the limbic system — the brain's emotional and memory centre. A consistent, gentle scent in the bedroom (a linen spray, a low-fragrance candle, or a reed diffuser) trains your brain to associate that smell with rest. Lavender, sandalwood, and clean musks are proven relaxants.",
      },
      {
        type: "list",
        items: [
          "Replace overhead bulb with warm 2700K LED",
          "One quality sleeping pillow, two linen pillowcases",
          "Clear the floor completely",
          "One framed artwork at seated eye level",
          "A consistent bedroom scent — reed diffuser or linen spray",
        ],
      },
    ],
  },

  /* ── Post 07 ── */
  {
    slug: "sustainable-fashion-guide",
    num: "07",
    tag: "Lifestyle",
    title: "How to Build a More Sustainable Wardrobe (Without Starting Over)",
    excerpt:
      "You don't need to throw everything out. Sustainable fashion starts with buying less and choosing better.",
    readTime: "6 min read",
    date: "June 30, 2026",
    author: "Crescita Editorial",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop&q=80",
    content: [
      {
        type: "paragraph",
        text: "The fashion industry produces an estimated 92 million tonnes of textile waste per year. It's an overwhelming statistic — and one that often leads people to feel paralysed rather than motivated. The good news: you don't need a perfect wardrobe overhaul. Sustainable fashion is a direction, not a destination.",
      },
      { type: "heading", text: "Start With What You Have" },
      {
        type: "paragraph",
        text: "Before buying anything, do a wardrobe audit. Pull everything out. Separate it into three piles: wear regularly, occasionally, and never. The 'never' pile is your first lesson — these are the purchases that didn't serve you, and understanding why helps you avoid repeating the pattern.",
      },
      {
        type: "quote",
        text: "The most sustainable garment is the one already in your wardrobe.",
        attribution: "Orsola de Castro, Fashion Revolution",
      },
      { type: "heading", text: "The Cost-Per-Wear Framework" },
      {
        type: "paragraph",
        text: "A ₹3,000 t-shirt you wear 200 times costs ₹15 per wear. A ₹800 t-shirt you wear twice costs ₹400 per wear. Sustainable consumption isn't about spending more — it's about buying things you'll actually use, enough times to justify their existence.",
      },
      { type: "heading", text: "Fabric Matters More Than the Label" },
      {
        type: "paragraph",
        text: "A garment from a fast-fashion brand in 100% organic cotton will often last longer and cause less harm than a 'sustainable brand' piece made from a synthetic eco-fabric. Read the label. Look for natural fibres — organic cotton, linen, wool, Tencel — or recycled synthetics if performance is important.",
      },
      { type: "heading", text: "The Five Questions Before Buying" },
      {
        type: "list",
        items: [
          "Do I already own something that does the same job?",
          "Will I wear this at least 30 times?",
          "Does it work with at least five things I already own?",
          "Is the fabric natural, recycled, or at minimum long-lasting?",
          "Am I buying this because I need it, or because it's on sale?",
        ],
      },
      { type: "heading", text: "Care Changes Everything" },
      {
        type: "paragraph",
        text: "Washing less, washing cold, air-drying, and hand-washing delicates extends garment life dramatically. Most clothing damage happens in the wash — agitation, heat, and detergent degrade fibres faster than wearing ever will. Invest in a gentle detergent, a mesh laundry bag for knitwear, and the discipline to read the care label.",
      },
      {
        type: "paragraph",
        text: "Sustainable fashion is fundamentally about paying attention. To what you buy, why you buy it, and how you care for what you have. Start there.",
      },
    ],
  },

  /* ── Post 08 ── */
  {
    slug: "hair-care-routine-for-all-types",
    num: "08",
    tag: "Beauty Tips",
    title: "The Hair Care Routine That Works for Every Type",
    excerpt:
      "Straight, wavy, curly, or coily — the principles of healthy hair are the same. The products just differ.",
    readTime: "4 min read",
    date: "June 22, 2026",
    author: "Crescita Beauty Desk",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80",
    content: [
      {
        type: "paragraph",
        text: "Hair care is one of the most personalised routines in beauty — and one of the most over-complicated. The fundamentals of hair health don't change based on texture: moisture, protein balance, minimal mechanical damage, and scalp health. What changes is how you achieve those things.",
      },
      { type: "heading", text: "Shampoo Less Than You Think" },
      {
        type: "paragraph",
        text: "Most people shampoo too frequently. Unless you have a very oily scalp or use heavy styling products daily, washing two to three times a week is optimal for most hair types. Over-washing strips the scalp's natural oils, triggering it to produce more oil — a self-defeating cycle. Use a sulfate-free shampoo for colour-treated or dry hair.",
      },
      { type: "heading", text: "Conditioner Is Not Optional" },
      {
        type: "paragraph",
        text: "Conditioner seals the hair cuticle after the slightly alkaline shampoo opens it. Skipping it leaves the cuticle rough, making hair frizzy, tangled, and prone to breakage. Apply from mid-length to ends, leave for two to three minutes, and rinse with cool water to seal the cuticle flat.",
      },
      {
        type: "quote",
        text: "Healthy hair is the best accessory.",
        attribution: "Frédéric Fekkai, Hairstylist",
      },
      { type: "heading", text: "Heat Protection — Every Single Time" },
      {
        type: "paragraph",
        text: "Heat styling above 180°C causes protein degradation in the hair shaft. A heat protectant spray or cream doesn't just protect against surface damage — it slows the cumulative structural damage that makes hair dull and brittle over years. Apply it before every blow-dry, straightening, or curling session. No exceptions.",
      },
      { type: "heading", text: "The Weekly Treatment" },
      {
        type: "paragraph",
        text: "Once a week, a five-minute deep conditioning mask or oil treatment makes a compounding difference over months. For fine hair: lightweight protein treatments. For thick or coarse hair: heavy moisture masks with shea butter or avocado oil. For curly or coily hair: the LOC method (liquid, oil, cream) applied after washing keeps moisture locked in.",
      },
      {
        type: "list",
        items: [
          "Shampoo 2–3 times a week maximum",
          "Always condition from mid-length to ends",
          "Rinse with cool water to seal the cuticle",
          "Use heat protectant before any heat styling",
          "Weekly mask or oil treatment",
          "Sleep on a silk or satin pillowcase to reduce friction",
        ],
      },
    ],
  },
];

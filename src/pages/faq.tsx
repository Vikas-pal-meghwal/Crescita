import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Truck,
  RotateCcw,
  CreditCard,
  Shirt,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Mail,
  Phone,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popular?: boolean;
  tags?: string[];
}

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "orders", label: "Orders & Shipping", icon: Truck },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
  { id: "payments", label: "Payments & Pricing", icon: CreditCard },
  { id: "products", label: "Products & Sizing", icon: Shirt },
  { id: "account", label: "Account & Security", icon: ShieldCheck },
  { id: "care", label: "Care & Sustainability", icon: Sparkles },
];

const FAQ_DATA: FAQItem[] = [
  {
    id: "track-order",
    category: "orders",
    popular: true,
    question: "How can I track my order status in real-time?",
    answer:
      "Once your order has been dispatched, you will receive a confirmation email and SMS containing a tracking link. You can also view live delivery milestones under your Account > Orders section.",
    tags: ["tracking", "delivery", "shipping", "courier"],
  },
  {
    id: "delivery-timelines",
    category: "orders",
    popular: true,
    question: "What are the standard delivery timelines and shipping charges?",
    answer:
      "We offer complimentary standard express shipping across India on all prepaid orders. Standard delivery typically takes 3–5 business days for metro cities and 5–7 business days for regional locations. Expedited next-day delivery is available in select metropolitan pin codes.",
    tags: ["shipping cost", "delivery time", "express", "free shipping"],
  },
  {
    id: "international-shipping",
    category: "orders",
    question: "Do you ship internationally?",
    answer:
      "Yes, Crescita delivers to over 45 countries worldwide via DHL Express. International shipping rates and estimated customs duties are automatically calculated at checkout based on destination country and parcel weight.",
    tags: ["international", "global", "dhl", "customs"],
  },
  {
    id: "return-policy",
    category: "returns",
    popular: true,
    question: "What is your return and exchange policy?",
    answer:
      "We offer a hassle-free 14-day return and exchange window from the date of delivery. Items must be unused, unwashed, and returned in their original packaging with all garment tags intact. Innerwear, customized pieces, and items marked as Final Sale are non-returnable for hygiene reasons.",
    tags: ["returns", "exchange", "refunds", "14 days"],
  },
  {
    id: "how-to-initiate-return",
    category: "returns",
    question: "How do I initiate a return or exchange?",
    answer:
      "To initiate a return, visit your Account > Orders page, select the specific item, and click 'Request Return / Exchange'. Choose your preferred resolution and schedule a free doorstep pickup at your convenience.",
    tags: ["pickup", "return process", "step by step"],
  },
  {
    id: "refund-timeline",
    category: "returns",
    question: "How long does it take to receive my refund?",
    answer:
      "Once the returned package reaches our fulfillment center and passes quality inspection (usually within 24–48 hours of receipt), the refund is processed immediately to your original payment method. Depending on your bank, it may take 3–7 business days to reflect in your statement.",
    tags: ["refund time", "bank account", "processing"],
  },
  {
    id: "payment-methods",
    category: "payments",
    popular: true,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards (Visa, MasterCard, American Express, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, EMI options, and Cash on Delivery (COD) for eligible domestic pin codes.",
    tags: ["upi", "credit card", "debit card", "cod", "netbanking"],
  },
  {
    id: "payment-safety",
    category: "payments",
    question: "Is my payment information secure on Crescita?",
    answer:
      "Absolutely. All transactions are encrypted with industry-standard 256-bit SSL encryption and processed through RBI-approved PCI-DSS Level 1 compliant payment gateways. We never store your sensitive card CVV or banking credentials.",
    tags: ["security", "pci-dss", "encryption", "safe"],
  },
  {
    id: "apply-promo-code",
    category: "payments",
    question: "How do I apply a discount or promotional code?",
    answer:
      "During checkout in your cart drawer or review screen, enter your promo code into the 'Gift Card or Promo Code' field and click 'Apply'. The discounted amount will be deducted instantly from your order total.",
    tags: ["coupon", "discount", "voucher", "promo"],
  },
  {
    id: "size-guide",
    category: "products",
    popular: true,
    question: "How do I find the right fit and size for me?",
    answer:
      "Each product page includes an interactive Size Guide with comprehensive measurement charts in both inches and centimeters. You can also view model measurements, garment fit notes (e.g., relaxed, slim, oversized), and fabric stretch ratings.",
    tags: ["sizing", "size chart", "measurements", "fit"],
  },
  {
    id: "authenticity",
    category: "products",
    question: "Are all products 100% authentic and original?",
    answer:
      "Yes, 100%. Crescita directly designs, sources, and manufactures all garments and curated home goods under strict quality standards. Every piece comes with authentic brand tags and craftsmanship guarantees.",
    tags: ["authentic", "original", "quality", "materials"],
  },
  {
    id: "restock-notification",
    category: "products",
    question: "An item I love is out of stock. Will it be restocked?",
    answer:
      "We regularly restock our signature collections. On any sold-out product page, click 'Notify Me When Available' and enter your email address to receive an instant alert when fresh inventory arrives.",
    tags: ["out of stock", "restock", "notify", "sold out"],
  },
  {
    id: "account-benefits",
    category: "account",
    question: "Do I need an account to place an order?",
    answer:
      "You can checkout as a guest, but creating a complimentary Crescita account lets you track shipments easily, save multiple delivery addresses, create wishlists, and earn exclusive rewards on every purchase.",
    tags: ["guest checkout", "login", "register", "profile"],
  },
  {
    id: "reset-password",
    category: "account",
    question: "How do I reset my forgotten password?",
    answer:
      "Click on the User icon in the top header, select 'Forgot Password', and enter your registered email. We will immediately send you a secure link to reset your credentials.",
    tags: ["password", "forgot", "account recovery"],
  },
  {
    id: "sustainable-materials",
    category: "care",
    question: "What are your sustainable and ethical manufacturing practices?",
    answer:
      "We are committed to conscious luxury. Our collections prioritize organic cotton, recycled fibers, eco-friendly natural dyes, and 100% biodegradable plastic-free packaging. We work exclusively with certified fair-trade artisanal workshops.",
    tags: ["organic", "eco-friendly", "packaging", "green"],
  },
  {
    id: "garment-care",
    category: "care",
    question: "How should I care for and wash delicate fabrics?",
    answer:
      "Detailed wash and care instructions are stitched inside every garment label and listed on the product specifications tab. As a general rule, we recommend gentle cold hand washing or mild cycle machine wash with like colors, followed by line drying in shade.",
    tags: ["washing", "care instructions", "dry clean", "ironing"],
  },
];

export const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "track-order": true,
  });
  const [helpfulFeedback, setHelpfulFeedback] = useState<
    Record<string, "yes" | "no">
  >({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFeedback = (id: string, type: "yes" | "no", e: React.MouseEvent) => {
    e.stopPropagation();
    setHelpfulFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? (undefined as unknown as "yes") : type,
    }));
  };

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/faq#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter items based on active category and search query
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesText =
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)));

      return matchesCategory && matchesText;
    });
  }, [activeCategory, searchQuery]);

  const popularFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => item.popular);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20 text-neutral-900">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-200/70 pt-16 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-medium uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
            Customer Help Center
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 font-serif mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
            Have questions about your order, sizing, shipping, or returns? We’re
            here to guide you every step of the way.
          </p>

          {/* ── Search Input ── */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., tracking, refunds, sizing, COD)..."
                className="w-full pl-12 pr-10 py-3.5 bg-neutral-50 sm:bg-white text-sm text-neutral-800 placeholder-neutral-400 border border-neutral-300/80 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 text-xs text-neutral-400 hover:text-neutral-700 bg-neutral-200/70 hover:bg-neutral-200 px-2 py-1 rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-neutral-500 text-left mt-2 pl-2">
                Showing results for &ldquo;<span className="font-semibold text-neutral-800">{searchQuery}</span>&rdquo; ({filteredFAQs.length} found)
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* ── Popular Quick Links (Shown if no search query) ── */}
        {!searchQuery && activeCategory === "all" && (
          <div className="mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Popular Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popularFAQs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveCategory(item.category);
                    setOpenItems((prev) => ({ ...prev, [item.id]: true }));
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="text-left p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-xs hover:border-neutral-900 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <span className="text-xs font-medium text-neutral-800 group-hover:text-neutral-950 line-clamp-2">
                    {item.question}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium mt-2 flex items-center gap-1 group-hover:text-neutral-700">
                    Read answer <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Categories Filter Pills ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count =
              cat.id === "all"
                ? FAQ_DATA.length
                : FAQ_DATA.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-white border border-neutral-200/90 text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-neutral-400"}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-neutral-700 text-white"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── FAQ Accordion List ── */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((item) => {
              const isOpen = !!openItems[item.id];
              const feedback = helpfulFeedback[item.id];

              return (
                <div
                  id={item.id}
                  key={item.id}
                  className={`bg-white border rounded-xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-neutral-400/80 shadow-xs"
                      : "border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  {/* Header / Trigger */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 select-none focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isOpen ? "bg-neutral-900" : "bg-neutral-300"
                        }`}
                      />
                      <span
                        className={`text-sm sm:text-[15px] font-medium leading-snug transition-colors ${
                          isOpen ? "text-neutral-950 font-semibold" : "text-neutral-800 hover:text-neutral-950"
                        }`}
                      >
                        {item.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.popular && (
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                          Popular
                        </span>
                      )}
                      <div
                        className={`p-1 rounded-full text-neutral-400 hover:text-neutral-700 transition-transform duration-200 ${
                          isOpen ? "rotate-180 bg-neutral-100 text-neutral-900" : ""
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Body / Content */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                      <p className="mt-2 text-neutral-600">{item.answer}</p>

                      {/* Footer Actions inside Accordion */}
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                        {/* Helpful Counter */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-400">Was this helpful?</span>
                          <button
                            type="button"
                            onClick={(e) => handleFeedback(item.id, "yes", e)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors ${
                              feedback === "yes"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleFeedback(item.id, "no", e)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors ${
                              feedback === "no"
                                ? "bg-rose-50 text-rose-700 border-rose-200 font-semibold"
                                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                            No
                          </button>
                        </div>

                        {/* Copy Link Button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyLink(item.id, e)}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors"
                          title="Copy direct link to this question"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">Link Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-white border border-neutral-200/80 rounded-2xl">
            <HelpCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-800">
              No matching answers found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;. Try
              searching with different keywords or reach out to our concierge team directly.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="px-4 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Clear Search
              </button>
              <Link
                to="/contact"
                className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}

        {/* ── Still Need Help? Support Card ── */}
        <div className="mt-14 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-neutral-100 text-neutral-700 uppercase mb-2">
                24/7 Dedicated Support
              </span>
              <h3 className="text-xl font-bold text-neutral-900 font-serif">
                Still have unanswered questions?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
                Our support team is available around the clock to assist you with
                custom inquiries, personalized styling, sizing advice, and bulk orders.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 justify-center md:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Concierge
              </Link>
              <a
                href="mailto:support@crescita.in"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-medium hover:bg-neutral-50 transition-colors"
              >
                <Mail className="w-4 h-4 text-neutral-400" />
                Email support@crescita.in
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200/60 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">+91 (800) 123-4567</p>
                <p className="text-[11px] text-neutral-400">Mon - Sat, 9am - 7pm IST</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200/60 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">Free Express Shipping</p>
                <p className="text-[11px] text-neutral-400">On all prepaid orders</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-200/60 flex items-center justify-center shrink-0">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-700" />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">14-Day Easy Returns</p>
                <p className="text-[11px] text-neutral-400">Doorstep pickup available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

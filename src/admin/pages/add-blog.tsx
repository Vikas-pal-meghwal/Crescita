import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../component/layout";
import { loadPosts, upsertPost } from "../../data/blog-store";
import type { BlogPost, Section } from "../../data/blog-data";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";

/* ─── Constants ──────────────────────────────── */
const TAGS = ["Style Guide", "Beauty Tips", "Home Decor", "Lifestyle", "Trends", "Wellness", "Travel"];

/* ─── Helpers ────────────────────────────────── */
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <label className="block text-[10px] tracking-[0.12em] uppercase text-gray-400 mb-1.5 font-medium">
    {text} {required && <span className="text-red-400">*</span>}
  </label>
);

const inputBase =
  "w-full px-3 py-2 text-[13px] border outline-none transition-colors rounded-sm bg-white";
const inputCls = (err?: boolean) =>
  `${inputBase} ${err ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-gray-500"}`;

const ErrMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle size={10} /> {msg}
    </p>
  ) : null;

/* Section accordion wrapper */
const SectionCard = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
      >
        <span className="text-[13px] font-semibold text-gray-700">{title}</span>
        {open ? (
          <ChevronUp size={15} className="text-gray-400" />
        ) : (
          <ChevronDown size={15} className="text-gray-400" />
        )}
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-gray-50">{children}</div>}
    </div>
  );
};

/* ─── Content block types ────────────────────── */
type BlockType = Section["type"];

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  list: "List",
  quote: "Pull Quote",
  image: "Image",
};

const emptyBlock = (type: BlockType): Section => {
  switch (type) {
    case "paragraph": return { type: "paragraph", text: "" };
    case "heading": return { type: "heading", text: "" };
    case "list": return { type: "list", items: [""] };
    case "quote": return { type: "quote", text: "", attribution: "" };
    case "image": return { type: "image", src: "", caption: "" };
  }
};

/* ─── Main component ─────────────────────────── */
const AddBlog = () => {
  const navigate = useNavigate();
  const { slug: editSlug } = useParams<{ slug: string }>();
  const isEditing = !!editSlug;

  /* ── form state ── */
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tag, setTag] = useState(TAGS[0]);
  const [customTag, setCustomTag] = useState("");
  const [author, setAuthor] = useState("Crescita Editorial");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  const [readTime, setReadTime] = useState("3 min read");
  const [image, setImage] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [content, setContent] = useState<Section[]>([{ type: "paragraph", text: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  /* populate if editing */
  useEffect(() => {
    if (editSlug) {
      const post = loadPosts().find((p) => p.slug === editSlug);
      if (post) {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setTag(TAGS.includes(post.tag) ? post.tag : "custom");
        setCustomTag(TAGS.includes(post.tag) ? "" : post.tag);
        setAuthor(post.author);
        setDate(post.date);
        setReadTime(post.readTime);
        setImage(post.image);
        setSlug(post.slug);
        setSlugManual(true);
        setContent(post.content);
      }
    }
  }, [editSlug]);

  /* auto-slug from title */
  useEffect(() => {
    if (!slugManual) setSlug(slugify(title));
  }, [title, slugManual]);

  /* ── content block helpers ── */
  const addBlock = (type: BlockType) =>
    setContent((c) => [...c, emptyBlock(type)]);

  const removeBlock = (i: number) =>
    setContent((c) => c.filter((_, idx) => idx !== i));

  const updateBlock = (i: number, patch: Partial<Section>) =>
    setContent((c) => {
      const next = [...c];
      next[i] = { ...next[i], ...patch } as Section;
      return next;
    });

  const moveBlock = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= content.length) return;
    const next = [...content];
    [next[i], next[j]] = [next[j], next[i]];
    setContent(next);
  };

  /* list item helpers */
  const updateListItem = (bi: number, li: number, val: string) => {
    const block = content[bi];
    if (block.type !== "list") return;
    const items = [...block.items];
    items[li] = val;
    updateBlock(bi, { items } as Partial<Section>);
  };

  const addListItem = (bi: number) => {
    const block = content[bi];
    if (block.type !== "list") return;
    updateBlock(bi, { items: [...block.items, ""] } as Partial<Section>);
  };

  const removeListItem = (bi: number, li: number) => {
    const block = content[bi];
    if (block.type !== "list") return;
    updateBlock(bi, { items: block.items.filter((_, i) => i !== li) } as Partial<Section>);
  };

  /* ── validation ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!slug.trim()) e.slug = "Slug is required";
    if (!excerpt.trim()) e.excerpt = "Excerpt is required";
    if (!image.trim()) e.image = "Cover image URL is required";
    if (!author.trim()) e.author = "Author is required";
    if (content.length === 0) e.content = "Add at least one content block";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── submit ── */
  const handleSave = () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const posts = loadPosts();
    const existingNums = posts.map((p) => parseInt(p.num)).filter((n) => !isNaN(n));
    const nextNum = isEditing
      ? (posts.find((p) => p.slug === editSlug)?.num ?? "01")
      : String(Math.max(0, ...existingNums) + 1).padStart(2, "0");

    const post: BlogPost = {
      slug,
      num: nextNum,
      tag: tag === "custom" ? customTag : tag,
      title,
      excerpt,
      readTime,
      image,
      date,
      author,
      content,
    };

    upsertPost(post);
    setSaved(true);
    setTimeout(() => navigate("/admin/blogs"), 1500);
  };

  const errorCount = Object.keys(errors).length;
  const activeTag = tag === "custom" ? customTag : tag;

  return (
    <MainLayout>
      <div className="flex-1 ">
        <div className="px-4 sm:px-6 py-6 space-y-5 pb-12">

          {/* ── Header ── */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/blogs")}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1
                  className="text-[1.4rem] sm:text-[1.8rem] font-normal text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {isEditing ? "Edit Post" : "New Post"}
                </h1>
                <p className="text-[12px] text-gray-400">
                  {isEditing ? `Editing: ${editSlug}` : "Create a new blog post"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setPreview((p) => !p)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {preview ? <EyeOff size={13} /> : <Eye size={13} />}
                {preview ? "Close preview" : "Preview"}
              </button>
              <button
                onClick={() => navigate("/admin/blogs")}
                className="hidden sm:block px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 text-[12px] text-white bg-gray-900 hover:bg-gray-700 transition-colors"
              >
                {saved ? <><Check size={13} /> Saved!</> : isEditing ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {errorCount > 0 && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-sm text-[12px] text-red-600">
              <AlertCircle size={14} className="shrink-0" />
              {errorCount} field{errorCount > 1 ? "s" : ""} need attention.
            </div>
          )}

          <div className={`grid gap-5 ${preview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>

            {/* ── Left: Form ── */}
            <div className="space-y-5">

              {/* Meta */}
              <SectionCard title="Post Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                  <div className="sm:col-span-2">
                    <Label text="Post Title" required />
                    <input
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); delete errors.title; }}
                      placeholder="e.g. 10 Wardrobe Essentials You Need This Season"
                      className={inputCls(!!errors.title)}
                    />
                    <ErrMsg msg={errors.title} />
                  </div>

                  <div className="sm:col-span-2">
                    <Label text="Excerpt" required />
                    <textarea
                      value={excerpt}
                      onChange={(e) => { setExcerpt(e.target.value); delete errors.excerpt; }}
                      rows={2}
                      placeholder="One-sentence summary shown on the blog listing page…"
                      className={inputCls(!!errors.excerpt) + " resize-none"}
                    />
                    <ErrMsg msg={errors.excerpt} />
                  </div>

                  <div>
                    <Label text="URL Slug" required />
                    <input
                      value={slug}
                      onChange={(e) => { setSlug(e.target.value); setSlugManual(true); delete errors.slug; }}
                      placeholder="my-post-title"
                      className={inputCls(!!errors.slug) + " font-mono text-[12px]"}
                    />
                    <ErrMsg msg={errors.slug} />
                    {!slugManual && slug && (
                      <p className="text-[10px] text-gray-400 mt-1">Auto-generated from title</p>
                    )}
                  </div>

                  <div>
                    <Label text="Tag / Category" />
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className={inputCls()}
                    >
                      {TAGS.map((t) => <option key={t}>{t}</option>)}
                      <option value="custom">Custom…</option>
                    </select>
                    {tag === "custom" && (
                      <input
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Enter custom tag"
                        className={inputCls() + " mt-2"}
                      />
                    )}
                  </div>

                  <div>
                    <Label text="Author" required />
                    <input
                      value={author}
                      onChange={(e) => { setAuthor(e.target.value); delete errors.author; }}
                      placeholder="Crescita Editorial"
                      className={inputCls(!!errors.author)}
                    />
                    <ErrMsg msg={errors.author} />
                  </div>

                  <div>
                    <Label text="Date" />
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="August 12, 2026"
                      className={inputCls()}
                    />
                  </div>

                  <div>
                    <Label text="Read Time" />
                    <input
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="4 min read"
                      className={inputCls()}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label text="Cover Image URL" required />
                    <div className="flex gap-3 items-start">
                      <input
                        value={image}
                        onChange={(e) => { setImage(e.target.value); delete errors.image; }}
                        placeholder="https://images.unsplash.com/…"
                        className={inputCls(!!errors.image) + " flex-1"}
                      />
                      {image && (
                        <div className="w-14 h-10 rounded-sm overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                          <img
                            src={image}
                            alt="cover preview"
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        </div>
                      )}
                    </div>
                    <ErrMsg msg={errors.image} />
                  </div>

                </div>
              </SectionCard>

              {/* Content blocks */}
              <SectionCard title={`Content (${content.length} block${content.length !== 1 ? "s" : ""})`}>
                <div className="mt-4 space-y-3">
                  {content.length === 0 && (
                    <p className="text-[12px] text-gray-400 text-center py-4">No content blocks yet. Add one below.</p>
                  )}
                  {errors.content && <ErrMsg msg={errors.content} />}

                  {content.map((block, bi) => (
                    <div key={bi} className="border border-gray-100 rounded-sm overflow-hidden">
                      {/* Block header */}
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-50/60">
                        <div className="flex items-center gap-2">
                          <GripVertical size={13} className="text-gray-300 cursor-grab" />
                          <span className="text-[10px] tracking-[0.12em] uppercase text-gray-400 font-medium">
                            {BLOCK_LABELS[block.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlock(bi, -1)}
                            disabled={bi === 0}
                            className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(bi, 1)}
                            disabled={bi === content.length - 1}
                            className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30 transition-colors"
                          >
                            <ChevronDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(bi)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors ml-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Block body */}
                      <div className="px-3 pb-3 pt-2">
                        <BlockEditor
                          block={block}
                          onChange={(patch) => updateBlock(bi, patch)}
                          onAddListItem={() => addListItem(bi)}
                          onUpdateListItem={(li, val) => updateListItem(bi, li, val)}
                          onRemoveListItem={(li) => removeListItem(bi, li)}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add block buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addBlock(type)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-gray-400 border border-dashed border-gray-200 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all rounded-sm"
                      >
                        <Plus size={11} />
                        {BLOCK_LABELS[type]}
                      </button>
                    ))}
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* ── Right: Live Preview (desktop) ── */}
            {preview && (
              <div className="hidden lg:block sticky top-6 self-start">
                <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden max-h-[85vh] overflow-y-auto admin-scrollbar">
                  <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2">
                    <Eye size={12} className="text-gray-300" />
                    <span className="text-[10px] tracking-[0.12em] uppercase text-gray-400">Live Preview</span>
                  </div>
                  <div className="p-5">
                    {/* Cover */}
                    {image && (
                      <div className="w-full h-36 rounded-sm overflow-hidden mb-4 bg-gray-100">
                        <img src={image} alt="cover" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {/* Tag */}
                    {activeTag && (
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                        {activeTag}
                      </span>
                    )}
                    {/* Title */}
                    <h1
                      className="text-[1.3rem] font-normal text-gray-900 leading-snug mt-3 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {title || "Post Title"}
                    </h1>
                    {/* By-line */}
                    <p className="text-[11px] text-gray-400 mb-4 pb-3 border-b border-gray-100">
                      {author} · {date} · {readTime}
                    </p>
                    {/* Content */}
                    <div className="space-y-3 text-[13px]">
                      {content.map((block, i) => (
                        <PreviewBlock key={i} block={block} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate("/admin/blogs")}
              className="px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-[12px] text-white bg-gray-900 hover:bg-gray-700 transition-colors font-medium"
            >
              {saved
                ? <><Check size={13} /> {isEditing ? "Updated!" : "Published!"}</>
                : isEditing ? "Update Post" : "Publish Post"}
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

/* ─── Block editor ─────────────────────────────── */
const BlockEditor = ({
  block,
  onChange,
  onAddListItem,
  onUpdateListItem,
  onRemoveListItem,
}: {
  block: Section;
  onChange: (p: Partial<Section>) => void;
  onAddListItem: () => void;
  onUpdateListItem: (li: number, val: string) => void;
  onRemoveListItem: (li: number) => void;
}) => {
  const inputBase = "w-full px-3 py-2 text-[13px] border border-gray-200 focus:border-gray-500 outline-none transition-colors rounded-sm bg-white";

  switch (block.type) {
    case "paragraph":
      return (
        <textarea
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value } as Partial<Section>)}
          rows={4}
          placeholder="Write your paragraph here…"
          className={inputBase + " resize-y"}
        />
      );

    case "heading":
      return (
        <input
          value={block.text}
          onChange={(e) => onChange({ text: e.target.value } as Partial<Section>)}
          placeholder="Section heading"
          className={inputBase + " font-medium text-[15px]"}
        />
      );

    case "list":
      return (
        <div className="space-y-2">
          {block.items.map((item, li) => (
            <div key={li} className="flex gap-2 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
              <input
                value={item}
                onChange={(e) => onUpdateListItem(li, e.target.value)}
                placeholder={`Item ${li + 1}`}
                className={inputBase + " flex-1"}
              />
              {block.items.length > 1 && (
                <button type="button" onClick={() => onRemoveListItem(li)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={onAddListItem}
            className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Plus size={11} /> Add item
          </button>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <textarea
            value={block.text}
            onChange={(e) => onChange({ text: e.target.value } as Partial<Section>)}
            rows={2}
            placeholder="Quote text…"
            className={inputBase + " resize-none italic"}
          />
          <input
            value={block.attribution ?? ""}
            onChange={(e) => onChange({ attribution: e.target.value } as Partial<Section>)}
            placeholder="Attribution (optional)"
            className={inputBase + " text-[12px] text-gray-400"}
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <div className="flex gap-3 items-start">
            <input
              value={block.src}
              onChange={(e) => onChange({ src: e.target.value } as Partial<Section>)}
              placeholder="https://images.unsplash.com/…"
              className={inputBase + " flex-1"}
            />
            {block.src && (
              <div className="w-14 h-10 rounded-sm overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                <img
                  src={block.src}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>
          <input
            value={block.caption ?? ""}
            onChange={(e) => onChange({ caption: e.target.value } as Partial<Section>)}
            placeholder="Caption (optional)"
            className={inputBase + " text-[12px] text-gray-400"}
          />
        </div>
      );

    default:
      return null;
  }
};

/* ─── Inline preview renderer ─────────────────── */
const PreviewBlock = ({ block }: { block: Section }) => {
  switch (block.type) {
    case "paragraph":
      return <p className="text-gray-600 leading-relaxed font-light">{block.text}</p>;
    case "heading":
      return (
        <h2
          className="text-[1.1rem] font-normal text-gray-900 mt-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul className="space-y-1 pl-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-500">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-gray-300 pl-4 py-1 bg-gray-50">
          <p className="italic text-gray-700" style={{ fontFamily: "'Playfair Display', serif" }}>
            "{block.text}"
          </p>
          {block.attribution && (
            <cite className="block mt-1 text-[10px] uppercase tracking-wider text-gray-400 not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );
    case "image":
      return block.src ? (
        <figure>
          <img src={block.src} alt={block.caption ?? ""} className="w-full rounded-sm object-cover max-h-40" />
          {block.caption && (
            <figcaption className="text-center text-[10px] text-gray-400 mt-1">{block.caption}</figcaption>
          )}
        </figure>
      ) : null;
    default:
      return null;
  }
};

export default AddBlog;

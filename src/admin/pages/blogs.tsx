import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../component/layout";
import { loadPosts, deletePost } from "../../data/blog-store";
import type { BlogPost } from "../../data/blog-data";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Eye,
  Clock,
  Tag,
  X,
  ChevronUp,
  ChevronDown,
  Inbox,
} from "lucide-react";

type SortKey = "title" | "date" | "readTime";
type SortDir = "asc" | "desc";

/** Deterministic pastel palette for tag pills — same tag always gets the same color */
const TAG_PALETTE = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-violet-50", text: "text-violet-600" },
  { bg: "bg-amber-50", text: "text-amber-700" },
  { bg: "bg-emerald-50", text: "text-emerald-600" },
  { bg: "bg-rose-50", text: "text-rose-600" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    setPosts(loadPosts());
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    const base = query.trim()
      ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.tag.toLowerCase().includes(query.toLowerCase()) ||
          p.author.toLowerCase().includes(query.toLowerCase())
      )
      : posts;

    const sorted = [...base].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "date") cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else cmp = (parseInt(a.readTime) || 0) - (parseInt(b.readTime) || 0);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [posts, query, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => {
    if (!active) return <ChevronUp size={11} className="text-gray-200" />;
    return dir === "asc" ? (
      <ChevronUp size={11} className="text-gray-500" />
    ) : (
      <ChevronDown size={11} className="text-gray-500" />
    );
  };

  const handleDelete = (slug: string) => {
    deletePost(slug);
    setPosts(loadPosts());
    setDeleteSlug(null);
    setSelected((s) => {
      const next = new Set(s);
      next.delete(slug);
      return next;
    });
  };

  const handleBulkDelete = () => {
    selected.forEach((slug) => deletePost(slug));
    setPosts(loadPosts());
    setSelected(new Set());
    setBulkDelete(false);
  };

  const toggleSelect = (slug: string) => {
    setSelected((s) => {
      const next = new Set(s);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const allVisibleSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.slug));
  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelected((s) => {
        const next = new Set(s);
        filtered.forEach((p) => next.delete(p.slug));
        return next;
      });
    } else {
      setSelected((s) => {
        const next = new Set(s);
        filtered.forEach((p) => next.add(p.slug));
        return next;
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 py-6 max-w-full mx-auto space-y-5">

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1
                className="text-[1.4rem] sm:text-[1.8rem] font-normal text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Blog Posts
              </h1>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {posts.length} post{posts.length !== 1 ? "s" : ""} published
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/blogs/add")}
              className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-white bg-gray-900 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-colors"
            >
              <Plus size={14} />
              New Post
            </button>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <BookOpen size={16} />, label: "Total Posts", value: posts.length, color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
              { icon: <Tag size={16} />, label: "Categories", value: [...new Set(posts.map((p) => p.tag))].length, color: "text-violet-600", bg: "bg-violet-50", bar: "bg-violet-500" },
              { icon: <Clock size={16} />, label: "Avg. Read Time", value: avgReadTime(posts), color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
              { icon: <Eye size={16} />, label: "Public URL", value: "/blog", color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
            ].map((c) => (
              <div
                key={c.label}
                className="relative bg-white border border-gray-100 rounded-sm p-4 flex flex-col gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all overflow-hidden"
              >
                <span className={`absolute top-0 left-0 h-[2px] w-full ${c.bar} opacity-70`} />
                <div className={`${c.bg} ${c.color} w-7 h-7 rounded-full flex items-center justify-center shrink-0`}>
                  {c.icon}
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 leading-tight mb-0.5">
                    {c.label}
                  </p>
                  <p
                    className="text-[1.1rem] font-normal text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Table ── */}
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            {/* Table header — swaps to bulk-action bar when rows are selected */}
            {selected.size > 0 ? (
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-900 text-white">
                <p className="text-[12px]">
                  {selected.size} post{selected.size !== 1 ? "s" : ""} selected
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelected(new Set())}
                    className="px-3 py-1.5 text-[12px] text-gray-300 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setBulkDelete(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] bg-red-500 hover:bg-red-600 rounded-sm transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-[13px] font-medium text-gray-700">All Posts</h2>
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts…"
                    className="pl-7 pr-7 py-1.5 text-[12px] border border-gray-200 rounded-full w-40 sm:w-52 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/60">
                    <th className="w-10 px-5 py-2.5">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAll}
                        disabled={filtered.length === 0}
                        className="accent-gray-900 cursor-pointer"
                        aria-label="Select all posts"
                      />
                    </th>
                    <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
                      <button
                        onClick={() => toggleSort("title")}
                        className="inline-flex items-center gap-1 hover:text-gray-600 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gray-400"
                      >
                        Post <SortIcon active={sortKey === "title"} dir={sortDir} />
                      </button>
                    </th>
                    <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
                      Tag
                    </th>
                    <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
                      Author
                    </th>
                    <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
                      <button
                        onClick={() => toggleSort("date")}
                        className="inline-flex items-center gap-1 hover:text-gray-600 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gray-400"
                      >
                        Date <SortIcon active={sortKey === "date"} dir={sortDir} />
                      </button>
                    </th>
                    <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
                      <button
                        onClick={() => toggleSort("readTime")}
                        className="inline-flex items-center gap-1 hover:text-gray-600 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gray-400"
                      >
                        Read <SortIcon active={sortKey === "readTime"} dir={sortDir} />
                      </button>
                    </th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-5 py-3"><div className="w-4 h-4 bg-gray-100 rounded" /></td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 bg-gray-100 rounded-sm" />
                              <div className="space-y-1.5">
                                <div className="w-32 h-2.5 bg-gray-100 rounded" />
                                <div className="w-20 h-2 bg-gray-100 rounded" />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3"><div className="w-14 h-4 bg-gray-100 rounded-full" /></td>
                          <td className="px-3 py-3"><div className="w-16 h-2.5 bg-gray-100 rounded" /></td>
                          <td className="px-3 py-3"><div className="w-14 h-2.5 bg-gray-100 rounded" /></td>
                          <td className="px-3 py-3"><div className="w-10 h-2.5 bg-gray-100 rounded" /></td>
                          <td className="px-3 py-3" />
                        </tr>
                      ))}
                    </>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-14">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Inbox size={22} className="text-gray-300" />
                          <p className="text-[12px]">
                            {query ? `No posts match "${query}"` : "No posts yet."}
                          </p>
                          {!query && (
                            <button
                              onClick={() => navigate("/admin/blogs/add")}
                              className="mt-1 text-[12px] text-gray-900 underline underline-offset-2 hover:text-gray-600"
                            >
                              Create your first post
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    filtered.map((post) => {
                      const tc = tagColor(post.tag);
                      return (
                        <tr
                          key={post.slug}
                          className={`hover:bg-gray-50/60 transition-colors ${selected.has(post.slug) ? "bg-gray-50" : ""
                            }`}
                        >
                          <td className="px-5 py-3">
                            <input
                              type="checkbox"
                              checked={selected.has(post.slug)}
                              onChange={() => toggleSelect(post.slug)}
                              className="accent-gray-900 cursor-pointer"
                              aria-label={`Select ${post.title}`}
                            />
                          </td>
                          {/* Post */}
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 rounded-sm overflow-hidden shrink-0 bg-gray-100">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-gray-800 font-medium truncate max-w-[220px]">
                                  {post.title}
                                </p>
                                <p className="text-gray-400 text-[10px] truncate max-w-[220px]">
                                  {post.excerpt}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* Tag */}
                          <td className="px-3 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${tc.bg} ${tc.text}`}>
                              {post.tag}
                            </span>
                          </td>
                          {/* Author */}
                          <td className="px-3 py-3 text-gray-500">{post.author}</td>
                          {/* Date */}
                          <td className="px-3 py-3 text-gray-400">{post.date}</td>
                          {/* Read */}
                          <td className="px-3 py-3 text-gray-400">{post.readTime}</td>
                          {/* Actions */}
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1 justify-end">
                              <button
                                onClick={() => navigate(`/blog/${post.slug}`)}
                                title="View live"
                                className="p-1.5 text-gray-300 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                onClick={() => navigate(`/admin/blogs/edit/${post.slug}`)}
                                title="Edit"
                                className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteSlug(post.slug)}
                                title="Delete"
                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-14 text-gray-400">
                  <Inbox size={22} className="text-gray-300" />
                  <p className="text-[12px]">
                    {query ? `No posts match "${query}"` : "No posts yet."}
                  </p>
                </div>
              )}
              {filtered.map((post) => {
                const tc = tagColor(post.tag);
                return (
                  <div key={post.slug} className="px-4 py-3 flex gap-3 items-center">
                    <input
                      type="checkbox"
                      checked={selected.has(post.slug)}
                      onChange={() => toggleSelect(post.slug)}
                      className="accent-gray-900 shrink-0"
                      aria-label={`Select ${post.title}`}
                    />
                    <div className="w-16 h-12 rounded-sm overflow-hidden shrink-0 bg-gray-100">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 truncate">{post.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] ${tc.bg} ${tc.text}`}>
                          {post.tag}
                        </span>
                        <span className="text-[10px] text-gray-400">{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => navigate(`/admin/blogs/edit/${post.slug}`)}
                        className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteSlug(post.slug)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Single delete confirm modal ── */}
      {deleteSlug && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={() => setDeleteSlug(null)}
        >
          <div
            className="bg-white rounded-sm shadow-xl p-6 w-[320px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 size={15} className="text-red-500" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-gray-800">Delete post?</p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  This will permanently remove the post. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteSlug(null)}
                className="px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteSlug)}
                className="px-4 py-2 text-[12px] text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk delete confirm modal ── */}
      {bulkDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          onClick={() => setBulkDelete(false)}
        >
          <div
            className="bg-white rounded-sm shadow-xl p-6 w-[320px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 size={15} className="text-red-500" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-gray-800">
                  Delete {selected.size} post{selected.size !== 1 ? "s" : ""}?
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  This will permanently remove the selected posts. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBulkDelete(false)}
                className="px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-[12px] text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

/** Compute average read time label from posts */
function avgReadTime(posts: BlogPost[]): string {
  if (!posts.length) return "—";
  const nums = posts.map((p) => parseInt(p.readTime) || 0);
  const avg = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
  return `${avg} min`;
}

export default AdminBlogs;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import MainLayout from "../component/layout";
// import { loadPosts, deletePost } from "../../data/blog-store";
// import type { BlogPost } from "../../data/blog-data";
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   Search,
//   BookOpen,
//   Eye,
//   Clock,
//   Tag,
// } from "lucide-react";

// const AdminBlogs = () => {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [query, setQuery] = useState("");
//   const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

//   useEffect(() => {
//     setPosts(loadPosts());
//   }, []);

//   const filtered = query.trim()
//     ? posts.filter(
//         (p) =>
//           p.title.toLowerCase().includes(query.toLowerCase()) ||
//           p.tag.toLowerCase().includes(query.toLowerCase()) ||
//           p.author.toLowerCase().includes(query.toLowerCase())
//       )
//     : posts;

//   const handleDelete = (slug: string) => {
//     deletePost(slug);
//     setPosts(loadPosts());
//     setDeleteSlug(null);
//   };

//   return (
//     <MainLayout>
//       <div className="flex-1 overflow-y-auto">
//         <div className="px-4 sm:px-6 py-6 max-w-full mx-auto space-y-5">

//           {/* ── Page Header ── */}
//           <div className="flex items-center justify-between flex-wrap gap-3">
//             <div>
//               <h1
//                 className="text-[1.4rem] sm:text-[1.8rem] font-normal text-gray-900"
//                 style={{ fontFamily: "'Playfair Display', serif" }}
//               >
//                 Blog Posts
//               </h1>
//               <p className="text-[12px] text-gray-400 mt-0.5">
//                 {posts.length} post{posts.length !== 1 ? "s" : ""} published
//               </p>
//             </div>
//             <button
//               onClick={() => navigate("/admin/blogs/add")}
//               className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors"
//             >
//               <Plus size={14} />
//               New Post
//             </button>
//           </div>

//           {/* ── Stats row ── */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//             {[
//               { icon: <BookOpen size={16} />, label: "Total Posts", value: posts.length, color: "text-blue-600", bg: "bg-blue-50" },
//               { icon: <Tag size={16} />, label: "Categories", value: [...new Set(posts.map((p) => p.tag))].length, color: "text-violet-600", bg: "bg-violet-50" },
//               { icon: <Clock size={16} />, label: "Avg. Read Time", value: avgReadTime(posts), color: "text-amber-600", bg: "bg-amber-50" },
//               { icon: <Eye size={16} />, label: "Public URL", value: "/blog", color: "text-emerald-600", bg: "bg-emerald-50" },
//             ].map((c) => (
//               <div
//                 key={c.label}
//                 className="bg-white border border-gray-100 rounded-sm p-4 flex flex-col gap-2.5 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all"
//               >
//                 <div className={`${c.bg} ${c.color} w-7 h-7 rounded-full flex items-center justify-center shrink-0`}>
//                   {c.icon}
//                 </div>
//                 <div>
//                   <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 leading-tight mb-0.5">
//                     {c.label}
//                   </p>
//                   <p
//                     className="text-[1.1rem] font-normal text-gray-900"
//                     style={{ fontFamily: "'Playfair Display', serif" }}
//                   >
//                     {c.value}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ── Table ── */}
//           <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
//             {/* Table header */}
//             <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
//               <h2 className="text-[13px] font-medium text-gray-700">All Posts</h2>
//               <div className="relative">
//                 <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search posts…"
//                   className="pl-7 pr-3 py-1.5 text-[12px] border border-gray-200 rounded-full w-40 sm:w-52 focus:outline-none focus:ring-1 focus:ring-gray-300"
//                 />
//               </div>
//             </div>

//             {/* Desktop table */}
//             <div className="hidden sm:block overflow-x-auto">
//               <table className="w-full text-[12px]">
//                 <thead>
//                   <tr className="border-b border-gray-50 bg-gray-50/60">
//                     <th className="text-left px-5 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
//                       Post
//                     </th>
//                     <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
//                       Tag
//                     </th>
//                     <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
//                       Author
//                     </th>
//                     <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
//                       Date
//                     </th>
//                     <th className="text-left px-3 py-2.5 text-[10px] tracking-[0.12em] uppercase text-gray-400 font-normal">
//                       Read
//                     </th>
//                     <th className="px-3 py-2.5" />
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filtered.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-[12px]">
//                         {query ? `No posts match "${query}"` : "No posts yet. Create one!"}
//                       </td>
//                     </tr>
//                   )}
//                   {filtered.map((post) => (
//                     <tr key={post.slug} className="hover:bg-gray-50/60 transition-colors">
//                       {/* Post */}
//                       <td className="px-5 py-3">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-10 rounded-sm overflow-hidden shrink-0 bg-gray-100">
//                             <img
//                               src={post.image}
//                               alt={post.title}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-gray-800 font-medium truncate max-w-[220px]">
//                               {post.title}
//                             </p>
//                             <p className="text-gray-400 text-[10px] truncate max-w-[220px]">
//                               {post.excerpt}
//                             </p>
//                           </div>
//                         </div>
//                       </td>
//                       {/* Tag */}
//                       <td className="px-3 py-3">
//                         <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-500">
//                           {post.tag}
//                         </span>
//                       </td>
//                       {/* Author */}
//                       <td className="px-3 py-3 text-gray-500">{post.author}</td>
//                       {/* Date */}
//                       <td className="px-3 py-3 text-gray-400">{post.date}</td>
//                       {/* Read */}
//                       <td className="px-3 py-3 text-gray-400">{post.readTime}</td>
//                       {/* Actions */}
//                       <td className="px-3 py-3">
//                         <div className="flex items-center gap-1 justify-end">
//                           <button
//                             onClick={() => navigate(`/blog/${post.slug}`)}
//                             title="View live"
//                             className="p-1.5 text-gray-300 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
//                           >
//                             <Eye size={13} />
//                           </button>
//                           <button
//                             onClick={() => navigate(`/admin/blogs/edit/${post.slug}`)}
//                             title="Edit"
//                             className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                           >
//                             <Pencil size={13} />
//                           </button>
//                           <button
//                             onClick={() => setDeleteSlug(post.slug)}
//                             title="Delete"
//                             className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
//                           >
//                             <Trash2 size={13} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile cards */}
//             <div className="sm:hidden divide-y divide-gray-50">
//               {filtered.length === 0 && (
//                 <p className="px-5 py-10 text-center text-gray-400 text-[12px]">
//                   {query ? `No posts match "${query}"` : "No posts yet."}
//                 </p>
//               )}
//               {filtered.map((post) => (
//                 <div key={post.slug} className="px-4 py-3 flex gap-3">
//                   <div className="w-16 h-12 rounded-sm overflow-hidden shrink-0 bg-gray-100">
//                     <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[13px] font-medium text-gray-800 truncate">{post.title}</p>
//                     <p className="text-[10px] text-gray-400 mt-0.5">{post.tag} · {post.date}</p>
//                   </div>
//                   <div className="flex items-center gap-1 shrink-0">
//                     <button
//                       onClick={() => navigate(`/admin/blogs/edit/${post.slug}`)}
//                       className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
//                     >
//                       <Pencil size={13} />
//                     </button>
//                     <button
//                       onClick={() => setDeleteSlug(post.slug)}
//                       className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
//                     >
//                       <Trash2 size={13} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Delete confirm modal ── */}
//       {deleteSlug && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
//           onClick={() => setDeleteSlug(null)}
//         >
//           <div
//             className="bg-white rounded-sm shadow-xl p-6 w-[320px] mx-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-start gap-3 mb-4">
//               <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
//                 <Trash2 size={15} className="text-red-500" />
//               </div>
//               <div>
//                 <p className="text-[14px] font-semibold text-gray-800">Delete post?</p>
//                 <p className="text-[12px] text-gray-400 mt-0.5">
//                   This will permanently remove the post. This action cannot be undone.
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setDeleteSlug(null)}
//                 className="px-4 py-2 text-[12px] text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteSlug)}
//                 className="px-4 py-2 text-[12px] text-white bg-red-500 hover:bg-red-600 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </MainLayout>
//   );
// };

// /** Compute average read time label from posts */
// function avgReadTime(posts: BlogPost[]): string {
//   if (!posts.length) return "—";
//   const nums = posts.map((p) => parseInt(p.readTime) || 0);
//   const avg = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
//   return `${avg} min`;
// }

// export default AdminBlogs;

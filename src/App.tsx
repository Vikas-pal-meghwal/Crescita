import { Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import ProductDetails from "./pages/product-details";
import AllProducts from "./pages/all-products";
import Home from "./pages/Home";
import Contact from "./pages/connect";
import Wishlist from "./pages/wishlist";
import Blog from "./pages/blog";
import BlogPost from "./pages/blog-post";
import AdminBlogs from "./admin/pages/blogs";
import AddBlog from "./admin/pages/add-blog";
import AdminSale from "./admin/pages/add-sale";
import ScrollToTop from "./components/layout/scroll-to-top";
import AdminLogin from "./pages/admin/admin-login";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminRoute from "./components/admin/admin-route";
import Dashboard from "./admin/pages/dashboard";
import AdminProducts from "./admin/pages/products";
import Analytics from "./admin/pages/analytics";
import AddProduct from "./admin/pages/add-product";

import FAQ from "./pages/faq";
import About from "./pages/about";

const App = () => {
  return (
    <Routes>

      {/* ── Public store routes ── */}
      <Route
        element={
          <>
            <ScrollToTop />
            <div className="fixed top-0 left-0 right-0 z-50">
              <Header />
            </div>
            <div className="h-[52px]" />{/* spacer for fixed header */}
            <div
              className={`transition-all duration-1000 ease-out min-h-[calc(100vh-100px)]`}
            >
              <Outlet />
            </div>
            <Footer />
          </>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* ── Admin routes (no header/footer) ── */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
      <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
      <Route path="/admin/blogs/add" element={<AdminRoute><AddBlog /></AdminRoute>} />
      <Route path="/admin/blogs/edit/:slug" element={<AdminRoute><AddBlog /></AdminRoute>} />
      <Route path="/admin/sale" element={<AdminRoute><AdminSale /></AdminRoute>} />
      <Route
        path="/admin/dashboard1"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default App;
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-3 sm:py-6 px-6 flex justify-between items-center text-xs text-gray-400 flex-wrap gap-4">
      <div>© {new Date().getFullYear()} Crescita · All rights reserved</div>
      <div className="flex gap-6 items-center">
        <Link to="/about" className="hover:text-gray-900 transition-colors">
          About
        </Link>
        <Link to="/faq" className="hover:text-gray-900 transition-colors">
          FAQs & Help
        </Link>
        <Link to="/terms" className="hover:text-gray-900 transition-colors">
          Terms
        </Link>
        <Link to="/privacy" className="hover:text-gray-900 transition-colors">
          Privacy
        </Link>
        <Link to="/contact" className="hover:text-gray-900 transition-colors">
          Contact Us
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

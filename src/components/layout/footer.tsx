

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-2  sm:py-6 px-6 flex justify-between  item-center text-xs text-gray-400 flex-wrap gap-4">
      <div>© {new Date().getFullYear()} Crescita ·All rights reserved</div>
      <div className="flex gap-6 hidden sm:block">
        <a href="/terms" className="hover:text-gray-600">
          Terms and Policies
        </a>
        <a href="/privacy" className="hover:text-gray-600">
          Privacy Policy
        </a>
        <a href="/contacts" className="hover:text-gray-600">
          Contact Us
        </a>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center p-3 mt-auto text-sm text-gray-500">
      &copy; {new Date().getFullYear()} MindMirror — Built with 💙 by Gyanendra Singh
    </footer>
  );
};

export default Footer;

// Footer.js (Footer Component)

import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer my-footer-s">
      <div className="container">
        <p className="text-center mb-0 contactSectionFonts">
          Copyright © {year} Redwoodpeak Limited. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

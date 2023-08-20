import React from "react";
import "./cssfiles/design.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const linkedinProfileUrl = 'https://linkedin.com/in/upendracse/'; 
  const twitterProfileUrl = 'https://twitter.com/upendraj20'; 
  return (
    <div>
      {" "}
      <div className="footer">
        <p>Made by Upendra Jaiswal </p>
        <p>
          {" "}
          <a href={linkedinProfileUrl} className="social-link">  <i class="fa fa-linkedin" aria-hidden="true" ></i>{" "}</a>
          <a href={twitterProfileUrl} className="social-link">    <i class="fa fa-twitter" aria-hidden="true"></i></a>
        </p>{" "}
        <p>&copy; {currentYear} Spearmint technology. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;

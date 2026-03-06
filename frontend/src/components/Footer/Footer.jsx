import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            Hello everyone hope You enjoy the simplicity of our app and your
            meal will just be serve on time at your door step so enjoy your meal
            and <span>Bonne Appetit !! </span>
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>

        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li><a href="">Home</a></li>
            <li><a href="">Menu</a></li>
            <li><a href="">Mobile-app </a></li>
            <li><a href="">Contact Us </a> </li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="">+237 672 76 58 33 </a></li>
            <li><a href="">jolienelgado96@gmail.com </a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="copy-right">
        Copyright 2024  © Tomato.com - All right Reserved.
      </p>
    </div>
  );
};

export default Footer;

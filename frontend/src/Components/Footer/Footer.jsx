import React from "react";
import { FaFacebookF, FaFacebookMessenger, FaTwitter, FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#fff] text-primary py-16 px-4 md:px-12 relative overflow-hidden">
      {/* Curved Top Corners */}
      <div className="absolute top-0 left-0 w-full h-40 bg-[#bdeef8] rounded-b-[50%] z-0"></div>

      <div className="relative z-10">
        {/* Main Content of the Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 mb-16">
          {/* Column 1: About Us */}
          <div>
            <h3 className="text-3xl font-semibold mb-6 text-primary">About Us</h3>
            <p className="text-lg leading-relaxed text-secondary">
              We are a leading provider of innovative solutions, dedicated to helping businesses grow in the digital era.
            </p>
            <div className="flex space-x-6 mt-6">
              <a href="#" className="hover:text-primary transition-all duration-300" aria-label="Facebook">
                <FaFacebookF size={24} />
              </a>
              <a href="#" className="hover:text-primary transition-all duration-300" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="hover:text-primary transition-all duration-300" aria-label="LinkedIn">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-3xl font-semibold mb-6 text-primary">Quick Links</h3>
            <ul>
              <li className="mb-4 hover:text-primary transition-all duration-300">
                <a href="#">Home</a>
              </li>
              <li className="mb-4 hover:text-primary transition-all duration-300">
                <a href="#">Services</a>
              </li>
              <li className="mb-4 hover:text-primary transition-all duration-300">
                <a href="#">Portfolio</a>
              </li>
              <li className="mb-4 hover:text-primary transition-all duration-300">
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-3xl font-semibold mb-6 text-primary">Contact Info</h3>
            <p className="text-lg mb-4 text-secondary">Address: Section 12, Block C, Line No: 6, House No 13, Pallabi Thana Mirpur Dhaka 1216</p>
            <p className="text-lg mb-4 text-secondary">Phone: (+880) 1714394330</p>
            <p className="text-lg mb-4 text-secondary">Email: ruhanas0311@gmail.com</p>
            <p className="text-lg mb-4 text-secondary">Emergency: (+880) 9638259714</p>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-3xl font-semibold mb-6 text-primary">Follow Us</h3>
            <p className="text-lg mb-6 text-secondary">Connect with us on social media:</p>
            <div className="flex space-x-6 text-2xl">
              <a
                href="https://www.facebook.com/smsharfarraz.jhony"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-[#4267B2] transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF size={32} />
              </a>
              <a
                href="https://messenger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-[#00B2FF] transition-all duration-300"
                aria-label="Messenger"
              >
                <FaFacebookMessenger size={32} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-[#1DA1F2] transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={32} />
              </a>
              <a
                href="https://wa.me/8801714394330"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-[#25D366] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={32} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-[#C13584] transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={32} />
              </a>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="relative w-full h-[400px] bg-secondary rounded-xl mt-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <iframe
              className="w-full h-full border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3991.173002676015!2d90.36323174413143!3d23.827340459307717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1ae043955f1%3A0x9b5859a2015ec2a0!2sRuhanas%20Fashion%20Studio!5e1!3m2!1sen!2sbd!4v1733498032045!5m2!1sen!2sbd"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-[#56C5DC] py-6 text-center rounded-md mt-16">
        <p className="text-lg text-white">
         <span className="text-primary">&copy; 2025</span> Original Collections. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

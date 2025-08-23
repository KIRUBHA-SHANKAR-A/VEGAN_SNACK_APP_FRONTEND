import React from "react";
import { Leaf, Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Browse Snacks", href: "/getAllVeganSnacks" },
      { name: "Add Snack", href: "/apply" },
      { name: "Categories", href: "/categories" },
      { name: "Reviews", href: "/reviews" }
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Mission", href: "/mission" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" }
    ]
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", name: "Facebook" },
    { icon: <Twitter size={20} />, href: "#", name: "Twitter" },
    { icon: <Instagram size={20} />, href: "#", name: "Instagram" },
    { icon: <Github size={20} />, href: "#", name: "Github" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-3">
                <Leaf size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent">
                VeeGo
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              Discover, share, and enjoy the best vegan snacks. Join our community of conscious snackers 
              making healthier choices for themselves and the planet.
            </p>
            
            <div className="flex items-center space-x-2 text-green-400">
              <Heart size={16} className="fill-current" />
              <span className="text-sm">Made with love for a better world</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="text-green-400" />
                <span className="text-sm">hello@veego.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="text-green-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={16} className="text-green-400" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="mt-16 pt-12 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Get the latest vegan snack discoveries and community updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none transition-colors duration-300"
              />
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col justify-center items-center">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© {currentYear} VeeGo - Vegan Snacks Application. All rights reserved.</p><br />
            </div>
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p className="mt-1">Built with 💚 for the vegan community</p>
            </div>

            {/* Social Links */}
            {/* <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.name}
                  className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-110 p-2 hover:bg-gray-800 rounded-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div> */}
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              VeeGo is committed to promoting sustainable and ethical snacking choices. 
              All listed products are verified to be 100% vegan and cruelty-free.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
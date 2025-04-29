import { Link } from "wouter";
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#006747] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-6 w-6" />
              <span className="text-xl font-medium">USFParkingApp</span>
            </div>
            <p className="text-white/80 text-sm">
              Find and reserve parking spots easily with our comprehensive parking management solution.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <Link href="/" className="hover:text-white transition-colors duration-200">Welcome</Link>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <Link href="/home" className="hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <Link href="/visualizations" className="hover:text-white transition-colors duration-200">Visualizations</Link>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <Link href="/about" className="hover:text-white transition-colors duration-200">About</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <a href="#" className="hover:text-white transition-colors duration-200">Help Center</a>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <a href="#" className="hover:text-white transition-colors duration-200">Parking Tips</a>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <a href="#" className="hover:text-white transition-colors duration-200">API Documentation</a>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <ArrowRight className="h-3 w-3 mr-2" />
                <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-white/60" />
                <span>chandarrathala@usf.edu</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-white/60" />
                <span>(813) 418-9804</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-white/60" />
                <span>4202 E Fowler Ave, Tampa, FL 33620</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} USFParkingApp. All rights reserved.
          </p>
          
          <div className="flex space-x-5">
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
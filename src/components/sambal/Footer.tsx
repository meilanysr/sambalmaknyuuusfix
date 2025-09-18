import { MadeWithDyad } from "@/components/made-with-dyad";
import { Instagram } from "lucide-react";

interface FooterProps {
  instagramLink: string;
  hashtags: string;
  copyright: string;
}

const Footer = ({ instagramLink, hashtags, copyright }: FooterProps) => {
  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto px-6 text-center text-gray-600">
        <div className="flex justify-center mb-4">
          <a 
            href={instagramLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-500 hover:text-pink-600 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>
        <p className="font-bold text-red-800 text-lg mb-2">{hashtags}</p>
        <p className="text-sm">{copyright}</p>
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;
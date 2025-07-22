import React from 'react';
import { Share2, Linkedin, Twitter, MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function SocialShare({ url, title, description, className = "" }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-1">
        <Share2 className="w-4 h-4" />
        <span>Partager:</span>
      </span>
      
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
        title="Partager sur LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      
      <button
        onClick={shareOnTwitter}
        className="p-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-300"
        title="Partager sur Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      
      <button
        onClick={shareOnWhatsApp}
        className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-300"
        title="Partager sur WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-slate-600 text-white hover:bg-slate-700 transition-colors duration-300"
        title="Copier le lien"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
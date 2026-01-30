'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ImageMetadata {
  address: string;
  streak: number;
  points: number;
  username: string;
  createdAt: string;
}

export default function SharePage() {
  const params = useParams();
  const imageId = params.imageId as string;
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/images/metadata.json');
        if (response.ok) {
          const data = await response.json();
          setMetadata(data[imageId] || null);
        }
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [imageId]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=I just checked in to Base Challenge! 🔥 Check out my streak: ${shareUrl}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=I just checked in to Base Challenge! 🔥`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-primary-dark-blue dark:text-primary-white text-lg">Loading your check-in...</p>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <h2 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white mb-4">Check-in Not Found</h2>
          <Link href="/challenges/show-up" className="text-accent-green hover:text-accent-green-dark underline">
            Back to Show Up Challenge
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-light-mode-blue dark:bg-primary-dark-blue pb-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-dark-blue dark:text-primary-white mb-2">
            🔥 Base Challenge Check-In
          </h1>
          <p className="text-primary-dark-blue dark:text-accent-light-gray">
            {metadata.username} earned {metadata.points} BCP today!
          </p>
        </div>

        {/* Image Display */}
        <div className="bg-white dark:bg-primary-light-blue rounded-2xl shadow-xl p-6 mb-8 border-2 border-accent-green">
          <img
            src={`/images/${imageId}.svg`}
            alt="Check-in achievement"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Share Section */}
        <div className="bg-white dark:bg-primary-light-blue rounded-2xl shadow-lg p-6 border-2 border-primary-light-mode-blue dark:border-accent-green">
          <h2 className="text-2xl font-bold text-primary-dark-blue dark:text-primary-white mb-4">
            📤 Share This Achievement
          </h2>

          {/* Share URL */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-primary-dark-blue dark:text-accent-light-gray mb-2 block">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-primary-light-mode-blue dark:bg-primary-dark-blue text-primary-dark-blue dark:text-primary-white px-4 py-3 rounded-lg border border-accent-green"
              />
              <button
                onClick={copyToClipboard}
                className="bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue px-6 py-3 rounded-lg font-bold transition-all"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              𝕏 Share on X
            </a>
            <a
              href={telegramShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              ✈️ Share on Telegram
            </a>
          </div>

          {/* Download Button */}
          <div className="mt-6 pt-6 border-t border-accent-gray">
            <a
              href={`/images/${imageId}.svg`}
              download={`base-challenge-${imageId}.svg`}
              className="w-full block text-center bg-primary-dark-blue dark:bg-primary-dark-blue hover:bg-primary-dark-blue/80 text-primary-white px-6 py-3 rounded-lg font-bold transition-all"
            >
              📥 Download Image
            </a>
          </div>
        </div>

        {/* Back to Challenge */}
        <div className="text-center mt-8">
          <Link href="/challenges/show-up" className="text-accent-green hover:text-accent-green-dark font-bold underline">
            ← Back to Show Up Challenge
          </Link>
        </div>
      </div>
    </div>
  );
}

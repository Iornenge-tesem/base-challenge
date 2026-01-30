import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { rateLimit } from '@/lib/rateLimit';

// Generate unique ID for the image
function generateImageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function POST(request: NextRequest) {
  try {
    const { address, streak, points, username, avatar } = await request.json();
    const displayName = username || 'Anonymous User';

    // Rate limiting: 20 image generations per hour per wallet
    const rateLimitKey = `image:${address}`
    const isAllowed = rateLimit(rateLimitKey, {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 1 hour
    })

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many image generation requests. Please try again later.' },
        { status: 429 }
      )
    }
    const imageId = generateImageId();
    const weekStreak = Math.floor(streak / 7);

    // Create SVG image with check-in details
    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a2540;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a3a52;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="1200" height="630" fill="url(#bgGradient)"/>
      <circle cx="1100" cy="100" r="150" fill="#00d084" opacity="0.1"/>
      <circle cx="100" cy="530" r="200" fill="#00d084" opacity="0.08"/>
      
      <rect x="80" y="60" width="1040" height="510" rx="24" fill="none" stroke="#00d084" stroke-width="3" opacity="0.3"/>

      <text x="600" y="130" font-size="44" font-weight="bold" fill="#f0f4f9" text-anchor="middle" font-family="Arial, sans-serif">
        ${displayName} showed up on Base today
      </text>

      <text x="600" y="170" font-size="22" fill="#a5bfeb" text-anchor="middle" font-family="Arial, sans-serif">
        Base Challenge • Daily Check-In
      </text>

      <!-- Avatar / Initials -->
      <circle cx="120" cy="140" r="36" fill="#00d084" opacity="0.2" stroke="#00d084" stroke-width="2" />
      <text x="120" y="148" font-size="24" font-weight="bold" fill="#00d084" text-anchor="middle" font-family="Arial, sans-serif">
        ${displayName.trim()[0]?.toUpperCase() || 'U'}
      </text>
      
      <rect x="150" y="230" width="280" height="220" rx="15" fill="#00d084" opacity="0.15" stroke="#00d084" stroke-width="2"/>
      <text x="290" y="320" font-size="64" font-weight="bold" fill="#00d084" text-anchor="middle" font-family="Arial, sans-serif">
        ${weekStreak}
      </text>
      <text x="290" y="380" font-size="28" fill="#f0f4f9" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">
        Week Streak
      </text>
      
      <rect x="470" y="230" width="280" height="220" rx="15" fill="#00d084" opacity="0.15" stroke="#00d084" stroke-width="2"/>
      <text x="610" y="320" font-size="64" font-weight="bold" fill="#00d084" text-anchor="middle" font-family="Arial, sans-serif">
        ${points}
      </text>
      <text x="610" y="380" font-size="28" fill="#f0f4f9" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">
        Total BCP
      </text>
      
      <rect x="790" y="230" width="280" height="220" rx="15" fill="#00d084" opacity="0.15" stroke="#00d084" stroke-width="2"/>
      <text x="930" y="320" font-size="64" font-weight="bold" fill="#00d084" text-anchor="middle" font-family="Arial, sans-serif">
        ${streak}
      </text>
      <text x="930" y="380" font-size="28" fill="#f0f4f9" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">
        Day Streak
      </text>
      
      <text x="600" y="520" font-size="20" fill="#a5bfeb" text-anchor="middle" font-family="Arial, sans-serif">
        ${displayName}
      </text>
      <text x="600" y="560" font-size="18" fill="#00d084" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">
        basechallenge.com
      </text>
    </svg>`;

    // Save SVG to public/images directory
    const publicDir = join(process.cwd(), 'public', 'images');
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }

    const filePath = join(publicDir, `${imageId}.svg`);
    writeFileSync(filePath, svg);

    // Store metadata in a simple JSON file for retrieval
    const metadataPath = join(publicDir, 'metadata.json');
    let metadata: Record<string, any> = {};
    
    try {
      const { readFileSync } = require('fs');
      metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    } catch (e) {
      metadata = {};
    }

    metadata[imageId] = {
      address,
      streak,
      points,
      username,
      createdAt: new Date().toISOString(),
    };

    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // Return the shareable URL
    const shareUrl = `/share/${imageId}`;
    
    return NextResponse.json(
      { 
        success: true,
        imageId,
        shareUrl,
        imageUrl: `/images/${imageId}.svg`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

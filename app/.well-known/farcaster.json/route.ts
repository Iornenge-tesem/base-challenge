function withValidProperties(properties: Record<string, undefined | string | string[] | boolean>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return true; // Always include booleans (both true and false)
      return !!value;
    })
  );
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://base-challenge-iota.vercel.app'

  return Response.json({
    accountAssociation: {
      header: 'eyJmaWQiOjE3OTkwNTQsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgwMTQ5MUQ1MjcxOTA1MjhjY0JDMzQwRGU4MGJmMkU0NDdkQ2M0ZmUzIn0',
      payload: 'eyJkb21haW4iOiJiYXNlLWNoYWxsZW5nZS1pb3RhLnZlcmNlbC5hcHAifQ',
      signature: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEFnttapLBiaFCy3T-rausyVsDoGENy4eDFPnvdu3yzSTU27lyOEM9QsbCScxtq7QZkCQ_-tIfwcO7Wfumd2d07AGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    frame: {
      version: '1',
      name: 'Base Challenge',
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/icon.png`,
      splashBackgroundColor: '#0a2540',
    },
    miniapp: {
      version: '1',
      name: 'Base Challenge',
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/icon.png`,
      splashBackgroundColor: '#0a2540',
      subtitle: 'Show Up Daily & Earn',
      description: 'Join the daily show up challenge on Base. Check in every day, build your streak, and earn BCP tokens.',
      screenshotUrls: [
        `${baseUrl}/screenshots/leaderboard-1.jpeg`,
        `${baseUrl}/screenshots/leaderboard-2.jpeg`,
        `${baseUrl}/screenshots/leaderboard-3.jpeg`
      ],
      primaryCategory: 'social',
      tags: ['social', 'challenge', 'rewards'],
      heroImageUrl: `${baseUrl}/icon.png`,
      tagline: 'Build your daily streak',
      ogTitle: 'Base Challenge - Show Up Daily',
      ogDescription: 'Join the daily show up challenge on Base and earn BCP tokens',
      ogImageUrl: `${baseUrl}/icon.png`,
      noindex: false
    },
  })
}
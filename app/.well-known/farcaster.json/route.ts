function withValidProperties(properties: Record<string, undefined | string | string[] | boolean>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value;
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
    miniapp: withValidProperties({
      version: '1',
      name: 'Base Challenge',
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/icon.png`,
      splashBackgroundColor: '#0a2540',
      webhookUrl: `${baseUrl}/api/webhook`,
      subtitle: 'Show up daily on Base',
      description: 'Join the daily show up challenge on Base and earn BCP by checking in.',
      screenshotUrls: [
        `${baseUrl}/screenshots/leaderboard-1.jpeg`,
        `${baseUrl}/screenshots/leaderboard-2.jpeg`,
        `${baseUrl}/screenshots/leaderboard-3.jpeg`,
      ],
      primaryCategory: 'social',
      tags: ['base', 'challenge', 'checkin', 'leaderboard'],
      heroImageUrl: `${baseUrl}/icon.png`,
      tagline: 'Show up. Earn BCP.',
      ogTitle: 'Base Challenge',
      ogDescription: 'Show up daily on Base. Track streaks, climb the leaderboard, and earn BCP.',
      ogImageUrl: `${baseUrl}/icon.png`,
      noindex: false,
    }),
  })
}
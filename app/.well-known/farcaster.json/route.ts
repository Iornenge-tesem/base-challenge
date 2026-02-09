export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://base-challenge-iota.vercel.app'

  return Response.json({
    accountAssociation: {
      header: 'eyJmaWQiOjE3OTkwNTQsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgwMTQ5MUQ1MjcxOTA1MjhjY0JDMzQwRGU4MGJmMkU0NDdkQ2M0ZmUzIn0',
      payload: 'eyJkb21haW4iOiJiYXNlLWNoYWxsZW5nZS1pb3RhLnZlcmNlbC5hcHAifQ',
      signature: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEFnttapLBiaFCy3T-rausyVsDoGENy4eDFPnvdu3yzSTU27lyOEM9QsbCScxtq7QZkCQ_-tIfwcO7Wfumd2d07AGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    },
    frame: {
      version: 'next',
      name: 'Base Challenge',
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/icon.png`,
      imageUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/icon.png`,
      splashBackgroundColor: '#0a2540',
      buttonTitle: 'Open App',
    },
  })
}
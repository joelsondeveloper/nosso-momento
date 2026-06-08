'use client'

export default function MusicEmbed({ url }: { url: string }) {
  // Spotify
  if (url.includes('spotify.com')) {
    const id = url.split('/').pop()?.split('?')[0]
    const type = url.includes('/track/') ? 'track' : url.includes('/playlist/') ? 'playlist' : 'track'
    return (
      <iframe
        src={`https://open.spotify.com/embed/${type}/${id}`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="rounded-2xl"
      />
    )
  }

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()
      : new URL(url).searchParams.get('v')
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        width="100%"
        height="200"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        className="rounded-2xl"
      />
    )
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="text-pink-500 text-sm hover:underline">
      🎵 Ouvir música
    </a>
  )
}
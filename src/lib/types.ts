export type Moment = {
  date: string
  title: string
  description: string
}

export type Page = {
  id: string
  slug: string
  created_at: string
  user_id: string
  names: string
  start_date: string
  message: string | null
  music_url: string | null
  photos: string[]
  moments: Moment[]
  theme_color: string
}
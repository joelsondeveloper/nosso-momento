import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Page } from '@/lib/types'
import EditForm from './EditorForm'

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .single()

  if (!data) notFound()

  return <EditForm page={data as Page} />
}
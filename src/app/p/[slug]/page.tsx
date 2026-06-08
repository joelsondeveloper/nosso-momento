import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Page } from '@/lib/types'
import QRSection from './QRSection'
import Counter from './Counter'
import MusicEmbed from './MusicEmbed'
import Image from 'next/image'

export default async function PageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) notFound()

  const page = data as Page
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/p/${page.slug}`

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100">

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <div className="text-5xl mb-4">💕</div>
        <h1 className="text-4xl font-bold text-pink-600 mb-2">{page.names}</h1>
        <Counter startDate={page.start_date} />
      </section>

      {/* Mensagem */}
      {page.message && (
        <section className="max-w-xl mx-auto px-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-600 leading-relaxed italic">&ldquo;{page.message}&rdquo;</p>
          </div>
        </section>
      )}

      {/* Fotos */}
      {page.photos.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 mb-12">
          <h2 className="text-xl font-bold text-pink-500 mb-4 text-center">📸 Nossas fotos</h2>
          <div className="grid grid-cols-2 gap-3">
            {page.photos.map((url, i) => (
              <Image
                key={i}
                src={url}
                width={0}
                height={0}
                alt={`Foto ${i + 1}`}
                className="rounded-2xl object-cover w-full aspect-square shadow-sm"
              />
            ))}
          </div>
        </section>
      )}

      {/* Música */}
      {page.music_url && (
        <section className="max-w-xl mx-auto px-6 mb-12">
          <h2 className="text-xl font-bold text-pink-500 mb-4 text-center">🎵 Nossa música</h2>
          <MusicEmbed url={page.music_url} />
        </section>
      )}

      {/* Linha do tempo */}
      {page.moments.length > 0 && (
        <section className="max-w-xl mx-auto px-6 mb-12">
          <h2 className="text-xl font-bold text-pink-500 mb-6 text-center">🗓️ Nossa história</h2>
          <div className="space-y-4">
            {page.moments.map((moment, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4">
                <div className="text-2xl">🌸</div>
                <div>
                  <p className="font-semibold text-gray-800">{moment.title}</p>
                  <p className="text-xs text-pink-400 mb-1">
                    {new Date(moment.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                  {moment.description && (
                    <p className="text-sm text-gray-500">{moment.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* QR Code */}
      <section className="max-w-xl mx-auto px-6 pb-16">
        <QRSection url={url} />
      </section>

    </main>
  )
}
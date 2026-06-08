import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Page } from '@/lib/types'
import DeleteButton from './DeleteButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const MAX_PAGES = 3

  return (
    <main className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-pink-600">💕 Nosso Momento</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <form action="/auth/signout" method="POST">
            <button className="text-sm text-gray-400 hover:text-gray-600 transition">
              Sair
            </button>
          </form>
        </div>

        {/* Páginas */}
        <div className="space-y-4 mb-6">
          {pages && pages.length > 0 ? (
            pages.map((page: Page) => (
              <div key={page.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{page.names}</p>
                    <p className="text-sm text-gray-400">/p/{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/p/${page.slug}`}
                      className="text-pink-500 text-sm font-medium hover:underline"
                    >
                      Ver →
                    </Link>
                    <Link
                      href={`/editar/${page.slug}`}
                      className="text-gray-400 text-sm hover:text-gray-600"
                    >
                      Editar
                    </Link>
                    <DeleteButton id={page.id} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🌸</div>
              <p>Você ainda não criou nenhuma página</p>
            </div>
          )}
        </div>

        {/* Botão criar */}
        {pages && pages.length < MAX_PAGES ? (
          <Link
            href="/criar"
            className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl py-4 text-center transition"
          >
            + Criar nova página ({pages?.length ?? 0}/{MAX_PAGES})
          </Link>
        ) : (
          <div className="text-center text-sm text-gray-400 bg-white rounded-2xl py-4">
            Você atingiu o limite de {MAX_PAGES} páginas 💌
          </div>
        )}

      </div>
    </main>
  )
}
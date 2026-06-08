import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 flex flex-col items-center justify-center px-6 text-center">

      <div className="text-6xl mb-6">💕</div>

      <h1 className="text-4xl font-bold text-pink-600 mb-3">
        Nosso Momento
      </h1>

      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        Crie uma página especial para o seu amor com fotos, mensagens e os momentos que vocês viveram juntos.
      </p>

      <Link
        href="/login"
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl px-8 py-4 text-lg transition shadow-lg shadow-pink-200"
      >
        Criar minha página 💌
      </Link>

      <p className="text-xs text-gray-400 mt-6">
        Grátis • Compartilhe com link ou QR Code
      </p>

    </main>
  )
}
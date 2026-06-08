'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

export default function QRSection({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
      <h2 className="text-xl font-bold text-pink-500 mb-4">📲 Compartilhar</h2>
      <div className="flex justify-center mb-4">
        <QRCodeSVG value={url} size={180} />
      </div>
      <p className="text-xs text-gray-400 mb-4 break-all">{url}</p>
      <button
        onClick={copyLink}
        className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition"
      >
        {copied ? 'Copiado! ✓' : 'Copiar link'}
      </button>
    </div>
  )
}
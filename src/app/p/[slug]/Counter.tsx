'use client'

import { useEffect, useState } from 'react'

export default function Counter({ startDate }: { startDate: string }) {
  const [text, setText] = useState('')

  useEffect(() => {
    function calc() {
      const start = new Date(startDate + 'T00:00:00')
      const now = new Date()
      const diff = now.getTime() - start.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setText(`${days}d ${hours}h ${minutes}m ${seconds}s juntos`)
    }

    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [startDate])

  return (
    <p className="text-pink-400 font-mono text-lg mt-2">{text}</p>
  )
}
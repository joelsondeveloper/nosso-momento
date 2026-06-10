'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function PageWrapper({
  player,
  children,
}: {
  player: React.ReactNode
  children: React.ReactNode
}) {
  const playerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.92])
  const y = useTransform(scrollY, [0, 300], [0, -40])

  return (
    <>
      <motion.div
        ref={playerRef}
        style={{ opacity, scale, y, position: 'sticky', top: 0, zIndex: 10 }}
      >
        {player}
      </motion.div>
      <div style={{ position: 'relative', zIndex: 20 }}>
        {children}
      </div>
    </>
  )
}
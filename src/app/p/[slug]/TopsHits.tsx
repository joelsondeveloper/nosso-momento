"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Moment } from "@/lib/types";
import Image from "next/image";

interface TopHitsProps {
  moments: Moment[];
  photos: string[];
  themeColor: string;
}

export default function TopHits({ moments, photos, themeColor }: TopHitsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10% 0px" });

  // Limitamos aos 5 momentos principais para a estética "Top 5"
  const topMoments = moments.slice(0, 5);

  return (
    <section
      ref={containerRef}
      id="tophits-section"
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: "#0c0211" }} // Tom profundo de roxo/preto estilo Spotify
    >
      {/* Background Decorativo com Brilho (Glowing Backdrop) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-20 w-96 h-96 rounded-full blur-[120px]"
        style={{ backgroundColor: themeColor }}
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 -left-20 w-80 h-80 rounded-full blur-[100px] bg-purple-900"
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-pink-400 font-mono">
            Sua Retrospectiva Musical
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none mt-2">
            SEUS MOMENTOS <br />
            <span
              className="transition-colors duration-1000"
              style={{ color: themeColor }}
            >
              MAIS OUVIDOS.
            </span>
          </h2>
          <p className="mt-4 text-purple-200/50 font-bold uppercase tracking-[0.2em] text-[10px] font-mono">
            A trilha sonora da nossa vida • Top 5 Hits
          </p>
        </motion.div>

        {/* Lista de Momentos (Tracks) */}
        <div className="space-y-4">
          {topMoments.map((moment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 100,
              }}
              className="flex items-center gap-4 group"
            >
              {/* Ranking */}
              <span className="text-xl md:text-3xl font-black text-white/20 group-hover:text-white transition-colors w-8 text-center italic">
                {index + 1}
              </span>

              {/* Faixa / Card */}
              <div className="flex-1 flex items-center gap-4 bg-white/5 hover:bg-white/10 p-2.5 pr-6 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-300 cursor-default shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                {/* Imagem do Momento */}
                <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 overflow-hidden rounded-xl shadow-md bg-purple-950 flex items-center justify-center text-3xl">
                  {photos[index] ? (
                    <Image
                      src={photos[index]}
                      referrerPolicy="no-referrer"
                      width={100}
                      height={100}
                      alt={moment.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-tr from-purple-900 to-pink-600/40 text-xl font-bold">
                      {["❤️", "💖", "✨", "🌟", "🔥"][index] || "❤️"}
                    </div>
                  )}
                </div>

                {/* Info da "Música" */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-white font-bold text-sm md:text-base truncate tracking-tight uppercase">
                    {moment.title || `Momento #${index + 1}`}
                  </span>
                  <span className="text-white/60 text-xs md:text-sm truncate font-medium">
                    {moment.description || "Um hit inesquecível do nosso ano."}
                  </span>
                </div>

                {/* Ícone de Heart e Data (Duração) */}
                <div className="flex items-center gap-4 ml-4 shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={index === 0 ? themeColor : "none"}
                    stroke={index === 0 ? themeColor : "#fbcfe8"}
                    strokeWidth="2.5"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="text-white/40 font-mono text-xs font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {moment.date
                      ? moment.date.split("-").reverse().slice(0, 2).join(".")
                      : "00.00"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rodapé do Slide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-purple-950 shrink-0 border-2 border-white/20 flex items-center justify-center">
            {photos[0] ? (
              <Image
                src={photos[0]}
                referrerPolicy="no-referrer"
                width={100}
                height={100}
                alt="Destaque"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg">🏆</span>
            )}
          </div>
          <p className="text-white/80 text-xs md:text-sm italic leading-relaxed">
            &ldquo;Esses momentos definiram o seu ano. Foram {moments.length}{" "}
            hits românticos que não saíram e nunca sairão do meu coração.&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}

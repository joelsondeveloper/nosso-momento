"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, HeartHandshake } from "lucide-react";

interface MessageSectionProps {
  message: string;
  names: string;
  themeColor: string;
}

export default function MessageSection({
  message,
  names,
  themeColor,
}: MessageSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  
  // Lógica para pegar o primeiro nome de quem enviou
  const firstName = names.split(/[&,e]/)[0].trim() || "Você";

  return (
    <section
      ref={ref}
      id="message-section"
      className="min-h-screen w-full flex flex-col items-center justify-center py-24 px-6 md:px-8 relative overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: themeColor }} // Fundo dinâmico vibrante
    >
      {/* Aspas flutuantes animadas (Estilo Vinyl) */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 8, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-12 text-purple-950/15 pointer-events-none"
      >
        <Quote size={80} className="fill-current rotate-180" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -8, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 right-12 text-purple-950/15 pointer-events-none"
      >
        <Quote size={80} className="fill-current" />
      </motion.div>

      {/* Formas decorativas de fundo (Blurry Shapes) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-950/10 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center md:justify-start"
        >
          <span className="px-5 py-2 rounded-full bg-purple-950 text-white text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-1.5 shadow-md">
            <HeartHandshake size={12} className="text-pink-300 fill-pink-300/20" />
            Mensagem do seu artista favorito
          </span>
        </motion.div>

        {/* Bloco de Mensagem - Estilo Letras (Lyrics) do Spotify */}
        <div className="space-y-8">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-purple-950 leading-[1.05] tracking-tighter italic uppercase"
          >
            Palavras que <br />
            marcaram <span className="text-white drop-shadow-sm">o seu ano.</span>
          </motion.h2>

          {/* Card de mensagem com gradientes e visual Spotify Wrapped */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.4, type: "spring", damping: 15 }}
            className="bg-purple-950 text-white p-8 md:p-10 rounded-[32px] shadow-2xl relative border border-purple-900/40 overflow-hidden group hover:scale-[1.01] transition-transform duration-300"
          >
            {/* Texto técnico decorativo no canto do card */}
            <div className="absolute top-0 right-0 p-8 opacity-5 font-mono text-[10px] select-none pointer-events-none hidden sm:block leading-tight text-right">
              CHART POSITION #1<br />
              TRACK: COMPARTILHADA<br />
              AUDIO RATE: 100% AMOR
            </div>

            <p className="text-xl md:text-2xl font-black text-pink-200 leading-relaxed italic relative z-10">
              "{message || "Você é a melhor parte de todos os meus dias. Obrigado por cada hit inesquecível ao seu lado."}"
            </p>
            
            {/* Rodapé do card com Avatar dinâmico */}
            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white font-black text-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-300">
                {firstName[0]?.toUpperCase() || "V"}
              </div>
              <div>
                <p className="text-sm font-black text-white uppercase leading-none">
                  {firstName}
                </p>
                <p className="text-[10px] font-black text-pink-300/70 uppercase tracking-widest mt-1.5 font-mono">
                  Compositor principal
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Rodapé da seção */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-purple-950/50 text-[10px] font-black uppercase tracking-[0.4em] font-mono"
        >
          Leitura concluída • 100% Sentimento
        </motion.p>
      </div>

      {/* Shape sutil no fundo */}
      <div 
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-950/10 blur-3xl pointer-events-none"
      />
    </section>
  );
}
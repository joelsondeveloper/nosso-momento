"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Hook para animação dos números crescendo
function useCountUp(target: number, duration: number = 2000, active: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out expo para um efeito mais suave
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

interface CounterProps {
  startDate: string;
  themeColor: string;
  names: string;
}

export default function Counter({
  startDate,
  themeColor,
  names,
}: CounterProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20% 0px" });

  const [dias, setDias] = useState(0);
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [segundos, setSegundos] = useState(0);

  // Valores animados
  const diasAnimado = useCountUp(dias, 2500, isInView);
  const horasAnimado = useCountUp(horas, 2000, isInView);
  const minutosAnimado = useCountUp(minutos, 1800, isInView);

  useEffect(() => {
    function calc() {
      if (!startDate) return;
      // Garante que a data seja interpretada corretamente
      const start = new Date(startDate + "T00:00:00");
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const positiveDiff = Math.max(0, diff);
      
      setDias(Math.floor(positiveDiff / 86400000));
      setHoras(Math.floor((positiveDiff % 86400000) / 3600000));
      setMinutos(Math.floor((positiveDiff % 3600000) / 60000));
      setSegundos(Math.floor((positiveDiff % 60000) / 1000));
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const firstName = names.split(/[&,e]/)[0].trim() || "Você";

  return (
    <section
      id="counter-section"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden transition-colors duration-1000"
      style={{
        backgroundColor: themeColor,
      }}
    >
      {/* Formas Geométricas Concêntricas (Canto Superior) */}
      <motion.div
        initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
        animate={isInView ? { opacity: 1, rotate: -15, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute -top-[40px] -right-[40px] w-[300px] h-[300px] pointer-events-none"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute rounded-[24px] border-2 transition-all duration-1000"
            style={{
              inset: i * 22,
              borderColor: `rgba(59, 7, 100, ${0.4 - i * 0.05})`,
              transform: `rotate(${i * 6}deg)`,
              background: i === 0 ? "rgba(59, 7, 100, 0.1)" : "transparent",
            }}
          />
        ))}
      </motion.div>

      {/* Formas Geométricas (Canto Inferior) */}
      <motion.div
        initial={{ opacity: 0, rotate: 20, scale: 0.6 }}
        animate={isInView ? { opacity: 1, rotate: 15, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="absolute -bottom-[60px] -left-[60px] w-[260px] h-[260px] pointer-events-none"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 transition-all duration-1000"
            style={{
              inset: i * 20,
              borderColor: `rgba(59, 7, 100, ${0.3 - i * 0.05})`,
              transform: `rotate(${i * -8}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Conteúdo Central */}
      <div className="relative text-center max-w-[450px] z-10 w-full">
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-8 text-purple-950/70"
        >
          Estatísticas de uma conexão real
        </motion.p>

        {/* Card Central Estilo Spotify Wrapped */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="aspect-square w-full max-w-[340px] mx-auto flex flex-col items-center justify-center p-10 bg-purple-950 text-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative mb-10 overflow-hidden group hover:rotate-1 transition-transform duration-500"
        >
          {/* Elementos visuais internos do card */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-pink-300">
              <circle cx="10" cy="10" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="90" cy="90" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <span className="text-[11px] uppercase tracking-[0.2em] font-black text-pink-400 mb-4">
            Seu tempo de escuta
          </span>

          <h1 className="text-7xl md:text-8xl font-black m-0 leading-none tracking-tighter text-pink-100">
            {diasAnimado.toLocaleString("pt-BR")}
          </h1>

          <p className="text-2xl font-bold mt-4 tracking-tight">
            dias de história
          </p>

          <div className="absolute bottom-6 flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-black tracking-widest text-white/80">
              ♥ DESDE {new Date(startDate + "T00:00:00").getFullYear()}
            </span>
          </div>
        </motion.div>

        {/* Texto de Impacto */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl md:text-2xl text-purple-950 font-bold mb-12 leading-tight px-4"
        >
          Isso faz de{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-purple-950 italic">{firstName}</span>
            <motion.span 
              initial={{ width: 0 }}
              animate={isInView ? { width: "100%" } : {}}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-1 left-0 h-3 bg-pink-400/40 -rotate-1 z-0"
            />
          </span>{" "}
          sua trilha sonora número #1.
        </motion.p>

        {/* Mini Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: "horas", value: horasAnimado },
            { label: "minutos", value: minutosAnimado },
            { label: "segundos", value: segundos },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/20 border border-purple-950/10 rounded-3xl p-5 backdrop-blur-sm shadow-sm transition-transform hover:-translate-y-1"
            >
              <p className="text-3xl font-black text-purple-950 mb-1 tracking-tighter">
                {String(value).padStart(2, "0")}
              </p>
              <p className="text-[9px] text-purple-950/50 font-black uppercase tracking-[0.1em]">
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
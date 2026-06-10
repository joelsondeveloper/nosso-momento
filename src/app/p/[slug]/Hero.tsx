"use client";

import { motion } from "framer-motion";

interface HeroSectionProps {
  names: string;
  themeColor: string;
  coverUrl?: string | null; // Adicionado para permitir a foto de capa
}

export default function HeroSection({
  names,
  themeColor,
  coverUrl,
}: HeroSectionProps) {
  
  // Função para descer a página
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="hero-section"
      className="relative h-screen overflow-hidden flex flex-col items-center justify-center p-4 transition-colors duration-1000"
      style={{
        backgroundColor: themeColor, // Cor de fundo dinâmica do banco de dados
      }}
    >
      {/* Shape superior (Decoração Animada) */}
      <motion.div
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.1, 0.9, 1],
          x: [0, 20, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -top-48
          -left-32
          w-[500px]
          h-[500px]
          rounded-full
          bg-white/20
          blur-3xl
        "
      />

      {/* Shape inferior (Decoração Animada) */}
      <motion.div
        animate={{
          rotate: [0, -20, 20, 0],
          scale: [1, 1.2, 1, 1],
          y: [0, 30, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -bottom-52
          -right-40
          w-[600px]
          h-[600px]
          rounded-full
          bg-black/10
          blur-3xl
        "
      />

      {/* Conteúdo Principal */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        
        {/* Texto de Categoria (Wrapped Style) */}
        <motion.p
          initial={{ opacity: 0, tracking: "0.1em" }}
          animate={{ opacity: 1, tracking: "0.3em" }}
          transition={{ duration: 1 }}
          className="
            text-black/60
            font-black
            uppercase
            mb-8
            text-xs
            md:text-sm
            tracking-[0.3em]
          "
        >
          Sua Retrospectiva 2024
        </motion.p>

        {/* Foto de Capa (O toque final do Spotify) */}
        {coverUrl && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="mb-8 w-48 h-48 md:w-64 md:h-64 shadow-2xl rounded-lg overflow-hidden border-4 border-white"
          >
            <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Nomes em Destaque */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1], // Ease out expo para suavidade
          }}
          className="
            text-6xl
            md:text-8xl
            font-black
            text-white
            leading-[0.9]
            tracking-tighter
            drop-shadow-lg
          "
        >
          {names}
        </motion.h1>

        {/* Subtexto */}
        <motion.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="
            mt-6
            text-white/90
            text-lg
            md:text-xl
            max-w-md
            mx-auto
            font-medium
          "
        >
          Um ano de momentos que se tornaram sua trilha favorita.
        </motion.p>

        {/* Botão de Ação */}
        <motion.button
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "#fff",
            color: "#000",
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={scrollToNext}
          className="
            mt-10
            px-10
            py-4
            rounded-full
            bg-white
            text-black
            font-black
            text-lg
            shadow-2xl
            cursor-pointer
            transition-all
            uppercase
            tracking-tight
          "
        >
          Começar a ouvir →
        </motion.button>
      </div>

      {/* Indicador de Scroll (Seta) */}
      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="
          absolute
          bottom-10
          text-white/80
          text-3xl
        "
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M7 13L12 18L17 13M7 6L12 11L17 6" />
        </svg>
      </motion.div>
    </section>
  );
}
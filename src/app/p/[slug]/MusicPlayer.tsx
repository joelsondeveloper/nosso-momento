"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";
import Image from "next/image";

// Função para extrair o ID do vídeo do YouTube
function getYouTubeId(url: string) {
  try {
    if (!url) return null;
    if (url.includes("youtu.be")) return url.split("/").pop()?.split("?")[0] || null;
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

// Limpa o título do vídeo para não aparecer "Official Video", etc.
function cleanTitle(title: string) {
  return title
    .replace(/\(.*?(lyric|official|video|audio|mv|clipe|letra).*?\)/gi, "")
    .replace(/\[.*?(lyric|official|video|audio|mv|clipe|letra).*?\]/gi, "")
    .trim();
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  url: string;
  coverUrl: string | null;
  names: string;
  themeColor: string;
}

export default function MusicPlayer({
  url,
  coverUrl,
  names,
  themeColor,
}: MusicPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [songTitle, setSongTitle] = useState("Sua Música Tema");
  const [songArtist, setSongArtist] = useState("");
  const [thumbUrl, setThumbUrl] = useState<string | null>(coverUrl);
  const [isLiked, setIsLiked] = useState(true);

  const videoId = getYouTubeId(url);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const startTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      if (!playerRef.current) return;
      const cur = playerRef.current.getCurrentTime?.() || 0;
      const dur = playerRef.current.getDuration?.() || 0;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress(dur > 0 ? (cur / dur) * 100 : 0);
    }, 500);
  }, []);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!videoId) return;
    if (!coverUrl) {
      setThumbUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }
  }, [videoId, coverUrl]);

  useEffect(() => {
    if (!videoId) return;

    const initPlayer = () => {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(80);
            setDuration(e.target.getDuration());
            setReady(true);
            try {
              const data = e.target.getVideoData();
              if (data?.title) {
                const parts = data.title.split(" - ");
                if (parts.length >= 2) {
                  setSongArtist(cleanTitle(parts[0]));
                  setSongTitle(cleanTitle(parts.slice(1).join(" - ")));
                } else {
                  setSongTitle(cleanTitle(data.title));
                  setSongArtist(names);
                }
              }
            } catch {}
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              startTracking();
            } else {
              setPlaying(false);
              stopTracking();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.getElementById("yt-api")) {
        const tag = document.createElement("script");
        tag.id = "yt-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    return () => stopTracking();
  }, [videoId, names, startTracking, stopTracking]);

  function togglePlay() {
    if (!playerRef.current || !ready) return;
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const computedPercentage = clickX / rect.width;
    playerRef.current.seekTo(computedPercentage * duration, true);
  }

  if (!videoId) return null;

  return (
    <section 
      id="musicplayer-section"
      className="min-h-screen w-full flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: "#0c0211" }}
    >
      {/* Atmosfera de fundo */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.22, 0.12],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-112.5 h-112.5 rounded-full blur-[140px]"
        style={{ backgroundColor: themeColor }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Badge superior */}
        <div className="text-center mb-10">
          <span className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.25em] inline-flex items-center gap-1.5 shadow-md">
            <Music size={12} className="text-pink-400 fill-pink-400/20" />
            A Trilha Sonora de 2024
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white mt-4">
            NOSSA <br />
            <span style={{ color: themeColor }}>MÚSICA.</span>
          </h2>
        </div>

        {/* Player Card */}
        <div className="bg-purple-950/45 border border-white/10 backdrop-blur-xl p-8 rounded-[36px] shadow-2xl relative overflow-hidden">
          
          {/* Vinyl / Capa do Álbum */}
          <div className="relative flex justify-center mb-8">
            <motion.div
              animate={{ 
                scale: playing ? 1.05 : 0.95,
                rotate: playing ? 360 : 0
              }}
              transition={{ 
                scale: { duration: 0.6, ease: "easeInOut" },
                rotate: playing ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 0.6 }
              }}
              className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-purple-950 flex items-center justify-center relative bg-zinc-800"
              onClick={togglePlay}
            >
              {thumbUrl ? (
                <Image src={thumbUrl} alt="Capa" 
                width={200} height={200}
                className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">❤️</span>
              )}
              {/* Buraco central do Vinil */}
              <div className="absolute w-8 h-8 rounded-full bg-purple-950 border-4 border-black/30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-900" />
              </div>
            </motion.div>
          </div>

          {/* Info da Música */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex-1 min-w-0 pr-4 text-left">
              <h3 className="text-lg font-black text-white truncate tracking-tight">
                {songTitle}
              </h3>
              <p className="text-xs text-white/50 truncate mt-0.5">
                {songArtist || names}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsLiked(!isLiked)}
              className="flex-shrink-0 cursor-pointer"
            >
              <Heart 
                size={22} 
                className={`transition-all ${isLiked ? "fill-pink-500 text-pink-500 scale-110" : "text-white/40"}`} 
              />
            </motion.button>
          </div>

          {/* Barra de Progresso */}
          <div className="py-3 cursor-pointer" onClick={handleProgressClick}>
            <div className="h-1.5 bg-white/10 rounded-full relative overflow-hidden">
              <motion.div
                className="h-full bg-white relative rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex justify-between text-[10px] text-white/40 font-mono font-bold mt-1 mb-6">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => playerRef.current?.seekTo(Math.max(0, currentTime - 10), true)}
              className="p-3 text-white/50 hover:text-white transition-colors"
            >
              <SkipBack size={24} fill="currentColor" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              disabled={!ready}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
                ready ? "bg-white text-purple-950" : "bg-white/10 text-white/30"
              }`}
            >
              {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => playerRef.current?.seekTo(Math.min(duration, currentTime + 10), true)}
              className="p-3 text-white/50 hover:text-white transition-colors"
            >
              <SkipForward size={24} fill="currentColor" />
            </motion.button>
          </div>

          {/* Barrinhas animadas */}
          <AnimatePresence>
            {playing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 18 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-end justify-center gap-1.5 mt-6 mb-1 pointer-events-none"
              >
                {[0.1, 0.3, 0.45, 0.2, 0.1, 0.35, 0.25, 0.15, 0.4, 0.2].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "100%", "20%"] }}
                    transition={{
                      duration: 0.6 + delay * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-1 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* YouTube escondido */}
      <div className="absolute w-1 h-1 overflow-hidden opacity-0 pointer-events-none">
        <div ref={containerRef} />
      </div>
    </section>
  );
}
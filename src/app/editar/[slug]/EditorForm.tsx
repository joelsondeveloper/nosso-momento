"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Page, Moment } from "@/lib/types";
import { generatePalette } from "@/lib/palette";

const STEPS = ["Nomes", "Mensagem", "Fotos", "Momentos", "Música", "Tema"];

export default function EditForm({ page }: { page: Page }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [names, setNames] = useState(page.names);
  const [startDate, setStartDate] = useState(page.start_date);
  const [message, setMessage] = useState(page.message || "");
  const [musicUrl, setMusicUrl] = useState(page.music_url || "");
  const [existingPhotos, setExistingPhotos] = useState<string[]>(page.photos);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [moments, setMoments] = useState<Moment[]>(
    page.moments.length > 0
      ? page.moments
      : [{ date: "", title: "", description: "" }],
  );
  const [themeColor, setThemeColor] = useState(page.theme_color || "#ec4899");

  function nextStep() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSave() {
    setLoading(true);
    const supabase = createClient();

    // Upload de novas fotos
    const newPhotoUrls: string[] = [];
    for (const photo of newPhotos) {
      const ext = photo.name.split(".").pop();
      const path = `${page.user_id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("photos")
        .upload(path, photo);
      if (!error) {
        const { data } = supabase.storage.from("photos").getPublicUrl(path);
        newPhotoUrls.push(data.publicUrl);
      }
    }

    const { error } = await supabase
      .from("pages")
      .update({
        names,
        start_date: startDate,
        message,
        music_url: musicUrl || null,
        photos: [...existingPhotos, ...newPhotoUrls],
        moments: moments.filter((m) => m.title),
        theme_color: themeColor,
      })
      .eq("id", page.id);

    if (!error) router.push(`/p/${page.slug}`);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-pink-500" : "bg-gray-100"}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">{STEPS[step]}</h2>
          <span className="text-xs text-gray-400">Editando: {page.names}</span>
        </div>

        {/* Step 0 - Nomes */}
        {step === 0 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ex: João & Maria"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Desde quando estão juntos?
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
        )}

        {/* Step 1 - Mensagem */}
        {step === 1 && (
          <textarea
            placeholder="Escreva uma mensagem especial..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
          />
        )}

        {/* Step 2 - Fotos */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Fotos existentes */}
            {existingPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {existingPhotos.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      className="rounded-xl object-cover w-full aspect-square"
                    />
                    <button
                      onClick={() =>
                        setExistingPhotos(
                          existingPhotos.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="block border-2 border-dashed border-pink-200 rounded-xl p-6 text-center cursor-pointer hover:border-pink-400 transition">
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm text-gray-500">Adicionar mais fotos</p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setNewPhotos(Array.from(e.target.files || []))}
              />
            </label>
            {newPhotos.length > 0 && (
              <p className="text-sm text-pink-500 text-center">
                {newPhotos.length} nova(s) foto(s)
              </p>
            )}
          </div>
        )}

        {/* Step 3 - Momentos */}
        {step === 3 && (
          <div className="space-y-4">
            {moments.map((moment, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-4 space-y-2"
              >
                <input
                  type="text"
                  placeholder="Título"
                  value={moment.title}
                  onChange={(e) => {
                    const updated = [...moments];
                    updated[i].title = e.target.value;
                    setMoments(updated);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <input
                  type="date"
                  value={moment.date}
                  onChange={(e) => {
                    const updated = [...moments];
                    updated[i].date = e.target.value;
                    setMoments(updated);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <input
                  type="text"
                  placeholder="Descrição"
                  value={moment.description}
                  onChange={(e) => {
                    const updated = [...moments];
                    updated[i].description = e.target.value;
                    setMoments(updated);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                {moments.length > 1 && (
                  <button
                    onClick={() =>
                      setMoments(moments.filter((_, idx) => idx !== i))
                    }
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            {moments.length < 5 && (
              <button
                onClick={() =>
                  setMoments([
                    ...moments,
                    { date: "", title: "", description: "" },
                  ])
                }
                className="text-sm text-pink-500 hover:underline"
              >
                + Adicionar momento
              </button>
            )}
          </div>
        )}

        {/* Step 4 - Música */}
        {step === 4 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Cole um link do Spotify ou YouTube
            </p>
            <input
              type="url"
              placeholder="https://open.spotify.com/..."
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        )}

        {/* Step 5 - Tema */}
        {step === 5 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Escolha uma cor base para a página do casal
            </p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-20 h-20 rounded-2xl cursor-pointer border-0 bg-transparent"
              />
              <p className="text-sm font-mono text-gray-400">{themeColor}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(generatePalette(themeColor)).map(
                ([key, color]) => (
                  <div key={key} className="flex flex-col items-center gap-1">
                    <div
                      className="w-full h-10 rounded-lg shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-400">{key}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Navegação */}
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={prevStep}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ← Voltar
            </button>
          ) : (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ← Dashboard
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition"
            >
              Continuar →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl px-6 py-2.5 transition"
            >
              {loading ? "Salvando..." : "Salvar 💕"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

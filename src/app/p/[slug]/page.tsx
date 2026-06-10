import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Page } from "@/lib/types";
import QRSection from "./QRSection";
import MusicPlayer from "./MusicPlayer";
import Counter from "./Counter";
import PageWrapper from "./PageWrapper";
import HeroSection from "./Hero";
import TopHits from "./TopsHits";
import MessageSection from "./MessageSection";

export default async function PageView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) notFound();

  const page = data as Page;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/p/${page.slug}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100">
      <PageWrapper>
        {/* Hero Section */}
        <HeroSection
          names={page.names}
          coverUrl={page.photos[0] ?? null}
          themeColor={page.theme_color || "#ec4899"}
        />

        {/* Contador */}
        <Counter
          startDate={page.start_date}
          themeColor={page.theme_color || "#ec4899"}
          names={page.names}
        />

        <TopHits moments={page.moments} photos={page.photos} themeColor={page.theme_color || "#ec4899"} />

        <MessageSection message={page.message} names={page.names} themeColor={page.theme_color || "#ec4899"} />

        {/* Música */}
        {page.music_url && (
          <MusicPlayer
            url={page.music_url}
            coverUrl={page.photos[0] ?? null}
            names={page.names}
            themeColor={page.theme_color || "#ec4899"}
          />
        )}

      </PageWrapper>
    </main>
  );
}

import { useEffect, useState } from "react";
import Header from "@/components/sambal/Header";
import Hero from "@/components/sambal/Hero";
import Features from "@/components/sambal/Features";
import Products from "@/components/sambal/Products";
import EcommerceLinks from "@/components/sambal/EcommerceLinks";
import Testimonials from "@/components/sambal/Testimonials";
import Cta from "@/components/sambal/Cta";
import Footer from "@/components/sambal/Footer";
import MapLocation from "@/components/sambal/MapLocation";
import Stats from "@/components/sambal/Stats";
import ChatWidget from "@/components/ChatWidget"; // Import the new ChatWidget
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface ContentSnippet {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

const LandingPage = () => {
  const [contentMap, setContentMap] = useState<Map<string, string>>(new Map());
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoadingContent(true);
      const { data, error } = await supabase.from("content").select("*");
      if (error) {
        showError("Gagal memuat konten landing page.");
        console.error("Error fetching landing page content:", error);
      } else {
        const newContentMap = new Map<string, string>();
        data.forEach((snippet: ContentSnippet) => {
          newContentMap.set(snippet.key, snippet.value);
        });
        setContentMap(newContentMap);
      }
      setLoadingContent(false);
    };

    fetchContent();
  }, []);

  const getContent = (key: string, defaultValue: string = "") => {
    return contentMap.get(key) || defaultValue;
  };

  if (loadingContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Memuat konten...</p>
      </div>
    );
  }

  return (
    <div
      className="font-sans text-gray-800 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/sambal-background.jpeg')",
      }}
    >
      <Header />
      <main>
        <Hero
          title={getContent('hero_title', '🔥 Sambal Maknyuuus <br /> <span class="text-red-400">Pedasnya Bikin Ketagihan!</span> 🔥')}
          description={getContent('hero_description', 'Pecinta sambal, ini dia sambal yang harus ada di setiap meja makan! Sambal Maknyuuus, sambal dengan rasa pedas dan gurih yang bisa menggugah selera siapa saja! 🌶️')}
        />
        <Features
          title={getContent('features_title', '✨ Kenapa Harus Pilih Sambal Maknyuuus?')}
        />
        <Stats
          title={getContent('stats_title', 'Kepercayaan Anda, Kebanggaan Kami')}
        />
        <Products
          title={getContent('products_title', 'Produk Tersedia')}
          searchPlaceholder={getContent('products_search_placeholder', 'Cari produk sambal...')}
        />
        <EcommerceLinks
          title={getContent('ecommerce_title', 'Beli Sekarang di E-commerce Favoritmu')}
          description={getContent('ecommerce_description', 'Dapatkan Sambal Maknyuuus dengan mudah dan cepat melalui platform e-commerce terpercaya. Klik untuk langsung menuju toko kami!')}
        />
        <Testimonials
          title={getContent('testimonials_title', 'Apa Kata Mereka?')}
        />
        <Cta
          title={getContent('cta_title', 'Ada Pertanyaan atau Pesanan Khusus?')}
          description={getContent('cta_description', 'Tim kami siap membantu! Klik tombol di bawah untuk terhubung langsung dengan kami melalui WhatsApp untuk informasi lebih lanjut atau pesanan dalam jumlah besar.')}
          buttonText={getContent('cta_button_text', '💬 Hubungi Kami di WhatsApp')}
          whatsappLink={getContent('cta_whatsapp_link', 'https://wa.me/6282366669961?text=Halo,%20saya%20tertarik%20dengan%20Sambal%20Maknyuuus!')}
        />
        <MapLocation
          title={getContent('map_title', 'Temukan Kami di Sini')}
          description={getContent('map_description', 'Kunjungi kami langsung di Lam Hasan Aceh Besar untuk merasakan sensasi pedas Sambal Maknyuuus!')}
          iframeSrc={getContent('map_iframe_src', 'https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d1985.6202556690998!2d95.282382!3d5.531297!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMzEnNTIuNyJOIDk1wrAxNic1Ni42IkU!5e0!3m2!1sid!2sid!4v1757922841091!5m2!1sid!2sid')}
        />
      </main>
      <Footer
        instagramLink={getContent('footer_instagram_link', 'https://www.instagram.com/sambalmaknyuuus_medan')}
        hashtags={getContent('footer_hashtags', '#SambalMaknyuuus #PedasBikinKetagihan #SambalEnak')}
        copyright={getContent('footer_copyright', '© 2024 Sambal Maknyuuus. All rights reserved.')}
      />
      <ChatWidget webhookUrl="YOUR_PRODUCTION_WEBHOOK_URL" />
    </div>
  );
};

export default LandingPage;
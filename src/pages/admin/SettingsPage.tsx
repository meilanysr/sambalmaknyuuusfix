import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface StoreSettings {
  [key: string]: string;
}

const settingsConfig = {
  footer_copyright: {
    label: "Teks Copyright Footer",
    description: "Teks lengkap yang muncul di bagian bawah halaman.",
  },
  map_description: {
    label: "Deskripsi Lokasi Peta",
    description: "Deskripsi yang ditampilkan di atas peta lokasi.",
  },
  cta_whatsapp_link: {
    label: "Tautan WhatsApp CTA",
    description: "Tautan lengkap untuk tombol 'Hubungi via WhatsApp'.",
  },
  footer_instagram_link: {
    label: "Tautan Instagram",
    description: "Tautan lengkap ke profil Instagram Anda.",
  },
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<StoreSettings>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const keysToFetch = Object.keys(settingsConfig);
      const { data, error } = await supabase
        .from("content")
        .select("key, value")
        .in("key", keysToFetch);

      if (error) {
        showError("Gagal memuat pengaturan.");
        console.error(error);
      } else {
        const fetchedSettings = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {} as StoreSettings);
        setSettings(fetchedSettings);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatePromises = Object.entries(settings).map(([key, value]) =>
      supabase.from("content").update({ value }).eq("key", key)
    );

    const results = await Promise.all(updatePromises);
    const hasError = results.some(res => res.error);

    if (hasError) {
      showError("Gagal menyimpan beberapa perubahan.");
      results.forEach(res => {
        if (res.error) console.error(res.error);
      });
    } else {
      showSuccess("Perubahan berhasil disimpan!");
    }
    setIsSaving(false);
  };

  const renderSettingsForm = () => {
    if (loading) {
      return (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      );
    }

    return (
      <form onSubmit={handleSaveChanges}>
        <CardContent className="space-y-4">
          {Object.entries(settingsConfig).map(([key, config]) => (
            <div className="space-y-2" key={key}>
              <Label htmlFor={key}>{config.label}</Label>
              <Input
                id={key}
                value={settings[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={config.description}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </CardFooter>
      </form>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Pengaturan</h1>
      
      <Tabs defaultValue="store">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="store">Informasi Landing Page</TabsTrigger>
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="integrations">Integrasi</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Landing Page</CardTitle>
              <CardDescription>
                Perbarui informasi yang ditampilkan di halaman depan (landing page) Anda.
              </CardDescription>
            </CardHeader>
            {renderSettingsForm()}
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Akun</CardTitle>
              <CardDescription>
                Kelola pengaturan akun Anda.
              </CardDescription>
            </CardHeader>
            <form onSubmit={(e) => { e.preventDefault(); showSuccess("Fitur ini belum diimplementasikan."); }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Kata Sandi Baru</Label>
                  <Input id="new-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Ubah Kata Sandi</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrasi</CardTitle>
              <CardDescription>
                Hubungkan dengan layanan pihak ketiga.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fitur integrasi sedang dalam pengembangan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
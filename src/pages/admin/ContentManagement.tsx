import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentSnippet {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

const ContentManagement = () => {
  const [content, setContent] = useState<ContentSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("content").select("*").order("key");
    if (error) {
      showError("Gagal memuat konten.");
      console.error(error);
    } else {
      setContent(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (snippet: ContentSnippet) => {
    setIsSaving(true);
    const { error } = await supabase
      .from("content")
      .update({ value: snippet.value })
      .eq("id", snippet.id);

    if (error) {
      showError(`Gagal menyimpan: ${error.message}`);
    } else {
      showSuccess(`Konten "${snippet.key}" berhasil disimpan.`);
    }
    setIsSaving(false);
  };

  const handleContentChange = (id: string, value: string) => {
    setContent(prev =>
      prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Manajemen Konten Halaman Depan</h1>
      
      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-24 mt-4" />
              </CardContent>
            </Card>
          ))
        ) : (
          content.map(snippet => (
            <Card key={snippet.id}>
              <CardHeader>
                <CardTitle className="capitalize">{snippet.key.replace(/_/g, ' ')}</CardTitle>
                {snippet.description && <CardDescription>{snippet.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave(snippet); }}>
                  <Label htmlFor={snippet.key} className="sr-only">Value</Label>
                  <Textarea
                    id={snippet.key}
                    value={snippet.value}
                    onChange={(e) => handleContentChange(snippet.id, e.target.value)}
                    rows={snippet.value.length > 100 ? 5 : 3}
                  />
                  <Button type="submit" className="mt-4" disabled={isSaving}>
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
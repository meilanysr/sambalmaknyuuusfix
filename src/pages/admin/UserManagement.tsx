import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/utils/toast";

const newUserSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

type NewUserFormData = z.infer<typeof newUserSchema>;

const UserManagement = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchema),
  });

  const handleAddAdmin = async (data: NewUserFormData) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Admin baru dengan email ${data.email} berhasil ditambahkan. Mereka perlu memverifikasi email mereka.`);
      reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-6">Manajemen Admin</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Tambah Admin Baru</CardTitle>
          <CardDescription>
            Buat akun admin baru. Pengguna akan menerima email konfirmasi untuk memverifikasi akun mereka sebelum dapat login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleAddAdmin)} className="space-y-4">
            <div>
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="admin@example.com"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menambahkan..." : "Tambah Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
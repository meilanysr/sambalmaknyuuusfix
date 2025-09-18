import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login-background.jpeg')" }}
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login to Admin Panel</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Login;
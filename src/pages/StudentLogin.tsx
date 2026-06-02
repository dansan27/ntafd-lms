import { useSignIn, useAuth } from "@clerk/react";
import { Redirect } from "wouter";
import { motion } from "framer-motion";
import { Cpu, Activity, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentLogin() {
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect to="/" />;

  const handleMicrosoftLogin = () => {
    if (!isLoaded || !signIn) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_microsoft",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8 text-center"
      >
        <div className="space-y-3">
          <div className="flex justify-center gap-3 text-primary">
            <Cpu size={28} />
            <Activity size={28} />
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">NTAFD</h1>
          <p className="text-white/50 text-sm">
            Nuevas Tecnologías Aplicadas a la Actividad Física y el Deporte
          </p>
        </div>
        <div className="space-y-4">
          <Button
            onClick={handleMicrosoftLogin}
            disabled={!isLoaded}
            className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE] text-white font-medium gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Entrar con Microsoft UPC
          </Button>
          <p className="text-white/30 text-xs">
            Usa tu cuenta institucional @upc.edu.pe
          </p>
        </div>
      </motion.div>
    </div>
  );
}

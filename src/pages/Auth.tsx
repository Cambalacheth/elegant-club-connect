
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Import components
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import ResetEmailSent from "@/components/auth/ResetEmailSent";
import EmailVerification from "@/components/auth/EmailVerification";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmailAddress, setResetEmailAddress] = useState("");
  const [isVerificationProcessing, setIsVerificationProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"processing" | "success" | "error" | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const type = searchParams.get("type");
    const token = searchParams.get("token");
    
    if (type === "signup" && token) {
      handleEmailVerification(token);
    }
  }, [searchParams]);

  const handleEmailVerification = async (token: string) => {
    setIsVerificationProcessing(true);
    setVerificationStatus("processing");
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "signup",
      });

      if (error) {
        setVerificationStatus("error");
        throw error;
      }
      
      setVerificationStatus("success");
      toast({
        title: "Verificación completada",
        description: "Tu correo electrónico ha sido verificado correctamente.",
      });
      
      setTimeout(() => {
        navigate("/home");
      }, 3000);
      
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Error de verificación",
        description: error.message || "Ha ocurrido un error al verificar tu correo electrónico.",
        variant: "destructive",
      });
    } finally {
      setIsVerificationProcessing(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setResetEmailSent(false);
    setIsLogin(true);
  };

  const handleResetEmailSent = (email: string) => {
    setResetEmailAddress(email);
    setResetEmailSent(true);
  };

  const renderAuthContent = () => {
    if (verificationStatus) {
      return (
        <EmailVerification 
          status={verificationStatus} 
          onBackToLogin={() => {
            setVerificationStatus(null);
            setIsLogin(true);
          }} 
        />
      );
    }

    if (resetEmailSent) {
      return <ResetEmailSent email={resetEmailAddress} onBackToLogin={handleBackToLogin} />;
    }

    if (isForgotPassword) {
      return <PasswordResetForm onBackToLogin={handleBackToLogin} onResetEmailSent={handleResetEmailSent} />;
    }

    if (isLogin) {
      return <LoginForm onToggleMode={handleToggleMode} onForgotPassword={handleForgotPassword} />;
    }

    return <RegisterForm onToggleMode={handleToggleMode} />;
  };

  return (
    <div className="min-h-screen bg-club-beige">
      <div className="container mx-auto px-6 py-16">
        <button 
          onClick={() => navigate("/")}
          className="mb-8 flex items-center text-club-brown hover:text-club-terracota transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver
        </button>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          {renderAuthContent()}
        </div>
      </div>
    </div>
  );
};

export default Auth;

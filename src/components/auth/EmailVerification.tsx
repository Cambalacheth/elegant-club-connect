
import { CheckCircle2, AlertCircle } from "lucide-react";

interface EmailVerificationProps {
  status: "processing" | "success" | "error";
  onBackToLogin: () => void;
}

const EmailVerification = ({ status, onBackToLogin }: EmailVerificationProps) => {
  if (status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="h-12 w-12 bg-club-orange/30 rounded-full mb-4"></div>
          <h2 className="text-2xl font-semibold text-club-brown mb-4">Verificando tu email...</h2>
          <p className="text-club-brown/70">Este proceso puede tomar unos momentos.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-club-brown mb-4">¡Email verificado!</h2>
        <p className="text-club-brown/70 mb-6">Tu cuenta ha sido verificada correctamente.</p>
        <p className="text-club-brown/70">Redirigiendo al inicio...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-club-brown mb-4">Error de verificación</h2>
        <p className="text-club-brown/70 mb-6">No pudimos verificar tu correo electrónico. El enlace puede haber expirado o ser inválido.</p>
        <button 
          onClick={onBackToLogin}
          className="px-4 py-2 bg-club-orange text-white rounded-md hover:bg-club-terracota transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return null;
};

export default EmailVerification;

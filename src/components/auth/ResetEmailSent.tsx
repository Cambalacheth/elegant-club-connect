
interface ResetEmailSentProps {
  email: string;
  onBackToLogin: () => void;
}

const ResetEmailSent = ({ email, onBackToLogin }: ResetEmailSentProps) => {
  return (
    <div className="text-center">
      <p className="text-club-brown mb-6">
        Hemos enviado un correo electrónico a <strong>{email}</strong> con instrucciones para restablecer tu contraseña.
      </p>
      <p className="text-club-brown mb-6">
        Por favor revisa tu bandeja de entrada y sigue las instrucciones en el correo.
      </p>
      <button
        onClick={onBackToLogin}
        className="text-club-olive hover:text-club-terracota transition-colors"
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
};

export default ResetEmailSent;

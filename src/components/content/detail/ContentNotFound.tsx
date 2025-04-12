
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";

const ContentNotFound = () => {
  return (
    <div className="min-h-screen bg-club-beige">
      <Helmet>
        <title>Contenido no encontrado | Terreta Hub</title>
        <meta name="description" content="El contenido solicitado no pudo ser encontrado." />
      </Helmet>
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-16">
        <h1 className="text-4xl font-serif text-club-brown mb-8">
          Contenido no encontrado
        </h1>
      </div>
    </div>
  );
};

export default ContentNotFound;

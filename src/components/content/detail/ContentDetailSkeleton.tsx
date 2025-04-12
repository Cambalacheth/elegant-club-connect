
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";

const ContentDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-club-beige">
      <Helmet>
        <title>Cargando Contenido | Terreta Hub</title>
        <meta name="description" content="Cargando contenido de la comunidad..." />
      </Helmet>
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-16">
        <Skeleton className="h-12 w-2/3 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

export default ContentDetailSkeleton;

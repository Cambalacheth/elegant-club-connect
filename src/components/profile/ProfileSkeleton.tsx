
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSkeletonProps {
  currentLanguage: string;
}

export const ProfileHeaderSkeleton = () => (
  <div className="bg-club-olive/20 p-8">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="w-full max-w-md">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  </div>
);

export const AboutSectionSkeleton = () => (
  <div className="space-y-4 mb-6">
    <Skeleton className="h-6 w-32 mb-2" />
    <div className="bg-club-beige/40 p-6 rounded-lg">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

export const ProjectsSkeleton = () => (
  <div className="space-y-4 mb-6">
    <Skeleton className="h-6 w-32 mb-2" />
    <div className="space-y-4">
      {[1, 2].map((_, i) => (
        <div key={i} className="bg-club-beige/40 p-6 rounded-lg">
          <Skeleton className="h-5 w-48 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-6 w-24 mb-4" />
      <div className="bg-club-beige/40 p-6 rounded-lg space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
    <div>
      <Skeleton className="h-6 w-36 mb-4" />
      <div className="bg-club-beige/40 p-6 rounded-lg">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
);

const ProfileSkeleton = ({ currentLanguage }: ProfileSkeletonProps) => {
  return (
    <div className="min-h-screen bg-club-beige">
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ProfileHeaderSkeleton />
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <AboutSectionSkeleton />
                <ProjectsSkeleton />
              </div>
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

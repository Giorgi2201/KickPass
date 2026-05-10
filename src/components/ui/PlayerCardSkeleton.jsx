import { Skeleton } from "./Skeleton";
import Card from "./Card";

function PlayerCardSkeleton() {
  return (
    <Card className="flex flex-col items-center p-6">
      {/* Avatar */}
      <Skeleton
        width="4rem"
        height="4rem"
        rounded="rounded-full"
        className="mb-4"
      />
      
      {/* Name */}
      <Skeleton width="70%" height="1.25rem" className="mb-2" />
      
      {/* Position */}
      <Skeleton width="50%" className="mb-4" />
      
      {/* City */}
      <Skeleton width="60%" className="mb-2" />
      
      {/* Bio line */}
      <Skeleton width="80%" className="mb-4" />
      
      {/* Button */}
      <Skeleton width="100%" height="2.5rem" rounded="rounded-md" />
    </Card>
  );
}

export default PlayerCardSkeleton;

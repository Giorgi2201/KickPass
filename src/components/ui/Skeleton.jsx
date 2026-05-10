function Skeleton({
  width = "100%",
  height = "1rem",
  rounded = "rounded-md",
  className = "",
}) {
  return (
    <div
      className={`bg-gray-700 animate-pulse ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <Skeleton height="8rem" rounded="rounded-lg" className="mb-4" />
      <Skeleton width="60%" className="mb-2" />
      <Skeleton width="40%" className="mb-2" />
      <Skeleton width="80%" />
    </div>
  );
}

export { Skeleton, SkeletonCard };
export default Skeleton;

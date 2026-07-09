export default function Loading() {
  return (
    <div className="container-page py-8 space-y-8">
      <div className="h-[400px] skeleton rounded-xl" />
      <div className="h-8 skeleton w-1/3" />
      <div className="h-4 skeleton w-1/2" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 skeleton rounded-lg" />
        <div className="h-20 skeleton rounded-lg" />
        <div className="h-20 skeleton rounded-lg" />
      </div>
    </div>
  );
}

import React from "react";

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="py-3 px-4 sm:px-6 lg:px-8 border-b border-gray-100 flex items-center gap-2">
        <div className="w-12 h-3 bg-gray-200 animate-pulse rounded" />
        <span className="text-gray-300 text-xs">/</span>
        <div className="w-16 h-3 bg-gray-200 animate-pulse rounded" />
        <span className="text-gray-300 text-xs">/</span>
        <div className="w-20 h-3 bg-gray-200 animate-pulse rounded" />
        <span className="text-gray-300 text-xs">/</span>
        <div className="w-28 h-3 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Main Layout Skeleton */}
      <div className="flex flex-col lg:flex-row gap-0 items-start w-full">
        {/* Gallery Skeleton */}
        <div className="w-full lg:w-[55%]">
          {/* Mobile view (< md): single hero image + thumbnail row */}
          <div className="block md:hidden">
            <div className="w-full aspect-[4/5] sm:aspect-[4/3] bg-gray-200 animate-pulse rounded-sm" />
            <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-100">
              <div className="w-14 h-16 rounded bg-gray-200 animate-pulse shrink-0" />
              <div className="w-14 h-16 rounded bg-gray-200 animate-pulse shrink-0" />
              <div className="w-14 h-16 rounded bg-gray-200 animate-pulse shrink-0" />
              <div className="w-14 h-16 rounded bg-gray-200 animate-pulse shrink-0" />
            </div>
          </div>

          {/* Desktop view (>= md): grid */}
          <div className="hidden md:grid grid-cols-2 gap-[2px]">
            <div className="col-span-2 aspect-[4/3] bg-gray-200 animate-pulse" />
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
            <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Details Panel Skeleton */}
        <div className="w-full lg:w-[45%] px-4 sm:px-6 py-6 lg:pl-8 lg:pr-6 border-t lg:border-t-0 lg:border-l border-gray-100 space-y-5">
          {/* Brand */}
          <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />

          {/* Name */}
          <div className="space-y-2">
            <div className="w-4/5 h-7 bg-gray-200 animate-pulse rounded" />
            <div className="w-2/5 h-7 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-20 h-3 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Description */}
          <div className="space-y-2 py-1">
            <div className="w-full h-3.5 bg-gray-200 animate-pulse rounded" />
            <div className="w-11/12 h-3.5 bg-gray-200 animate-pulse rounded" />
            <div className="w-3/4 h-3.5 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Delivery Box Skeleton */}
          <div className="border border-gray-200 rounded p-4 space-y-3">
            <div className="w-full h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Colour Swatches Skeleton */}
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-200 animate-pulse rounded" />
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>

          {/* Size Selector Skeleton */}
          <div className="space-y-2">
            <div className="w-20 h-3 bg-gray-200 animate-pulse rounded" />
            <div className="flex gap-2">
              <div className="w-12 h-8 rounded bg-gray-200 animate-pulse" />
              <div className="w-12 h-8 rounded bg-gray-200 animate-pulse" />
              <div className="w-12 h-8 rounded bg-gray-200 animate-pulse" />
              <div className="w-12 h-8 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="flex gap-2 pt-2">
            <div className="flex-1 h-12 bg-gray-300 animate-pulse rounded" />
            <div className="w-12 h-12 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Trust Row Skeleton */}
          <div className="flex gap-4 pt-3">
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-24 h-4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-2">
      <div className="w-full aspect-[3/4] bg-gray-200 animate-pulse rounded" />
      <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded" />
      <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded" />
    </div>
  );
};

export default ProductDetailsSkeleton;

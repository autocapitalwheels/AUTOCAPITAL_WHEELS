'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Vehicle } from '@/types';
import { formatPrice, formatMileage, getVehicleTitle } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  onWishlistToggle?: (vehicleId: string) => void;
  isWishlisted?: boolean;
  variant?: 'grid' | 'list';
}

export default function VehicleCard({
  vehicle,
  onWishlistToggle,
  isWishlisted = false,
  variant = 'grid',
}: VehicleCardProps) {
  const title = getVehicleTitle(vehicle);
  const isSold = vehicle.status === 'Sold' || vehicle.availability === 'Sold';
  const imageUrl = vehicle.main_image_url || '/placeholder-car.jpg';

  if (variant === 'list') {
    return (
      <div className={`vehicle-card flex gap-0 overflow-hidden ${isSold ? 'opacity-75' : ''}`}>
        {/* Image */}
        <div className="vehicle-card-image flex-shrink-0 w-52 h-36 relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="208px"
            className="object-cover"
            loading="lazy"
          />
          {isSold && (
            <div className="absolute inset-0 bg-neutral-950/60 flex items-center justify-center">
              <span className="badge badge-sold text-xs">SOLD</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 bg-[#ffffff]">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <Link href={`/cars/${vehicle.slug}`} className="hover:opacity-80">
                <h3 className="font-display font-bold text-base text-neutral-900 leading-snug">{title}</h3>
              </Link>
              {onWishlistToggle && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlistToggle(vehicle.id); }}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-neutral-100 transition-colors z-10 cursor-pointer"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={14} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400 hover:text-red-500'} />
                </button>
              )}
            </div>
            <p className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400">
              {vehicle.year} &bull; {vehicle.fuel_type} &bull; {vehicle.transmission} &bull; {formatMileage(vehicle.mileage)}
            </p>
          </div>
          <div className="flex items-end justify-between border-t border-neutral-100 pt-3">
            <span className="font-display font-bold text-base text-neutral-950">{formatPrice(vehicle.price)}</span>
            <Link href={`/cars/${vehicle.slug}`} className="text-[10px] font-bold tracking-widest text-neutral-900 uppercase hover:opacity-75 transition-opacity">
              View Details &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`vehicle-card group relative bg-white flex flex-col justify-between ${isSold ? 'opacity-85' : ''}`}>
      {/* Image */}
      <div className="vehicle-card-image h-48 relative">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />

        {/* Sold overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-neutral-950/50 flex items-center justify-center">
            <span className="badge badge-sold text-xs">SOLD</span>
          </div>
        )}

        {/* Wishlist button */}
        {onWishlistToggle && !isSold && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlistToggle(vehicle.id); }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 shadow-sm transition-all hover:scale-105 z-10 cursor-pointer"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={13}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-400 hover:text-red-500'}
            />
          </button>
        )}

        {/* Marketing badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {vehicle.is_featured && <span className="badge badge-featured">Featured</span>}
          {vehicle.is_new_arrival && !vehicle.is_featured && <span className="badge badge-new">New</span>}
          {vehicle.is_price_drop && <span className="badge badge-price-drop">Price Drop</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Metadata */}
          <p className="text-[9px] tracking-widest uppercase font-bold text-neutral-400 mb-1.5">
            {vehicle.year} &bull; {vehicle.fuel_type.toUpperCase()} &bull; {vehicle.transmission.toUpperCase()}
          </p>

          <Link href={`/cars/${vehicle.slug}`} className="block hover:opacity-75 transition-opacity">
            <h3 className="font-display font-semibold text-sm text-neutral-900 tracking-tight leading-tight">
              {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.variant && (
              <p className="text-[10px] text-neutral-400 mt-0.5 font-light">{vehicle.variant}</p>
            )}
          </Link>
        </div>

        {/* Price & Action */}
        <div className="border-t border-neutral-100 mt-4 pt-3 flex items-center justify-between">
          <span className="font-display font-semibold text-sm text-neutral-950">{formatPrice(vehicle.price)}</span>
          <Link href={`/cars/${vehicle.slug}`} className="text-[10px] font-bold tracking-widest text-neutral-900 uppercase hover:opacity-70 transition-opacity">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

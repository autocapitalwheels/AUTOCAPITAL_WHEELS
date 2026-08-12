import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString('en-IN')} km`;
}

export function formatYear(year: number): string {
  return year.toString();
}

export function getOwnershipLabel(n?: number): string {
  if (!n) return 'N/A';
  const labels: Record<number, string> = {
    1: '1st Owner',
    2: '2nd Owner',
    3: '3rd Owner',
    4: '4th Owner',
    5: '5th Owner',
    6: '6+ Owners',
  };
  return labels[n] || `${n} Owners`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateId(prefix: string = ''): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const id = Array.from({ length: 8 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
  return prefix ? `${prefix}-${id}` : id;
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function getVehicleWhatsAppMessage(vehicleName: string): string {
  return `Hello AutoCapital Wheels, I am interested in the ${vehicleName}. Please share more details.`;
}

export function getDefaultWhatsAppMessage(): string {
  return 'Hello AutoCapital Wheels, I would like to know more about your cars.';
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getVehicleTitle(vehicle: { year: number; make: string; model: string; variant?: string }): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.variant ? ` ${vehicle.variant}` : ''}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    FOLLOW_UP: 'bg-orange-100 text-orange-800',
    NEGOTIATION: 'bg-purple-100 text-purple-800',
    CONVERTED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    Active: 'bg-green-100 text-green-800',
    Draft: 'bg-gray-100 text-gray-800',
    Reserved: 'bg-yellow-100 text-yellow-800',
    Sold: 'bg-red-100 text-red-800',
    Archived: 'bg-gray-100 text-gray-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

import type { Metadata } from 'next';
import SellCarClient from '@/components/public/SellCarClient';

export const metadata: Metadata = {
  title: 'Sell Your Car — AutoCapital Wheels',
  description: 'Submit your vehicle details and our team will review your car and contact you with the next steps. Sell your pre-owned car through AutoCapital Wheels in Delhi.',
};

export default function SellPage() {
  return (
    <div className="pt-16">
      <SellCarClient />
    </div>
  );
}

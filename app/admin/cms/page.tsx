import { redirect } from 'next/navigation';

export default function AdminCMSPage() {
  // CMS settings are consolidated under settings/contact information.
  redirect('/admin/settings');
}

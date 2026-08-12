import { Shield, Eye, Users, Star, CheckCircle, Handshake } from 'lucide-react';

const trustPoints = [
  {
    icon: Shield,
    title: 'Quality Vehicles',
    description:
      'Each vehicle is carefully reviewed before listing. Vehicle details are provided as supplied and verified where possible.',
  },
  {
    icon: Eye,
    title: 'Transparent Deals',
    description:
      'We provide clear vehicle information, honest pricing, and upfront details — no hidden surprises.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description:
      'Simple enquiry and buying process. Our team is available to guide you from enquiry to delivery.',
  },
  {
    icon: Handshake,
    title: 'Trusted Assistance',
    description:
      'Whether you are buying or selling, our team helps throughout the process and handles your queries.',
  },
  {
    icon: CheckCircle,
    title: 'Complete Documentation',
    description:
      'Insurance status, RC availability, ownership history, and PUC status are clearly documented for each vehicle.',
  },
  {
    icon: Star,
    title: 'After-Purchase Support',
    description:
      'Our relationship with you does not end at the sale. We are available for any questions or concerns you have.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 bg-white border-t border-neutral-200/50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="section-label text-neutral-400 font-bold tracking-widest text-xs">WHY AUTOCAPITAL WHEELS</span>
          </div>
          <h2 className="font-display font-light text-3xl sm:text-4xl text-neutral-900">
            The AutoCapital <span className="font-bold">Difference</span>
          </h2>
          <p className="text-neutral-500 mt-4 max-w-xl mx-auto text-sm font-light">
            We built this dealership on a simple principle: be the kind of car dealer you can actually trust.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustPoints.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-1 border-b border-neutral-200/60 pb-6 transition-all"
            >
              <div className="text-neutral-700 mb-4">
                <Icon size={24} className="stroke-[1.5]" />
              </div>
              <h3 className="font-display font-semibold text-base text-neutral-900 mb-2">{title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

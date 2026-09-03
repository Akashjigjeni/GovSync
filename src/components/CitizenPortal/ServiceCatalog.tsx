import React, { useState } from 'react';
import {
  Sprout,
  GraduationCap,
  ShoppingBag,
  Car,
  HeartPulse,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const ServiceCatalog: React.FC = () => {
  const { services, setSelectedServiceForApply, applications, t } = useGovSync();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['ALL', 'Agriculture', 'Education', 'Social Welfare', 'Transport', 'Healthcare', 'Revenue'];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return <Sprout className="w-6 h-6 text-[#138808]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#005A9C]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-[#FF9933]" />;
      case 'Car':
        return <Car className="w-6 h-6 text-[#003366]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-[#B22222]" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-[#005A9C]" />;
      default:
        return <Layers className="w-6 h-6 text-[#005A9C]" />;
    }
  };

  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'ALL' || srv.category === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.benefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search government schemes, welfare benefits, license renewals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D9D9D9] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#333333] placeholder-[#666666] focus:outline-none focus:border-[#005A9C] focus:ring-1 focus:ring-[#005A9C] shadow-xs font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#005A9C] text-white shadow-xs'
                  : 'bg-white text-[#666666] hover:text-[#005A9C] border border-[#D9D9D9] shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const existingApp = applications.find((a) => a.serviceId === service.id);

          return (
            <div
              key={service.id}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Header with Category Badge & Processing Mode */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#D9D9D9] shadow-xs">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#F7F7F7] text-[#666666] border border-[#D9D9D9]">
                      {service.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        service.processingType === 'MODERN_REST'
                          ? 'bg-[#005A9C]/10 text-[#005A9C] border-[#005A9C]/20'
                          : 'bg-[#003366]/10 text-[#003366] border-[#003366]/20'
                      }`}
                    >
                      {service.processingType === 'MODERN_REST' ? 'REST Connector' : 'Legacy Adapter'}
                    </span>
                  </div>
                </div>

                {/* Title & Department */}
                <h3 className="text-base font-bold text-[#333333] group-hover:text-[#005A9C] transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-[11px] text-[#666666] mt-1 font-medium line-clamp-1">
                  {service.department}
                </p>

                {/* Description */}
                <p className="text-xs text-[#666666] mt-3 leading-relaxed line-clamp-2 font-normal">
                  {service.description}
                </p>

                {/* Benefit Highlight Card with India Green (#138808) */}
                <div className="mt-4 p-3 rounded-xl bg-[#138808]/10 border border-[#138808]/20 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#138808] shrink-0" />
                  <span className="text-xs font-bold text-[#138808]">
                    {service.benefit}
                  </span>
                </div>

                {/* "Fill Once" Autofill Gauge */}
                <div className="mt-4 pt-3 border-t border-[#D9D9D9] flex items-center justify-between text-[11px] text-[#666666]">
                  <span className="flex items-center gap-1.5 text-[#005A9C] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#005A9C]" />
                    {service.requiredProfileFields.length} profile fields autofilled
                  </span>
                  <span className="flex items-center gap-1 text-[#F39C12] font-bold">
                    <Clock className="w-3 h-3" /> SLA {service.slaDays} days
                  </span>
                </div>
              </div>

              {/* Action Button: India Saffron (#FF9933) with #003366 text */}
              <div className="mt-5">
                {existingApp ? (
                  <div className="w-full py-2.5 px-4 rounded-xl bg-[#138808]/10 border border-[#138808]/30 text-[#138808] text-xs font-bold flex items-center justify-between shadow-xs">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#138808]" />
                      Applied ({existingApp.status})
                    </span>
                    <span className="text-[10px] underline cursor-pointer hover:text-[#003366]" onClick={() => setSelectedServiceForApply(service)}>
                      View Again
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedServiceForApply(service)}
                    className="w-full py-2.5 px-4 rounded-xl btn-saffron text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 group-hover:gap-3 transition-all cursor-pointer"
                  >
                    <span>{t.applyNow}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

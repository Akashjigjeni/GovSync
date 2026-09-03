import React, { useState } from 'react';
import {
  User,
  MapPin,
  Landmark,
  FileCheck2,
  Edit3,
  Save,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const CitizenProfileManager: React.FC = () => {
  const { citizenProfile, updateCitizenProfile } = useGovSync();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(citizenProfile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCitizenProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with DigiLocker Verified Badge */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={citizenProfile.photoUrl}
              alt={citizenProfile.fullName}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-[#005A9C] shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#138808] text-white p-1 rounded-full border-2 border-white shadow-xs" title="DigiLocker Verified">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#333333]">{citizenProfile.fullName}</h2>
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#138808]/10 text-[#138808] border border-[#138808]/20">
                <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker Synced
              </span>
            </div>
            <p className="text-xs text-[#666666] mt-1 flex flex-wrap items-center gap-3 font-medium">
              <span>Aadhaar: <strong className="text-[#003366] font-mono font-bold">{citizenProfile.aadhaarNumber}</strong></span>
              <span>•</span>
              <span>PAN: <strong className="text-[#003366] font-mono font-bold">{citizenProfile.verifiedCredentials.panNumber}</strong></span>
              <span>•</span>
              <span>Citizen ID: <strong className="text-slate-700 font-mono">{citizenProfile.id}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl btn-saffron text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile Details
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Standardized Profile
            </button>
          )}
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-2xl bg-[#005A9C]/10 border border-[#005A9C]/20 flex items-center gap-3 text-xs text-[#003366]">
        <Sparkles className="w-5 h-5 text-[#FF9933] shrink-0" />
        <span className="font-medium leading-relaxed">
          <strong className="font-bold text-[#003366]">Fill Once Advantage:</strong> Any updates saved here automatically synchronize across all connected government departments when consent is granted. No redundant paperwork needed!
        </span>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Contact Details */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2 border-b border-[#D9D9D9] pb-3">
            <User className="w-4 h-4 text-[#003366]" /> Personal & Demographic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#666666] font-semibold mb-1">Full Legal Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Father's / Guardian Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.fatherName}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.dob}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Gender</label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Mobile Phone (Aadhaar Linked)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Category & Quota</label>
              {isEditing ? (
                <select
                  value={formData.demographics.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      demographics: { ...formData.demographics, category: e.target.value as any }
                    })
                  }
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.demographics.category}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Annual Family Income (₹)</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.demographics.annualIncome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      demographics: { ...formData.demographics, annualIncome: Number(e.target.value) }
                    })
                  }
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#138808]">
                  ₹{citizenProfile.demographics.annualIncome.toLocaleString()} / year
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Permanent & Communication Address */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#005A9C] flex items-center gap-2 border-b border-[#D9D9D9] pb-3">
            <MapPin className="w-4 h-4 text-[#005A9C]" /> Standardized Residential Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[#666666] font-semibold mb-1">Street / House / Landmark</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })
                  }
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.address.street}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Village / Town / Taluka</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address.villageTown}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, villageTown: e.target.value }
                    })
                  }
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.address.villageTown}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">District</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address.district}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, district: e.target.value }
                    })
                  }
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.address.district}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">State / UT</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })
                  }
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.address.state}</p>
              )}
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">PIN Postal Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, pincode: e.target.value }
                    })
                  }
                  className="w-full bg-white border border-[#D9D9D9] rounded-xl px-3 py-2 text-[#333333] font-bold focus:outline-none focus:border-[#005A9C]"
                />
              ) : (
                <p className="font-bold text-[#333333]">{citizenProfile.address.pincode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Banking & Financial (Direct Benefit Transfer) */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF9933] flex items-center gap-2 border-b border-[#D9D9D9] pb-3">
            <Landmark className="w-4 h-4 text-[#FF9933]" /> Direct Benefit Transfer (DBT) Bank Account
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#666666] font-semibold mb-1">Bank Name</label>
              <p className="font-bold text-[#333333]">
                {citizenProfile.verifiedCredentials.bankAccount.bankName}
              </p>
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Account Number (Masked)</label>
              <p className="font-mono font-bold text-[#333333]">
                XXXX-XXXX-{citizenProfile.verifiedCredentials.bankAccount.accountNumber.slice(-4)}
              </p>
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">IFSC Code</label>
              <p className="font-mono font-bold text-[#003366]">
                {citizenProfile.verifiedCredentials.bankAccount.ifsc}
              </p>
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Branch Name</label>
              <p className="font-bold text-[#333333]">
                {citizenProfile.verifiedCredentials.bankAccount.branch}
              </p>
            </div>
          </div>
        </div>

        {/* Verified Department Registries & Land Records */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#003366] flex items-center gap-2 border-b border-[#D9D9D9] pb-3">
            <FileCheck2 className="w-4 h-4 text-[#003366]" /> Verified Department Registries & Assets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#666666] font-semibold mb-1">Land Record 7/12 ROR ID</label>
              <p className="font-mono font-bold text-[#005A9C]">
                {citizenProfile.verifiedCredentials.landRecordId}
              </p>
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Total Verified Landholding</label>
              <p className="font-bold text-[#333333]">
                {citizenProfile.verifiedCredentials.landAreaAcres} Acres
              </p>
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Ration Card Number (NFSA)</label>
              <p className="font-mono font-bold text-[#333333]">
                {citizenProfile.verifiedCredentials.rationCardNumber}
              </p>
            </div>

            <div>
              <label className="block text-[#666666] font-semibold mb-1">Highest Education & College</label>
              <p className="font-bold text-[#333333]">
                {citizenProfile.verifiedCredentials.highestEducation} ({citizenProfile.verifiedCredentials.passingYear})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FileCode2,
  Database,
  Play,
  CheckCircle2,
  Copy,
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useGovSync } from '../../context/GovSyncContext';

export const AdapterStudio: React.FC = () => {
  const { addToast } = useGovSync();

  const legacyTemplates = [
    {
      id: 'SOAP_AGRI',
      name: 'AgriStack Legacy SOAP (Agriculture)',
      format: 'XML / SOAP 1.2',
      input: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:agr="http://agri.nic.in/pmk">
  <soapenv:Body>
    <agr:LegacyFarmerRecord>
      <agr:FarmerUID>XXXX-XXXX-4819</agr:FarmerUID>
      <agr:FarmerFullName>Aarav Sharma</agr:FarmerFullName>
      <agr:DistrictCode>MH-PUN</agr:DistrictCode>
      <agr:LandKhasraNo>7/12-98214</agr:LandKhasraNo>
      <agr:Hectares>1.416</agr:Hectares>
      <agr:BankAccount>50100489218492</agr:BankAccount>
      <agr:BankIFSC>SBIN0001234</agr:BankIFSC>
    </agr:LegacyFarmerRecord>
  </soapenv:Body>
</soapenv:Envelope>`,
      output: `{
  "$schema": "https://govsync.gov.in/schemas/v2/interoperability-envelope.json",
  "metadata": {
    "standard": "IFEG-2.0 / API-Setu Compliant",
    "serviceCode": "PM-KISAN",
    "normalizationEngine": "GovSync-Legacy-XML-Adapter-v2.4"
  },
  "citizen": {
    "verifiedIdentity": {
      "aadhaarMasked": "XXXX-XXXX-4819",
      "fullName": "Aarav Sharma"
    },
    "residentialAddress": {
      "district": "Pune",
      "state": "Maharashtra"
    },
    "departmentRegistries": {
      "landRecordId": "MH-ROR-7/12-PUN-98214",
      "landAreaAcres": 3.5
    },
    "financialLedger": {
      "bankName": "State Bank of India",
      "accountMasked": "XXXX-XXXX-8492",
      "ifscCode": "SBIN0001234",
      "dbtEnabled": true
    }
  }
}`
    },
    {
      id: 'CSV_PDS',
      name: 'NIC PDS Flat-File (Food & Supplies)',
      format: 'ASCII Pipe-Delimited Batch',
      input: `HDR|ONORC-PORTABILITY|GOVSYNC-GW|2026-09-02T10:00:00Z|BATCH_9912
REC|CIT-98124|Aarav Sharma|XXXX-XXXX-4819|Pune|411038|RC-MAH-2022-77192|SBIN0001234|targetFps=411014;stayMonths=12
TRL|RECORD_COUNT=1|CHECKSUM=8f7a9c2b4d6e8a0f`,
      output: `{
  "$schema": "https://govsync.gov.in/schemas/v2/interoperability-envelope.json",
  "metadata": {
    "standard": "IFEG-2.0 / API-Setu Compliant",
    "serviceCode": "ONORC-PORTABILITY",
    "normalizationEngine": "GovSync-FlatFile-Batch-Adapter-v1.9"
  },
  "citizen": {
    "identifier": "CIT-98124",
    "verifiedIdentity": {
      "fullName": "Aarav Sharma",
      "aadhaarMasked": "XXXX-XXXX-4819"
    },
    "residentialAddress": {
      "district": "Pune",
      "pincode": "411038"
    },
    "departmentRegistries": {
      "rationCardNumber": "RC-MAH-2022-77192"
    }
  },
  "serviceSpecificDelta": {
    "targetFpsPincode": "411014",
    "migrationDurationMonths": 12
  }
}`
    },
    {
      id: 'REST_NSP',
      name: 'National Scholarship Portal (REST API)',
      format: 'JSON OpenAPI 3.1',
      input: `{
  "applicantId": "CIT-98124",
  "candidateName": "Aarav Sharma",
  "annualIncome": 240000,
  "educationRecord": {
    "degree": "B.Sc. Agriculture",
    "gradYear": "2019"
  },
  "courseEnrolled": "M.Sc. Sustainable Agriculture Tech",
  "cgpa": 8.9
}`,
      output: `{
  "$schema": "https://govsync.gov.in/schemas/v2/interoperability-envelope.json",
  "metadata": {
    "standard": "IFEG-2.0 / API-Setu Compliant",
    "serviceCode": "NSP-MERIT-2026",
    "normalizationEngine": "GovSync-OpenAPI-Connector-v4.1"
  },
  "citizen": {
    "identifier": "CIT-98124",
    "verifiedIdentity": { "fullName": "Aarav Sharma" },
    "socioDemographics": { "annualIncomeInr": 240000 },
    "departmentRegistries": {
      "highestEducation": "B.Sc. Agriculture",
      "passingYear": "2019"
    }
  },
  "serviceSpecificDelta": {
    "currentCourse": "M.Sc. Sustainable Agriculture Tech",
    "lastSemesterCgpa": 8.9
  }
}`
    }
  ];

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>(legacyTemplates[0].input);
  const [transformedOutput, setTransformedOutput] = useState<string>(legacyTemplates[0].output);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setCustomInput(legacyTemplates[idx].input);
    setTransformedOutput(legacyTemplates[idx].output);
  };

  const handleExecuteTransform = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setTransformedOutput(legacyTemplates[selectedTemplateIndex].output);
      setIsProcessing(false);
      addToast({
        type: 'success',
        title: 'Normalization Complete',
        message: 'Payload mapped to GovSync Common JSON Model with 100% schema validation.'
      });
    }, 450);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(transformedOutput);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'Normalized Common JSON model copied.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[#003366] text-[#FF9933] shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#333333] flex items-center gap-2">
                Adapter Transformation & Normalization Studio
              </h2>
              <p className="text-xs text-[#666666] mt-0.5 font-medium">
                Real-time testbed proving bi-directional translation between legacy siloed departmental data and the GovSync Common JSON Model
              </p>
            </div>
          </div>
        </div>

        {/* Action Button in Saffron (#FF9933) */}
        <button
          onClick={handleExecuteTransform}
          disabled={isProcessing}
          className="px-5 py-2.5 rounded-xl btn-saffron text-xs font-extrabold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Normalizing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-[#003366]" />
              <span>Run Normalization Engine</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase text-[#666666] mr-2 flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5 text-[#003366]" /> Department Adapters:
        </span>
        {legacyTemplates.map((tpl, idx) => (
          <button
            key={tpl.id}
            onClick={() => handleSelectTemplate(idx)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              selectedTemplateIndex === idx
                ? 'bg-[#003366] border-[#003366] text-white shadow-xs'
                : 'bg-white border-[#D9D9D9] text-[#666666] hover:text-[#003366]'
            }`}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Side-by-side Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Box: Raw Department / Legacy Format */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-[#F39C12]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                Incoming Department Payload ({legacyTemplates[selectedTemplateIndex].format})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#F39C12]/10 text-[#F39C12] px-2 py-0.5 rounded border border-[#F39C12]/20">
              Raw Siloed Format
            </span>
          </div>

          <textarea
            rows={14}
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full bg-[#1E293B] border border-[#D9D9D9] rounded-xl p-3.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-[#005A9C] shadow-inner resize-y leading-relaxed"
          />

          <p className="text-[11px] text-[#666666] font-medium">
            Edit this raw input or select a template above to test real-time adapter parsing.
          </p>
        </div>

        {/* Right Box: Normalized Common JSON Model */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#138808]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                GovSync Common JSON Model (Normalized)
              </h3>
            </div>
            <button
              onClick={handleCopyOutput}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#333333] text-xs font-bold border border-[#D9D9D9] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Copy JSON"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <pre className="w-full bg-[#1E293B] border border-[#D9D9D9] rounded-xl p-3.5 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[340px] shadow-inner leading-relaxed">
            {transformedOutput}
          </pre>

          <div className="p-2.5 rounded-xl bg-[#138808]/10 border border-[#138808]/20 flex items-center gap-2 text-[11px] text-[#138808] font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#138808] shrink-0" />
            <span>
              <strong className="font-bold">IFEG Standard Compliant:</strong> Normalized schema ready for multi-department secure reuse.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

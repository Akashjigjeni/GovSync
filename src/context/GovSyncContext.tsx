import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  CitizenProfile,
  GovernmentService,
  ServiceApplication,
  ConsentToken,
  AuditLogEntry,
  GatewayMetrics,
  UserRole,
  LanguageCode,
  AuthSession,
  AuthMethod,
  JwtClaims
} from '../types';
import {
  INITIAL_CITIZEN_PROFILE,
  GOVERNMENT_SERVICES,
  INITIAL_APPLICATIONS,
  INITIAL_CONSENT_TOKENS,
  INITIAL_AUDIT_LOGS,
  INITIAL_METRICS
} from '../mock/data';
import {
  buildCommonJsonPayload,
  transformToTargetFormat,
  createApplicationStages,
  generateHash,
  generateTokenId,
  generateApplicationNumber,
  TRANSLATIONS
} from '../services/govSyncEngine';
import { apiClient } from '../services/apiClient';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface GovSyncContextType {
  // Roles & View
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof TRANSLATIONS['en'];

  // Backend Connectivity Status
  isBackendConnected: boolean;

  // Auth & Session
  isAuthenticated: boolean;
  authSession: AuthSession | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'LOGIN' | 'REGISTER';
  setAuthModalMode: (mode: 'LOGIN' | 'REGISTER') => void;
  login: (method: AuthMethod, profile?: CitizenProfile) => Promise<void>;
  register: (newProfile: CitizenProfile) => Promise<void>;
  logout: () => void;

  // State
  citizenProfile: CitizenProfile;
  updateCitizenProfile: (updated: Partial<CitizenProfile>) => Promise<void>;
  services: GovernmentService[];
  applications: ServiceApplication[];
  consentTokens: ConsentToken[];
  auditLogs: AuditLogEntry[];
  metrics: GatewayMetrics;

  // Actions
  applyForService: (service: GovernmentService, deltaData: Record<string, any>) => Promise<ServiceApplication>;
  revokeConsent: (tokenId: string) => Promise<void>;
  updateApplicationStatusByOfficer: (
    applicationId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks: string,
    officerName: string
  ) => Promise<void>;
  resetAllDemoData: () => Promise<void>;
  refreshAllData: () => Promise<void>;

  // Modals & Active Selections
  selectedServiceForApply: GovernmentService | null;
  setSelectedServiceForApply: (service: GovernmentService | null) => void;
  selectedAppForDetail: ServiceApplication | null;
  setSelectedAppForDetail: (app: ServiceApplication | null) => void;
  isFlowVisualizerOpen: boolean;
  setIsFlowVisualizerOpen: (open: boolean) => void;
  isJudgeTourOpen: boolean;
  setIsJudgeTourOpen: (open: boolean) => void;
  launchScenario: (scenarioId: 'CITIZEN_APPLY' | 'OFFICER_REVIEW' | 'ADAPTER_STUDIO' | 'PRIVACY_REVOKE') => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const GovSyncContext = createContext<GovSyncContextType | undefined>(undefined);

export const GovSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('CITIZEN');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('govsync_is_authenticated');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('govsync_auth_session');
    if (saved) return JSON.parse(saved);
    return {
      jwtToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDSVQtSU4tMjAyNi05ODEyNCIsIm5hbWUiOiJBYXJhdnNoYXJtYSIsInJvbGUiOiJDSVRJWkVOIiwic2NvcGVzIjpbIlBST0ZJTEVfUkVBRCIsIkNPTlNFTlRfR1JBTlQiLCJTRVJWSUNFX0FQUExZIl19',
      claims: {
        sub: 'CIT-IN-2026-98124',
        name: 'Aarav Sharma',
        role: 'CITIZEN',
        aadhaarMasked: 'XXXX-XXXX-4819',
        email: 'aarav.sharma@govsync.demo',
        phone: '+91 98765 43210',
        scopes: ['PROFILE_READ', 'CONSENT_GRANT', 'SERVICE_APPLY', 'DIGILOCKER_SYNC'],
        iss: 'https://auth.govsync.gov.in',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
        jti: 'jwt-sec-991824a'
      },
      authMethod: 'AADHAAR_OTP',
      authenticatedAt: new Date().toISOString()
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Core Data States
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(() => {
    const saved = localStorage.getItem('govsync_citizen_profile');
    return saved ? JSON.parse(saved) : INITIAL_CITIZEN_PROFILE;
  });

  const [services, setServices] = useState<GovernmentService[]>(GOVERNMENT_SERVICES);

  const [applications, setApplications] = useState<ServiceApplication[]>(() => {
    const saved = localStorage.getItem('govsync_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [consentTokens, setConsentTokens] = useState<ConsentToken[]>(() => {
    const saved = localStorage.getItem('govsync_consents');
    return saved ? JSON.parse(saved) : INITIAL_CONSENT_TOKENS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('govsync_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [metrics, setMetrics] = useState<GatewayMetrics>(() => {
    const saved = localStorage.getItem('govsync_metrics');
    return saved ? JSON.parse(saved) : INITIAL_METRICS;
  });

  const [selectedServiceForApply, setSelectedServiceForApply] = useState<GovernmentService | null>(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<ServiceApplication | null>(null);
  const [isFlowVisualizerOpen, setIsFlowVisualizerOpen] = useState<boolean>(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const launchScenario = (scenarioId: 'CITIZEN_APPLY' | 'OFFICER_REVIEW' | 'ADAPTER_STUDIO' | 'PRIVACY_REVOKE') => {
    setIsJudgeTourOpen(false);

    if (scenarioId === 'CITIZEN_APPLY') {
      setActiveRole('CITIZEN');
      const pmKisan = services.find((s) => s.code === 'PM-KISAN') || services[0];
      setSelectedServiceForApply(pmKisan);
      addToast({
        type: 'info',
        title: '🎯 Scenario 1: Citizen 1-Click Enrollment',
        message: 'Pre-filled 85% of verified credentials from Common Profile with Purpose-Bounded Consent authorization.'
      });
    } else if (scenarioId === 'OFFICER_REVIEW') {
      setActiveRole('OFFICER');
      addToast({
        type: 'info',
        title: '🎯 Scenario 2: Officer Decision & Sanction Desk',
        message: 'Review verified citizen profiles, check cryptographic consent tokens, and issue sanction orders.'
      });
    } else if (scenarioId === 'ADAPTER_STUDIO') {
      setActiveRole('ADMIN');
      addToast({
        type: 'info',
        title: '🎯 Scenario 3: Legacy Adapter Normalization Studio',
        message: 'Live testbed demonstrating translation of siloed Legacy SOAP/XML & Flat-Files into IFEG 2.0 Common JSON.'
      });
    } else if (scenarioId === 'PRIVACY_REVOKE') {
      setActiveRole('CITIZEN');
      addToast({
        type: 'info',
        title: '🎯 Scenario 4: DPDP Act 2023 Consent Center',
        message: 'Demonstrate sovereign citizen data control with instant 1-click consent revocation and tamper-evident audit trail.'
      });
    }
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('govsync_is_authenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('govsync_auth_session', JSON.stringify(authSession));
  }, [authSession]);

  useEffect(() => {
    localStorage.setItem('govsync_citizen_profile', JSON.stringify(citizenProfile));
  }, [citizenProfile]);

  useEffect(() => {
    localStorage.setItem('govsync_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('govsync_consents', JSON.stringify(consentTokens));
  }, [consentTokens]);

  useEffect(() => {
    localStorage.setItem('govsync_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('govsync_metrics', JSON.stringify(metrics));
  }, [metrics]);

  // Refresh data from backend
  const refreshAllData = useCallback(async () => {
    try {
      const isHealthy = await apiClient.checkHealth();
      setIsBackendConnected(isHealthy);

      if (isHealthy) {
        const [profileRes, servicesRes, appsRes, consentsRes, logsRes, metricsRes] = await Promise.all([
          apiClient.getProfile().catch(() => null),
          apiClient.getServices().catch(() => null),
          apiClient.getApplications().catch(() => null),
          apiClient.getConsents().catch(() => null),
          apiClient.getAuditLogs().catch(() => null),
          apiClient.getMetrics().catch(() => null)
        ]);

        if (profileRes) setCitizenProfile(profileRes);
        if (servicesRes) setServices(servicesRes);
        if (appsRes) setApplications(appsRes);
        if (consentsRes) setConsentTokens(consentsRes);
        if (logsRes) setAuditLogs(logsRes);
        if (metricsRes) setMetrics(metricsRes);
      }
    } catch (err) {
      console.warn('Backend currently offline, using offline fallback cache:', err);
      setIsBackendConnected(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Auth Actions
  const login = async (method: AuthMethod, profile?: CitizenProfile) => {
    try {
      if (isBackendConnected) {
        const res = await apiClient.login(method, profile);
        setCitizenProfile(res.user);
        const session: AuthSession = {
          jwtToken: res.jwtToken,
          claims: res.claims,
          authMethod: method,
          authenticatedAt: new Date().toISOString()
        };
        setAuthSession(session);
        setIsAuthenticated(true);
        refreshAllData();
      } else {
        // Local Fallback
        const targetProfile = profile || citizenProfile;
        setCitizenProfile(targetProfile);
        const newClaims: JwtClaims = {
          sub: targetProfile.id,
          name: targetProfile.fullName,
          role: 'CITIZEN',
          aadhaarMasked: targetProfile.aadhaarNumber,
          email: targetProfile.email,
          phone: targetProfile.phone,
          scopes: ['PROFILE_READ', 'CONSENT_GRANT', 'SERVICE_APPLY', 'DIGILOCKER_SYNC'],
          iss: 'https://auth.govsync.gov.in',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400,
          jti: `jwt-${Date.now()}`
        };
        const session: AuthSession = {
          jwtToken: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(newClaims))}.signature_verified_sha256`,
          claims: newClaims,
          authMethod: method,
          authenticatedAt: new Date().toISOString()
        };
        setAuthSession(session);
        setIsAuthenticated(true);
      }

      addToast({
        type: 'success',
        title: 'Authenticated Successfully',
        message: `Welcome back, ${citizenProfile.fullName}. Verified via OAuth 2.0 & JWT.`
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Login Error',
        message: err.message || 'Authentication failed'
      });
    }
  };

  const register = async (newProfile: CitizenProfile) => {
    try {
      if (isBackendConnected) {
        const res = await apiClient.register(newProfile);
        setCitizenProfile(res.user);
        const session: AuthSession = {
          jwtToken: res.jwtToken,
          claims: res.claims,
          authMethod: 'AADHAAR_OTP',
          authenticatedAt: new Date().toISOString()
        };
        setAuthSession(session);
        setIsAuthenticated(true);
        refreshAllData();
      } else {
        setCitizenProfile(newProfile);
        login('AADHAAR_OTP', newProfile);
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast({
        type: 'success',
        title: 'Profile Created & Verified',
        message: 'Your standardized GovSync Profile is active. Fill Once, Reuse Everywhere!'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        message: err.message || 'Failed to create profile'
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthSession(null);
    apiClient.setToken(null);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been securely signed out of GovSync.'
    });
  };

  const updateCitizenProfile = async (updated: Partial<CitizenProfile>) => {
    try {
      if (isBackendConnected) {
        const res = await apiClient.updateProfile(updated);
        setCitizenProfile(res);
        refreshAllData();
      } else {
        setCitizenProfile((prev) => ({ ...prev, ...updated, updatedAt: new Date().toISOString() }));
      }

      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Common profile updated and synced across government registries.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to save profile updates'
      });
    }
  };

  const applyForService = async (
    service: GovernmentService,
    deltaData: Record<string, any>
  ): Promise<ServiceApplication> => {
    if (isBackendConnected) {
      try {
        const newApp = await apiClient.applyForService(service.id, deltaData);
        setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
        refreshAllData();

        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 }
        });

        addToast({
          type: 'success',
          title: 'Application Routed Successfully!',
          message: `Ref #${newApp.applicationNumber} submitted with Purpose-Bounded Consent Token ${newApp.consentTokenId}.`
        });

        return newApp;
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Application Submission Error',
          message: err.message || 'Could not route to department adapter'
        });
      }
    }

    // Local Fallback Execution
    const consentTokenId = generateTokenId();
    const applicationNumber = generateApplicationNumber(service.code);

    const newConsent: ConsentToken = {
      id: consentTokenId,
      citizenId: citizenProfile.id,
      citizenName: citizenProfile.fullName,
      serviceId: service.id,
      serviceName: service.title,
      department: service.department,
      purpose: `Scheme processing and benefit disbursement for ${service.title}`,
      sharedFields: service.requiredProfileFields,
      status: 'ACTIVE',
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      retentionDays: 365,
      jwtToken: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(consentTokenId)}.signature`,
      sha256Hash: generateHash(`CONSENT_${consentTokenId}_${citizenProfile.id}`)
    };

    const commonJsonObj = buildCommonJsonPayload(citizenProfile, service, deltaData, newConsent);
    const commonJson = JSON.stringify(commonJsonObj, null, 2);
    const targetPayload = transformToTargetFormat(commonJsonObj, service);

    const newApp: ServiceApplication = {
      id: `APP-ID-${Date.now()}`,
      applicationNumber,
      serviceId: service.id,
      serviceName: service.title,
      department: service.department,
      citizenId: citizenProfile.id,
      citizenName: citizenProfile.fullName,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
      stages: createApplicationStages(service, newConsent),
      consentTokenId,
      profileDataSnapshot: citizenProfile,
      deltaData,
      legacyPayloadPreview: targetPayload.content,
      normalizedJsonPreview: commonJson,
      updatedAt: new Date().toISOString()
    };

    setConsentTokens((prev) => [newConsent, ...prev]);
    setApplications((prev) => [newApp, ...prev]);

    setMetrics((prev) => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      successfulInteractions: prev.successfulInteractions + 1,
      activeConsentTokens: prev.activeConsentTokens + 1,
      legacyTransformations:
        service.processingType !== 'MODERN_REST'
          ? prev.legacyTransformations + 1
          : prev.legacyTransformations
    }));

    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });

    addToast({
      type: 'success',
      title: 'Application Routed Successfully!',
      message: `Ref #${applicationNumber} submitted with Purpose-Bounded Consent Token ${consentTokenId}.`
    });

    return newApp;
  };

  const revokeConsent = async (tokenId: string) => {
    try {
      if (isBackendConnected) {
        await apiClient.revokeConsent(tokenId);
        refreshAllData();
      } else {
        setConsentTokens((prev) =>
          prev.map((c) => (c.id === tokenId ? { ...c, status: 'REVOKED' } : c))
        );
        setMetrics((prev) => ({
          ...prev,
          activeConsentTokens: Math.max(0, prev.activeConsentTokens - 1)
        }));
      }

      addToast({
        type: 'warning',
        title: 'Consent Revoked',
        message: `Token ${tokenId} has been invalidated. Department data access blocked.`
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Revocation Error',
        message: err.message || 'Failed to revoke consent'
      });
    }
  };

  const updateApplicationStatusByOfficer = async (
    applicationId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks: string,
    officerName: string
  ) => {
    try {
      if (isBackendConnected) {
        const updated = await apiClient.updateApplicationStatus(applicationId, status, remarks, officerName);
        setApplications((prev) => prev.map((a) => (a.id === applicationId ? updated : a)));
        refreshAllData();
      } else {
        const certNumber = status === 'APPROVED' ? `SANCTION-MH-2026-${Math.floor(100000 + Math.random() * 900000)}` : undefined;
        setApplications((prev) =>
          prev.map((app) => {
            if (app.id !== applicationId) return app;
            const updatedStages = app.stages.map((stage) => {
              if (status === 'APPROVED') {
                return { ...stage, status: 'COMPLETED' as const };
              } else {
                if (stage.name.includes('Sanction') || stage.name.includes('Review')) {
                  return { ...stage, status: 'REJECTED' as const };
                }
                return stage;
              }
            });
            return {
              ...app,
              status,
              stages: updatedStages,
              officerRemarks: remarks,
              approvedBy: officerName,
              approvalCertificateNumber: certNumber,
              updatedAt: new Date().toISOString()
            };
          })
        );
      }

      if (status === 'APPROVED') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
        addToast({
          type: 'success',
          title: 'Sanction Order Issued!',
          message: `Application approved and digital certificate generated.`
        });
      } else {
        addToast({
          type: 'error',
          title: 'Application Rejected',
          message: `Application marked as rejected.`
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Officer Action Failed',
        message: err.message || 'Could not update status'
      });
    }
  };

  const resetAllDemoData = async () => {
    try {
      if (isBackendConnected) {
        await apiClient.resetData();
        await refreshAllData();
      } else {
        localStorage.removeItem('govsync_citizen_profile');
        localStorage.removeItem('govsync_applications');
        localStorage.removeItem('govsync_consents');
        localStorage.removeItem('govsync_audit_logs');
        localStorage.removeItem('govsync_metrics');
        setCitizenProfile(INITIAL_CITIZEN_PROFILE);
        setApplications(INITIAL_APPLICATIONS);
        setConsentTokens(INITIAL_CONSENT_TOKENS);
        setAuditLogs(INITIAL_AUDIT_LOGS);
        setMetrics(INITIAL_METRICS);
      }

      addToast({
        type: 'info',
        title: 'Demo State Reset',
        message: 'All application records, consents, and metrics restored to baseline.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message || 'Could not reset data'
      });
    }
  };

  return (
    <GovSyncContext.Provider
      value={{
        activeRole,
        setActiveRole,
        language,
        setLanguage,
        t: TRANSLATIONS[language] || TRANSLATIONS.en,

        isBackendConnected,
        isAuthenticated,
        authSession,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,

        citizenProfile,
        updateCitizenProfile,
        services,
        applications,
        consentTokens,
        auditLogs,
        metrics,

        applyForService,
        revokeConsent,
        updateApplicationStatusByOfficer,
        resetAllDemoData,
        refreshAllData,

        selectedServiceForApply,
        setSelectedServiceForApply,
        selectedAppForDetail,
        setSelectedAppForDetail,
        isFlowVisualizerOpen,
        setIsFlowVisualizerOpen,
        isJudgeTourOpen,
        setIsJudgeTourOpen,
        launchScenario,

        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </GovSyncContext.Provider>
  );
};

export const useGovSync = () => {
  const context = useContext(GovSyncContext);
  if (!context) {
    throw new Error('useGovSync must be used within a GovSyncProvider');
  }
  return context;
};

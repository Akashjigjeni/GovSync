# GovSync — Interoperable Government Digital Ecosystem

> **«Fill Once. Reuse Securely. Access Multiple Government Services.»**

GovSync is an interoperability platform designed to connect fragmented government digital platforms and enable secure reuse of citizen information across multiple central and state government departments.

---

## 🏛️ System Architecture

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS (Indian Government Portal Theme)
- **Backend**: Node.js + Express + TypeScript REST API (`server/`)
- **Security**: OAuth 2.0 (DigiLocker / MeriPehchaan), RFC-7519 RS256/HS256 JWT, SHA-256 Tamper-Evident Ledger
- **Interoperability Standard**: IFEG 2.0 (Interoperability Framework for e-Governance) & API Setu Open Specifications
- **Adapters**: Bi-directional Transformation Engine for Legacy SOAP/XML, NIC Flat-File Batch, and OpenAPI 3.1 REST
- **Deployment**: Multi-container Docker & Docker Compose with Nginx reverse proxy

---

## 🐳 Running with Docker (Recommended)

To build and run both Frontend and Backend with a single command:

```bash
docker compose up --build
```

- **Frontend Portal**: `http://localhost:5173` (or `http://localhost:80`)
- **Backend REST API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

## 💻 Running Locally (Development)

### 1. Start the Backend API Server:
```bash
cd server
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 2. Start the Frontend React Client:
```bash
# In the root directory
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📡 Core Backend Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Gateway node health & standards check |
| `POST` | `/api/auth/login` | Citizen OAuth 2.0 / Aadhaar OTP authentication & JWT issuance |
| `POST` | `/api/auth/register` | New citizen registration & profile provisioning |
| `GET` | `/api/profile` | Retrieve standardized Common Citizen Profile |
| `PUT` | `/api/profile` | Update profile with automatic audit logging |
| `GET` | `/api/services` | Query government schemes catalog |
| `GET` | `/api/applications` | List applications with stage trackers |
| `POST` | `/api/applications` | 1-Click scheme application with Purpose-Bounded Consent |
| `PUT` | `/api/applications/:id/status` | Department Officer review & sanction order issuance |
| `GET` | `/api/consents` | List active & revoked consent tokens |
| `POST` | `/api/consents/:id/revoke` | Revoke data sharing authorization immediately |
| `GET` | `/api/admin/audit-ledger` | Tamper-evident immutable audit trail |
| `GET` | `/api/admin/metrics` | Real-time traffic, latency, and SLA metrics |

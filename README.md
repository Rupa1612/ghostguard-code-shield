# 🛡️ GhostGuard - Confidential Code & API Key Shield

**Professional code security scanner that detects and redacts API keys, tokens, passwords and sensitive data from your codebase.**

GhostGuard automatically analyzes your code repositories for security vulnerabilities and helps you sanitize them before pushing to version control.

## ✨ Features

- **🔍 Multi-Mode Scanning**: Regex patterns, AI analysis, and hybrid detection
- **🎯 Smart Detection**: API keys, passwords, tokens, certificates, PII, and more
- **🔒 Auto-Redaction**: Replace secrets with environment variables
- **📊 Risk Assessment**: Comprehensive security scoring and analytics  
- **🎨 Modern UI**: Clean, responsive design with dark/light themes
- **⚡ Real-time Results**: Live scanning progress and instant feedback

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State**: React Query + Context

## 📱 Screenshots

### Dashboard Overview
- Risk score meter with security status
- Recent scan history and findings
- Quick action buttons for common tasks

### Security Scanner  
- File upload with drag & drop
- Repository URL scanning
- Real-time progress tracking

### Results Analysis
- Detailed findings with code preview
- Severity filtering and search
- AI-powered reasoning for each detection

### Auto-Redaction Wizard
- Interactive environment variable mapping
- Downloadable sanitized code + .env files
- Security impact summary

## 🔧 Project Structure

```
src/
├── components/
│   ├── shared/          # Reusable components
│   │   ├── AppLayout.tsx
│   │   ├── Navigation.tsx
│   │   ├── SecretBadge.tsx
│   │   ├── RiskScoreMeter.tsx
│   │   └── Dropzone.tsx
│   └── ui/              # shadcn/ui components
├── pages/               # Route components
│   ├── Dashboard.tsx
│   ├── ScanPage.tsx
│   ├── ResultsPage.tsx
│   └── RedactPage.tsx
├── lib/
│   └── mockApi.ts       # Simulated backend
├── types/
│   └── index.ts         # TypeScript definitions
└── hooks/               # Custom React hooks
```

## 🎮 Demo Data

The app includes realistic mock data for demonstration:

- **Sample Findings**: API keys, passwords, tokens with different severities
- **Multiple File Types**: JavaScript, Python, configuration files
- **AI Reasoning**: Context-aware explanations for each detection
- **Progress Simulation**: Realistic scanning progress with live updates

## 🛡️ Security Features

### Detection Capabilities
- AWS access keys and secrets
- GitHub personal access tokens  
- Database passwords and connection strings
- JWT secrets and private keys
- Email addresses and PII
- Custom regex patterns

### Risk Assessment
- Confidence scoring (0-100%)
- Severity levels (Low, Medium, High, Critical)
- Overall risk score calculation
- Security trend analysis

### Redaction Options
- Environment variable generation
- Downloadable sanitized code archives
- Custom variable naming
- Secrets vault integration (planned)

## 🎨 Design System

GhostGuard uses a comprehensive design system built with Tailwind CSS:

- **Color Palette**: Security-focused blues, greens, and reds
- **Typography**: Clean, professional fonts with code syntax highlighting
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with tablet and desktop breakpoints
- **Accessibility**: WCAG compliant with proper contrast and keyboard navigation

## 🔮 Roadmap

- [ ] **Real Backend Integration**: Connect to actual scanning engines
- [ ] **Secrets Vault Sync**: Integration with HashiCorp Vault, AWS Secrets Manager
- [ ] **Custom Rules Engine**: Visual rule builder with testing
- [ ] **Team Collaboration**: Multi-user workspaces and permissions
- [ ] **CI/CD Integration**: GitHub Actions, GitLab CI plugins
- [ ] **Compliance Reports**: SOC 2, HIPAA, PCI DSS reporting

## 🤝 Contributing

This is a demonstration project showcasing modern React development practices and security-focused UI design. The scanning functionality is simulated for demo purposes.

## 📄 License

MIT License - see LICENSE file for details.

---

**Keep your code ghost-clean!** 👻✨
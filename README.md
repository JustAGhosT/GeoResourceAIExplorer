# GeoResource AI Explorer

![GeoResource AI Explorer](https://github.com/user-attachments/assets/d565e866-026c-4d4e-93af-90ed172589f1)

AI-integrated resource exploration platform with configurable regions, multiple resource types, and intelligent querying capabilities.

## 🌟 Features

### 📍 Interactive Mapping
- **Maps mines in South Africa and other regions** with satellite and standard views
- **Real-time mine markers** showing location, status, and production data
- **Custom area drawing** capabilities for exploration planning
- **Geological overlays and heatmaps** for resource visualization
- **Satellite view toggle** for detailed terrain analysis

![Explore Tab](https://github.com/user-attachments/assets/d565e866-026c-4d4e-93af-90ed172589f1)

### 🤖 AI Assistant
- **Intelligent chat interface** for mining data insights
- **Natural language queries** about production, locations, and trends
- **Contextual responses** based on real mining data
- **Suggested questions** to guide exploration

![AI Assistant](https://github.com/user-attachments/assets/b586d34b-2093-428e-81d2-b3c98fa80d17)

### 📊 Analytics Dashboard
- **Production analytics** tracking $24.5B in total value
- **Resource breakdown** across 11 different types (diamonds, gold, lithium, rare earth, etc.)
- **Regional analysis** by country and province
- **Trend analysis** with 5-year historical data
- **Interactive charts** with drill-down capabilities

![Analytics Dashboard](https://github.com/user-attachments/assets/fa5bf6e8-1a74-45f9-9f87-1cb86cf715ef)

### 🎯 Resource Types Tracked
1. **Diamonds** - Including famous mines like Jwaneng and Cullinan
2. **Gold** - Witwatersrand and other major gold fields
3. **Lithium** - Critical for battery production
4. **Platinum** - Precious metals extraction
5. **Copper** - Industrial and electrical applications
6. **Iron Ore** - Steel production feedstock
7. **Coal** - Energy and industrial use
8. **Rare Earth Elements** - Technology and renewable energy
9. **Uranium** - Nuclear energy applications
10. **Chrome** - Stainless steel production
11. **Manganese** - Steel alloy production

### 🔍 Advanced Filtering
- **Multi-criteria filtering** by resource type, country, status, and production value
- **Real-time results** with dynamic mine count updates
- **Export functionality** for reports and analysis
- **Search capabilities** across mines, resources, and regions

### 🌍 Geographic Coverage
- **South Africa** - Primary focus with comprehensive mine data
- **Botswana** - Diamond and mineral operations
- **Zimbabwe** - Lithium and rare earth resources
- **Zambia** - Copper belt mining operations
- **Expandable** to other African regions

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Mapping**: Leaflet with React-Leaflet integration
- **Charts**: Recharts for analytics visualization
- **UI Components**: Radix UI primitives
- **Build Tool**: Next.js with static export
- **Deployment**: Azure Static Web Apps

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd GeoResourceAIExplorer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## ☁️ Azure Deployment

### Prerequisites
- Azure account with Static Web Apps enabled
- GitHub repository connected to Azure

### Deployment Steps

1. **Create Azure Static Web App**
   ```bash
   # Using Azure CLI
   az staticwebapp create \
     --name georesource-ai-explorer \
     --resource-group <your-resource-group> \
     --source https://github.com/<your-username>/GeoResourceAIExplorer \
     --location "Central US" \
     --branch main \
     --app-location "/" \
     --output-location "out"
   ```

2. **Configure GitHub Secrets**
   - Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to repository secrets
   - Token is available in Azure portal under Static Web App settings

3. **Automatic Deployment**
   - Pushes to `main` branch trigger automatic deployment
   - Build and deploy process is configured in `.github/workflows/azure-static-web-apps.yml`

### Manual Build for Azure
```bash
# Build static files for Azure
npm run build

# Output will be in 'out' directory
# Upload contents to Azure Static Web Apps
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── layout/            # Layout components
│   ├── map/               # Mapping components
│   ├── panels/            # Side panels (filters, details)
│   ├── providers/         # Context providers
│   ├── tabs/              # Main tab components
│   └── ui/                # Reusable UI components
├── data/
│   └── mines.ts           # Mock mining data
├── lib/
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript type definitions
```

## 📊 Data Model

### Mine Data Structure
```typescript
interface Mine {
  id: string
  name: string
  latitude: number
  longitude: number
  country: string
  region: string
  resources: ResourceType[]
  status: 'active' | 'inactive' | 'exploration'
  productionValue: number  // in millions USD
  yearEstablished?: number
  owner: string
  size: 'small' | 'medium' | 'large'
}
```

### Resource Types
```typescript
type ResourceType = 
  | 'diamonds' | 'gold' | 'lithium' | 'platinum' 
  | 'copper' | 'iron_ore' | 'coal' | 'rare_earth'
  | 'uranium' | 'chrome' | 'manganese'
```

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_APP_NAME=GeoResource AI Explorer
```

### Azure Configuration
- `staticwebapp.config.json` - Azure Static Web Apps routing
- `.github/workflows/azure-static-web-apps.yml` - CI/CD pipeline

## 🎯 Use Cases

### Investment Analysis
- **Due diligence** on mining investments
- **Portfolio diversification** across resource types
- **Risk assessment** by geographic region
- **Production value trends** and forecasting

### Exploration Planning
- **Identify underexplored regions** with resource potential
- **Analyze infrastructure** and logistics accessibility
- **Environmental impact assessment** planning
- **Stakeholder engagement** and community relations

### Environmental Monitoring
- **Track mine status** and operational changes
- **Monitor environmental compliance** and rehabilitation
- **Assess ecological impact** across regions
- **Sustainable mining** practice evaluation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** for mapping data
- **Esri** for satellite imagery
- **Mining companies** for operational data
- **African geological surveys** for resource information

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation and FAQ

---

**Built with ❤️ for the mining and exploration industry**

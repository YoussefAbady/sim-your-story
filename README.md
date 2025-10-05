# ZUS Pension Simulator - Educational Forecasting Tool

A comprehensive, interactive pension simulation platform that helps Polish citizens understand and forecast their future retirement benefits based on official ZUS (Zakład Ubezpieczeń Społecznych) actuarial data and forecasts from 2023-2080.

## 🎯 Project Overview

This educational simulator provides users with detailed pension forecasts using official Polish social security data, helping them understand how their current employment and salary will translate into future retirement benefits. The application combines sophisticated actuarial calculations with an engaging, gamified learning experience.

## ✨ Key Features

### 🧮 Advanced Pension Calculations
- **Official ZUS Data Integration**: Based on "Prognoza wpływów i wydatków Funduszu Emerytalnego do 2080 roku" (ZUS Department of Statistics & Actuarial Forecasts)
- **Comprehensive Simulation Engine**: Calculates nominal and real (inflation-adjusted) pension amounts
- **Multi-factor Analysis**: Considers wage growth, CPI, life expectancy, and contribution history
- **Sick Leave Impact Modeling**: Accounts for average sick leave patterns by gender
- **Postponement Benefits**: Shows pension increases for working beyond retirement age

### 🎮 Gamified Learning Experience
- **Interactive Timeline**: Animated visualizations of your financial journey
- **AI Mentor**: Personalized guidance explaining complex pension concepts
- **Smart Simulations**: Run thousands of scenarios to understand choice impacts
- **Badge System**: Earn achievements and track learning progress
- **Educational Tips**: Contextual help and explanations throughout the app

### 🌍 Accessibility & Internationalization
- **WCAG 2.0 Compliant**: Full accessibility support with screen reader compatibility
- **Bilingual Support**: Available in Polish and English
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast Design**: ZUS brand-compliant color system
- **Responsive Design**: Works seamlessly across all devices

### 📊 Interactive Dashboard
- **Account Growth Visualization**: See how your pension funds grow over time
- **Historical Salary Input**: Enter specific past salary data
- **Future Projections**: Model different career scenarios
- **Illness Period Modeling**: Specify past and future sick leave periods
- **Custom Indexation**: Adjust growth rates for personalized forecasts

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Vite** with SWC for lightning-fast builds and HMR
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** with custom ZUS brand color system
- **Framer Motion** for smooth animations and transitions

### State Management
- **React Query** for server state management
- **React Hook Form** with Zod validation for forms
- **Context API** for global state (education, gamification, localization)

### Data Sources
- **ZUS Official Forecasts**: 2023-2080 actuarial projections
- **GUS Statistics**: Polish Statistical Office data
- **NBP Economic Data**: National Bank of Poland indicators
- **Ministry of Finance**: Government economic projections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sim-your-story
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Local: `http://localhost:8080`
   - Network: `http://0.0.0.0:8080`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Application Flow

### 1. Landing Page
- Set your desired pension goal
- Learn about different pension groups
- Access educational content and facts

### 2. Simulation Form
- Enter personal details (age, gender, salary)
- Specify work period and retirement plans
- Optional: Add account funds and sick leave modeling

### 3. Results Dashboard
- View detailed pension forecasts
- Compare with national averages
- Explore postponement benefits
- Access advanced customization options

### 4. Advanced Features
- Interactive charts and visualizations
- Historical salary input
- Future scenario modeling
- Educational tips and guidance

## 🎨 Design System

### ZUS Brand Colors
- **Primary Blue**: `#3F84D2` - Main brand color
- **Success Green**: `#00993F` - Positive indicators
- **Warning Amber**: `#FFB34F` - Attention items
- **Error Red**: `#F05E5E` - Warnings and errors
- **Navy**: `#00416E` - Text and accents

### Typography & Spacing
- Consistent spacing scale using Tailwind CSS
- Accessible font sizes and line heights
- Clear visual hierarchy throughout

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Vite Configuration
The application is configured to run on port 8080 by default. To change the port, modify `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 8069, // Your desired port
  },
});
```

## 📊 Data Accuracy

### Official Sources
- **ZUS Forecast Document**: "Prognoza wpływów i wydatków Funduszu Emerytalnego do 2080 roku"
- **Contribution Rate**: 19.52% to FUS pension fund
- **Retirement Ages**: 60 for women, 65 for men
- **Life Expectancy**: Based on GUS mortality tables

### Calculation Factors
- Wage growth indices (2022-2080)
- Consumer Price Index (CPI) adjustments
- Real GDP growth projections
- Sick leave statistics by gender
- Demographic reserve fund contributions

## ⚠️ Important Disclaimers

- **Educational Purpose Only**: This tool is for educational purposes and should not be considered financial advice
- **Not a Prediction**: Results are simulations based on current data and assumptions
- **Data Sources**: Based on official ZUS forecasts and government statistics
- **Accuracy**: While based on official data, actual pension amounts may vary

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ZUS** (Zakład Ubezpieczeń Społecznych) for official actuarial data
- **GUS** (Główny Urząd Statystyczny) for statistical data
- **NBP** (Narodowy Bank Polski) for economic indicators
- **Ministry of Finance** for government projections

## 📞 Support

For questions, issues, or contributions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation for common questions

---

**Built with ❤️ for Polish citizens to better understand their retirement future.**
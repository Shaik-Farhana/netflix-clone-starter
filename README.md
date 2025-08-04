# Netflix Clone - Full-Stack Starter Template

A modern, production-ready Netflix clone built with Next.js, Supabase, and Python microservices. Features AI-powered recommendations, intelligent search, comprehensive analytics, and admin supervision tools.

## 🚀 Features

### Frontend (Next.js 14)
- **Modern UI/UX**: Netflix-inspired design with Tailwind CSS and shadcn/ui
- **Authentication**: Complete auth system with Supabase Auth
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Updates**: Live data updates and notifications

### Core Pages & Features
- **Home**: Hero section with featured content and personalized rows
- **Search**: Intelligent search with ML-powered ranking and filters
- **Recommendations**: AI-driven content recommendations with multiple algorithms
- **Analytics Dashboard**: Comprehensive analytics with interactive charts
- **Admin Panel**: User management, content supervision, and system health monitoring

### Backend Architecture
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Python Microservices**: Dedicated services for ML/AI operations
- **Redis Caching**: Performance optimization with intelligent caching
- **RESTful APIs**: Clean API design with proper error handling

### AI/ML Features
- **Recommendation Engine**: Hybrid collaborative + content-based filtering
- **Smart Search**: TF-IDF vectorization with personalization
- **Analytics Processing**: User behavior analysis and content performance metrics
- **Real-time Personalization**: Dynamic content adaptation based on user preferences

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Recharts** - Data visualization library

### Backend
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Python Flask** - Microservices for ML operations
- **Redis** - Caching and session management
- **PostgreSQL** - Primary database

### AI/ML Stack
- **scikit-learn** - Machine learning algorithms
- **pandas & numpy** - Data processing
- **TF-IDF** - Text analysis and search ranking
- **Collaborative Filtering** - Recommendation algorithms

## 📁 Project Structure

\`\`\`
netflix-clone-starter/
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   ├── search/                   # Search functionality
│   ├── recommendations/          # AI recommendations
│   ├── analytics/               # Analytics dashboard
│   ├── admin/                   # Admin panel
│   └── api/                     # API routes
├── components/                   # React components
│   ├── layout/                  # Layout components
│   ├── home/                    # Home page components
│   ├── search/                  # Search components
│   ├── recommendations/         # Recommendation components
│   ├── analytics/              # Analytics components
│   ├── admin/                  # Admin components
│   └── ui/                     # shadcn/ui components
├── hooks/                       # Custom React hooks
├── lib/                        # Utility functions
├── python-services/            # Python microservices
│   ├── recommendation_service.py # AI recommendation engine
│   ├── search_service.py        # Intelligent search service
│   ├── analytics_service.py     # Analytics processing
│   └── requirements.txt         # Python dependencies
├── scripts/                    # Database scripts
│   ├── 01-create-tables.sql    # Database schema
│   └── 02-seed-sample-data.sql # Sample data
└── README.md                   # This file
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- Supabase account
- Redis (optional, for caching)

### 1. Clone and Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd netflix-clone-starter

# Install Node.js dependencies
npm install

# Install Python dependencies
npm run python:install
# or manually:
cd python-services && pip install -r requirements.txt
\`\`\`

### 2. Environment Setup

\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
\`\`\`

Required environment variables:
- \`NEXT_PUBLIC_SUPABASE_URL\`: Your Supabase project URL
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`: Supabase anonymous key
- \`SUPABASE_SERVICE_ROLE_KEY\`: Supabase service role key
- \`PYTHON_API_BASE\`: Python services base URL (default: http://localhost:8000)

### 3. Database Setup

\`\`\`bash
# Run database migrations
npm run setup:db

# Or manually execute SQL scripts in Supabase SQL editor:
# 1. scripts/01-create-tables.sql
# 2. scripts/02-seed-sample-data.sql
\`\`\`

### 4. Start Development Servers

\`\`\`bash
# Terminal 1: Start Next.js development server
npm run dev

# Terminal 2: Start Python microservices
npm run python:dev

# Or start services individually:
# cd python-services
# python recommendation_service.py  # Port 8000
# python search_service.py         # Port 8001
# python analytics_service.py      # Port 8002
\`\`\`

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Recommendation Service**: http://localhost:8000
- **Search Service**: http://localhost:8001
- **Analytics Service**: http://localhost:8002

## 🏗 Team Development Guide

This project is structured for a team of 3 developers:

### Team Member 1: Recommendation System & ML
**Focus Areas:**
- \`python-services/recommendation_service.py\`
- \`app/recommendations/\` pages
- \`components/recommendations/\`
- \`hooks/use-recommendations.ts\`

**Responsibilities:**
- Implement and improve recommendation algorithms
- A/B testing for recommendation strategies
- Performance optimization for ML models
- Integration with user behavior data

### Team Member 2: Search & User Analysis
**Focus Areas:**
- \`python-services/search_service.py\`
- \`python-services/analytics_service.py\`
- \`app/search/\` pages
- \`components/search/\`
- \`hooks/use-search.ts\`

**Responsibilities:**
- Search algorithm improvements
- User behavior analysis
- Search ranking optimization
- Analytics data processing

### Team Member 3: Dashboard & Visualization
**Focus Areas:**
- \`app/analytics/\` pages
- \`app/admin/\` pages
- \`components/analytics/\`
- \`components/admin/\`
- \`hooks/use-analytics.ts\`

**Responsibilities:**
- Dashboard UI/UX improvements
- Data visualization components
- Admin panel features
- Performance monitoring tools

## 🔧 API Integration

### Recommendation API
\`\`\`typescript
// Get personalized recommendations
const response = await fetch('/api/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'for-you',
    filters: { genre: 'action' },
  }),
});
\`\`\`

### Search API
\`\`\`typescript
// Perform intelligent search
const response = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'action movies',
    filters: { year: '2023', rating: '8' },
  }),
});
\`\`\`

### Analytics API
\`\`\`typescript
// Get analytics data
const response = await fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    timeRange: '7d',
  }),
});
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
# Deploy Python services to a cloud provider (AWS, GCP, etc.)
\`\`\`

### Environment Variables for Production
- Set all environment variables in Vercel dashboard
- Update \`PYTHON_API_BASE\` to your deployed Python services URL
- Configure Supabase for production use
- Set up Redis instance for caching

### Python Services Deployment
Deploy Python microservices to:
- **AWS Lambda** (serverless)
- **Google Cloud Run** (containerized)
- **Railway/Render** (simple deployment)
- **Docker containers** on any cloud provider

## 📊 Database Schema

### Key Tables
- \`user_profiles\`: Extended user information
- \`content\`: Movies and TV shows
- \`viewing_history\`: User watch history
- \`user_preferences\`: User preferences and settings
- \`user_ratings\`: Content ratings by users
- \`search_history\`: Search queries for personalization
- \`recommendation_logs\`: Recommendation tracking
- \`content_metrics\`: Content performance analytics

### Security
- Row Level Security (RLS) enabled
- User data isolation
- Secure API endpoints
- Environment variable protection

## 🔍 Features Deep Dive

### Recommendation System
- **Collaborative Filtering**: User-based recommendations
- **Content-Based**: Genre and metadata matching
- **Hybrid Approach**: Combined algorithms for better accuracy
- **Real-time Learning**: Adapts to user behavior
- **A/B Testing Ready**: Easy algorithm comparison

### Search Engine
- **TF-IDF Vectorization**: Semantic search capabilities
- **Personalization**: User preference integration
- **Filters**: Genre, year, rating, type filtering
- **Autocomplete**: Smart search suggestions
- **Ranking**: ML-powered result ranking

### Analytics Dashboard
- **User Behavior**: Activity patterns and engagement
- **Content Performance**: View counts and ratings
- **Device Analytics**: Platform usage statistics
- **Recommendation Metrics**: Algorithm performance
- **Real-time Updates**: Live data visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic recommendation system
- ✅ Search functionality
- ✅ Analytics dashboard
- ✅ Admin panel

### Phase 2 (Next)
- 🔄 Advanced ML models (deep learning)
- 🔄 Real-time streaming
- 🔄 Mobile app (React Native)
- 🔄 Content management system

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced analytics (cohort analysis)
- 📋 Social features (sharing, reviews)
- 📋 Payment integration

---

**Built with ❤️ for the developer community**

Ready to build the next Netflix? Let's get started! 🚀

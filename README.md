# MovieRate - Netflix Clone

A modern, production-ready Netflix clone built with Next.js, Supabase, and Python microservices. Features AI-powered recommendations, intelligent search, comprehensive analytics, and admin supervision tools.

## 🚀 Features

### Frontend (Next.js 14)

* **Modern UI/UX**: Netflix-inspired design with Tailwind CSS and shadcn/ui
* **Authentication**: Complete auth system with Supabase Auth
* **Responsive Design**: Mobile-first approach with responsive layouts
* **Real-time Updates**: Live data updates and notifications

### Core Pages & Features

* **Home**: Hero section with featured content and personalized rows
* **Search**: Intelligent search with ML-powered ranking and filters
* **Recommendations**: AI-driven content recommendations with multiple algorithms
* **Analytics Dashboard**: Comprehensive analytics with interactive charts
* **Admin Panel**: User management, content supervision, and system health monitoring

### Backend Architecture

* **Supabase**: PostgreSQL database with real-time subscriptions
* **Python Microservices**: Dedicated services for ML/AI operations
* **Redis Caching**: Performance optimization with intelligent caching
* **RESTful APIs**: Clean API design with proper error handling

### AI/ML Features

* **Recommendation Engine**: Hybrid collaborative + content-based filtering
* **Smart Search**: TF-IDF vectorization with personalization
* **Analytics Processing**: User behavior analysis and content performance metrics
* **Real-time Personalization**: Dynamic content adaptation based on user preferences

## 🛠 Tech Stack

### Frontend

* **Next.js 14** - React framework with App Router
* **TypeScript** - Type-safe development
* **Tailwind CSS** - Utility-first CSS framework
* **shadcn/ui** - Modern component library
* **Recharts** - Data visualization library

### Backend

* **Supabase** - Backend-as-a-Service with PostgreSQL
* **Python Flask** - Microservices for ML operations
* **Redis** - Caching and session management
* **PostgreSQL** - Primary database

### AI/ML Stack

* **scikit-learn** - Machine learning algorithms
* **pandas & numpy** - Data processing
* **TF-IDF** - Text analysis and search ranking
* **Collaborative Filtering** - Recommendation algorithms

## 📁 Project Structure

```
netflix-clone-starter/
├── app/
│   ├── auth/
│   ├── search/
│   ├── recommendations/
│   ├── analytics/
│   ├── admin/
│   └── api/
├── components/
│   ├── layout/
│   ├── home/
│   ├── search/
│   ├── recommendations/
│   ├── analytics/
│   ├── admin/
│   └── ui/
├── hooks/
├── lib/
├── python-services/
│   ├── recommendation_service.py
│   ├── search_service.py
│   ├── analytics_service.py
│   └── requirements.txt
├── scripts/
│   ├── 01-create-tables.sql
│   └── 02-seed-sample-data.sql
└── README.md
```

## 🚀 Quick Start

### Prerequisites

* Node.js 18+ and npm/yarn
* Python 3.8+
* Supabase account
* Redis (optional)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd netflix-clone-starter
npm install
cd python-services && pip install -r requirements.txt
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `PYTHON_API_BASE`

### 3. Database Setup

```bash
npm run setup:db
```

Or run SQL scripts manually.

### 4. Start Development Servers

```bash
npm run dev
# In another terminal:
cd python-services
python recommendation_service.py
python search_service.py
python analytics_service.py
```

### 5. Access the Application

* Frontend: [http://localhost:3000](http://localhost:3000)
* Python Services: Ports 8000, 8001, 8002

## 📇 Team Development Guide

### Member 1: Recommendation System & ML

* Python & Next.js rec pages
* Model optimization and integration

### Member 2: Search & User Analysis

* Smart search and analytics processing

### Member 3: Dashboard & Visualization

* UI/UX of analytics and admin tools

## 🔧 API Integration

### Recommendation

```ts
fetch('/api/recommendations', { ... })
```

### Search

```ts
fetch('/api/search', { ... })
```

### Analytics

```ts
fetch('/api/analytics', { ... })
```

## 🚀 Deployment

### Frontend: Vercel

* Set environment variables
* Deploy with `vercel`

### Python Services

* AWS Lambda / Google Cloud Run / Railway / Docker

## 📊 Database Schema Highlights

Tables: user\_profiles, content, viewing\_history, user\_preferences, user\_ratings, search\_history, recommendation\_logs, content\_metrics

Security: RLS, API protection, environment isolation

## 🔍 Features Deep Dive

### Recommendation System

* Collaborative + content-based filtering
* Real-time adaptation

### Search Engine

* TF-IDF
* Smart filters and ranking

### Analytics

* User behavior
* Content performance
* Live dashboard

## 🤝 Contributing

1. Fork
2. Create branch
3. Commit
4. Push
5. PR

## 📋 License

MIT License

## 😎 Support

* Use issues and discussions in GitHub

## 🎯 Roadmap

### Phase 1

* Core features (done)

### Phase 2

* DL models, mobile app, real-time streaming

### Phase 3

* Multi-language, cohort analytics, social features, payments

---

**Built with ❤️ for the developer community.**

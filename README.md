 🎬 Netflix Clone Starter

A modern, production-ready **Netflix Clone** built with **Next.js**, **Supabase**, and **Python microservices**.  
Designed as a starter template for learning full-stack development and experimenting with advanced features like **recommendation systems**, **analytics dashboards**, and **AI-driven search**.

---

## ✨ Features

- 🔐 **Authentication & User Management** with Supabase Auth  
- 🎥 **Movie/TV Show Listings** with search & filter  
- 🤖 **AI-powered Recommendations** using Python ML services  
- 📊 **Analytics Dashboard** for user behavior and trends  
- 🗂 **Admin Panel** for content supervision  
- 📱 **Responsive UI/UX** (mobile-first, Tailwind CSS)  
- 🚀 **Production-ready setup** with environment configs  

---

## 🛠 Tech Stack

| Layer         | Technology Used                                  |
|---------------|--------------------------------------------------|
| **Frontend**  | Next.js 14, React, Tailwind CSS, shadcn/ui       |
| **Backend**   | Supabase (Postgres + Auth + Storage)             |
| **Services**  | Python (FastAPI, scikit-learn, Pandas, etc.)     |
| **Analytics** | Recharts, Supabase SQL queries                   |
| **Deployment**| Vercel (frontend), Supabase hosting, Render/Heroku (Python services) |

---

## 📂 Project Structure

```bash
netflix-clone-starter/
│── frontend/              # Next.js app
│   ├── components/        # UI components
│   ├── pages/             # Routes
│   ├── utils/             # Helpers
│   └── styles/            # Global CSS/Tailwind
│
│── services/              # Python microservices
│   ├── recommendation/    # ML-based movie recommender
│   ├── analytics/         # User trends, dashboards
│   └── supervision/       # Admin moderation
│
│── .env.example           # Example environment variables
│── package.json           # Frontend dependencies
│── requirements.txt       # Python dependencies
│── README.md              # Project documentation
````

---

## ⚡ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Python](https://www.python.org/) (3.10+ recommended)
* [Supabase](https://supabase.com/) account
* Git & basic terminal knowledge

---

### 🔧 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/Shaik-Farhana/netflix-clone-starter.git
   cd netflix-clone-starter
   ```

2. **Frontend setup**

   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   ```

   Fill in your Supabase keys in `.env.local`.

3. **Python services setup**

   ```bash
   cd services/recommendation
   pip install -r requirements.txt
   python main.py
   ```

---

### ▶️ Running Locally

* **Frontend (Next.js)**

  ```bash
  cd frontend
  npm run dev
  ```

  Open: [http://localhost:3000](http://localhost:3000)

* **Backend Services (Python)**

  ```bash
  cd services/recommendation
  python main.py
  ```

---

## 🌍 Deployment

* **Frontend**: Deploy to [Vercel](https://vercel.com/) with GitHub integration.
* **Supabase**: Automatically hosted after project setup.
* **Python services**: Use [Render](https://render.com/), [Railway](https://railway.app/), or Docker + VPS.

---

## 📜 License

MIT License © 2025 [Shaik Farhana](https://github.com/Shaik-Farhana)


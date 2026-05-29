# 🚀 PrepGenie - AI-Powered Developer Prep & Mock Interview Platform

PrepGenie is a premium, comprehensive full-stack platform engineered to revolutionize how developers prepare for technical interviews, system design challenges, and core engineering assessments. It bridges the gap between conceptual knowledge and production-ready system engineering.

---

## 🏗️ System Architecture & Tech Stack

The application is structured as a decoupled, multi-tier system combining highly dynamic user interfaces with a robust, enterprise-grade distributed backend framework.

### 💻 Frontend (Client Tier)
* **Framework:** React.js with Vite (Engineered for micro-frontend speeds and hot-module replacement).
* **Styling & Motion:** Tailwind CSS coupled with Framer Motion for high-end fluid animations, adaptive responsive layouts, and dynamic canvas rendering.
* **Storage & Client State:** Local state management seamlessly integrated with browser storage for persistence across dashboard analytics and interactive modules.

### ☕ Backend (Application Tier)
* **Language & Core:** Java 17 / Jakarta EE.
* **Core Framework:** Spring Boot (Spring Security, Spring Web, Spring Data JPA).
* **Security & Auth:** Stateless token-based architecture using JSON Web Tokens (JWT) custom validation filters.
* **Caching & Session States:** Redis integration for microsecond handling of persistent state metrics and streak records.

### 🗄️ Database & Cloud Services (Data Tier)
* **Primary Infrastructure:** Supabase (Enterprise PostgreSQL architecture with relational integrity).
* **AI Engine Integration:** Core API layer communicating with distributed Large Language Models via OpenRouter for smart evaluations and AI feedback generation.
* **Deployment & Pipelines:** Production UI hosted on Vercel with automatic continuous integration / continuous deployment (CI/CD) hooks.

---

## ⚡ Core Features & Capabilities

* **🤖 AI Mock Interview Panels:** Dynamic voice-and-text integrated AI panels that mimic real-world technical and HR loops, providing detailed system evaluations.
* **📊 System Design Grids & Sandboxes:** Interactive visual frameworks that aid in mapping distributed state engines, database schemas, and microservice topologies.
* **💡 Smart Analytics Dashboard:** Comprehensive tracking systems providing real-time code-review feedbacks, streak calendars, and developer persona insights.
* **📓 Smart Coding Playground & Notebook:** Real-time sandboxed interface for prototyping algorithms, persistent note-taking, and active flashcard revisions.
* **🏆 Distributed Leaderboards:** Real-time rank calculation models designed to drive collaborative problem-solving among engineering networks.

---

## 📂 Project Directory Structure

```text
PrepGenie/
├── frontend/                  # React.js SPA Source Client
│   ├── public/                # Dynamic canvas models & global assets
│   ├── src/
│   │   ├── components/        # Reusable design assets (Sidebars, Modals, Cursors)
│   │   ├── pages/             # Core views (System Design, Analytics, Dashboards)
│   │   ├── lib/               # API clients, Gemini LLM bindings, Supabase configs
│   │   └── utils/             # Sound engines and analytical calculations
│   └── vercel.json            # Deployment routing rules
│
└── backend/                   # Enterprise Spring Boot Backend Engine
    ├── src/main/java/com/rafia/prepgenie/
    │   ├── config/            # Security configs, CORS rules, Redis connections
    │   ├── controller/        # High-throughput REST API Endpoints
    │   ├── dto/               # Data Transfer Objects for clean request/response serialization
    │   ├── entity/            # Relational Hibernate/JPA schema models
    │   ├── repository/        # Abstract database transaction management layers
    │   └── service/           # core transactional logic algorithms & event systems
    └── pom.xml                # Maven global dependencies manager
🔧 Installation & Environment Configuration
Frontend Setup
Navigate to the client directory:

Bash
   cd frontend
Install standard dependencies:

Bash
   npm install
Boot the Vite development sandbox:

Bash
   npm run dev
Backend Setup
Navigate to the app engine directory:

Bash
   cd backend
Configure your environmental credentials in src/main/resources/application.properties:

Properties
   openrouter.api.key=${OPENROUTER_API_KEY}
   spring.datasource.url=your_supabase_postgres_url
Compile and boot the application engine using Maven:

Bash
   mvn spring-boot:run
💡 Developed with passion by Rafia Minhaj — Engineering high-performance architectures for next-generation systems.


---

### 📤 GitHub Par Is README Ko Kaise Add Karein?

Aap directly terminal se bina kisi jhanjhat ke ise 1 minute me add kar sakti hain:

1. Apne project root folder (`PrepGenie>`) me ek nayi file banaiye jiska naam rakhiye **`README.md`**.
2. Upar diye gaye code ko poora copy karke us file me paste kijiye aur save kar dijiye.
3. Terminal me bas ye 3 simple commands chala dijiye:

```bash
git add README.md
git commit -m "docs: added architectural documentation and professional readme"
git push origin main

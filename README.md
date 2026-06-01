# 🚀 PrepGenie - AI-Powered Developer Prep & Mock Interview Platform

PrepGenie is a premium, comprehensive full-stack platform engineered to revolutionize how developers prepare for technical interviews, system design challenges, and core engineering assessments. It bridges the gap between conceptual knowledge and production-ready system engineering.

> *"PrepGenie isn't just a platform; it's a self-evolving AI mentor designed to bridge the gap between theoretical learning and industry-level execution."*

---

## 🎯 Core Concepts & Vision

PrepGenie is built on the philosophy of **"Active Learning through Agentic AI"**. Rather than just reading static interview questions, developers interact with autonomous AI agents that act as tutors, mock interviewers, and system design evaluators. 

Our core concept is to provide a **sandboxed, risk-free environment** where developers can practice coding, architecture design, and soft skills with real-time feedback that mimics tier-1 tech company interview loops.

---

## ⚡ Key Features & Capabilities

* **🤖 Autonomous AI Agents:** Powered by LangChain, our AI Tutor Agent actively reads your code in real-time, providing conversational hints and guidance without simply giving away the answer.
* **⚙️ Enterprise AI Pipeline:** Designed and deployed a fully automated workflow using **n8n Orchestrator** and **Google Gemini API** to autonomously generate, parse, and inject complex interview questions (Hard System Design, Java) directly into the application's database.
* **🧠 Advanced ML & DL Curriculum:** Upgraded the assessment engine to include dynamic evaluations on modern industry trends, specifically **Machine Learning Basics, Deep Learning (CNNs, RNNs), and Generative AI (RAG, LLMs)**.
* **🗣️ AI Mock Interview Panels:** Dynamic voice-and-text integrated AI panels that mimic real-world technical and HR loops, providing detailed evaluations on grammar, fluency, and technical accuracy.
* **📊 System Design Grids & Sandboxes:** Interactive visual frameworks that aid in mapping distributed state engines, database schemas, and microservice topologies.
* **💡 Smart Analytics Dashboard:** Comprehensive tracking systems providing real-time code-review feedbacks, streak calendars, and developer persona insights.
* **📓 Smart Coding Playground & Notebook:** Real-time sandboxed interface for prototyping algorithms, persistent note-taking, and active flashcard revisions.

---

## 🏗️ System Architecture & Tech Stack

The application is structured as a decoupled, multi-tier system combining highly dynamic user interfaces with a robust, enterprise-grade distributed backend framework.

### 💻 Frontend (Client Tier)
* **Framework:** React.js with Vite (Engineered for micro-frontend speeds).
* **AI & Agents:** `@langchain/google-genai` and `@google/generative-ai` for autonomous workflows.
* **Automation:** Local integration with **n8n Workflow Automation** for data pipeline orchestration.
* **Styling & Motion:** Tailwind CSS coupled with Framer Motion for high-end fluid animations.
* **State Management:** Local state management seamlessly integrated with browser storage for persistence.

### ☕ Backend (Application Tier)
* **Language & Core:** Java 17 / Jakarta EE.
* **Core Framework:** Spring Boot (Spring Security, Spring Web, Spring Data JPA).
* **Security & Auth:** Stateless token-based architecture using JSON Web Tokens (JWT).
* **Caching:** Redis integration for microsecond handling of persistent state metrics.

### 🗄️ Database & Cloud Services (Data Tier)
* **Primary Infrastructure:** Supabase (Enterprise PostgreSQL architecture).
* **Deployment & Pipelines:** Production UI hosted on Vercel with automated CI/CD hooks.

---

## 📂 Project Directory Structure

```text
PrepGenie/
├── frontend/                  # React.js SPA Source Client
│   ├── public/                # Dynamic canvas models & global assets
│   ├── scripts/               # Autonomous AI Agent Scripts (cron jobs)
│   ├── src/
│   │   ├── components/        # Reusable design assets
│   │   ├── pages/             # Core views (System Design, Analytics, Coding Playground)
│   │   ├── lib/               # API clients, LangChain agents, Supabase configs
│   │   └── data/              # Dynamic data & AI generated outputs
│   └── package.json           # Dependencies and automation scripts
│
└── backend/                   # Enterprise Spring Boot Backend Engine
    ├── src/main/java/com/rafia/prepgenie/
    │   ├── config/            # Security configs, CORS rules, Redis connections
    │   ├── controller/        # High-throughput REST API Endpoints
    │   └── service/           # Core transactional logic & event systems
    └── pom.xml                # Maven global dependencies manager
```

---

## 🔧 How to Run Locally

### 1. Frontend Setup (React/Vite)

Navigate to the client directory:
```bash
cd frontend
```

Install standard dependencies (including LangChain & GenAI tools):
```bash
npm install
```

Configure Environment Variables:
Create a `.env.local` file in the `frontend` folder and add your keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Boot the Vite development server:
```bash
npm run dev
```

Run the Automated AI Quiz Agent (Background Job):
```bash
npm run automation:quiz
```

### 2. Backend Setup (Spring Boot)

Navigate to the app engine directory:
```bash
cd backend
```

Configure your environmental credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=your_supabase_postgres_url
```

Compile and boot the application engine using Maven:
```bash
mvn spring-boot:run
```

---

💡 **Developed with passion by Rafia Minhaj** — Engineering high-performance architectures for next-generation systems.

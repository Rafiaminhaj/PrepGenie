import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Interview from './pages/Interview';
import Quiz from './pages/Quiz';
import VisualLearning from './pages/VisualLearning';
import Notebook from './pages/Notebook';
import Analytics from './pages/Analytics';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Flashcards from './pages/Flashcards';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';
import SystemDesign from './pages/SystemDesign';
import DeveloperPersona from './pages/DeveloperPersona';
import LiveSpeak from './pages/LiveSpeak';
import ResumeRoaster from './pages/ResumeRoaster';
import CompanyPrep from './pages/CompanyPrep';
import CodeReview from './pages/CodeReview';
import StreakCalendar from './pages/StreakCalendar';
import HrInterview from './pages/HrInterview';
import ParticleBackground from './components/ParticleBackground';
import FloatingGenie from './components/FloatingGenie';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import CustomCursor from './components/CustomCursor';
import PracticeQuiz from './pages/PracticeQuiz';
import SmartNotebook from './pages/SmartNotebook';
import CodingPlayground from './pages/CodingPlayground';
import DsaRoadmap from './pages/DsaRoadmap';
import JobTracker from './pages/JobTracker';

function App() {
  useEffect(() => {
    // Daily Streak Logic
    const syncScoreToSupabase = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        if (!user.name) return;

        const score = parseInt(localStorage.getItem('gems') || '0', 10);
        
        await supabase.from('leaderboard').upsert(
          { 
            username: user.name, 
            total_score: score,
            role: user.role || 'Aspiring SDE' 
          }, 
          { onConflict: 'username' }
        );
      } catch (err) {
        // Silently fail if mock mode or supabase down
        console.log('Sync to leaderboard failed (expected in mock mode)');
      }
    };

    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      const lastLoginDate = localStorage.getItem('lastLoginDate');
      const today = new Date().toDateString();
      
      if (lastLoginDate !== today) {
        if (lastLoginDate) {
          const lastDate = new Date(lastLoginDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate.toDateString() === yesterday.toDateString()) {
            // Streak continues
            const currentStreak = parseInt(localStorage.getItem('prepGenie_streak') || '0', 10);
            localStorage.setItem('prepGenie_streak', currentStreak + 1);
          } else {
            // Streak broken
            localStorage.setItem('prepGenie_streak', 1);
          }
        } else {
          // First time login
          localStorage.setItem('prepGenie_streak', 1);
        }
        localStorage.setItem('lastLoginDate', today);
        window.dispatchEvent(new Event('statsUpdated'));
      }
      
      // Initialize score if missing
      if (!localStorage.getItem('prepGenie_score')) {
        localStorage.setItem('prepGenie_score', '0');
      }

      // Initial Sync to Supabase Leaderboard on load
      syncScoreToSupabase();
    }

    const handleStatsUpdate = () => {
      syncScoreToSupabase();
    };

    window.addEventListener('statsUpdated', handleStatsUpdate);

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        // Increment locally for instant UI update
        const currentTime = parseInt(localStorage.getItem('studyTime') || '0', 10);
        localStorage.setItem('studyTime', currentTime + 1);
        window.dispatchEvent(new Event('studyTimeUpdated'));
      }
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <CustomCursor />
      <ParticleBackground />
      <FloatingGenie />
      <Sidebar />
      <Toaster position="top-right" toastOptions={{ 
        style: { background: '#1e1e24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } 
      }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/visual" element={<VisualLearning />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/system-design" element={<SystemDesign />} />
        <Route path="/persona" element={<DeveloperPersona />} />
        <Route path="/live-speak" element={<LiveSpeak />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/resume-roaster" element={<ResumeRoaster />} />
        <Route path="/company-prep" element={<CompanyPrep />} />
        <Route path="/code-review" element={<CodeReview />} />
        <Route path="/streak" element={<StreakCalendar />} />
        <Route path="/hr-interview" element={<HrInterview />} />
        <Route path="/practice-quiz" element={<PracticeQuiz />} />
        <Route path="/smart-notebook" element={<SmartNotebook />} />
        <Route path="/coding-playground" element={<CodingPlayground />} />
        <Route path="/roadmap" element={<DsaRoadmap />} />
        <Route path="/job-tracker" element={<JobTracker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

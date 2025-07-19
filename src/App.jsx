import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import MemoryGame from './MemoryGame';
import UserDashboard from './UserDashboard';
import Auth from './Auth'; // Import Auth component

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state for auth
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isUserDashboardVisible, setIsUserDashboardVisible] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <p className="text-2xl text-primary">กำลังโหลด...</p>
      </div>
    );
  }

  // If no session, show the authentication form
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background text-text">
        <Auth />
      </div>
    );
  }

  // If session exists, render the main app content
  if (isGameStarted) {
    return <MemoryGame onBack={() => setIsGameStarted(false)} />;
  }

  if (isUserDashboardVisible) {
    return <UserDashboard onBack={() => setIsUserDashboardVisible(false)} />;
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-text">
      <main className="bg-surface p-10 rounded-3xl shadow-2xl max-w-2xl w-full text-center border border-border">
        <h2 className="text-4xl font-semibold text-text mb-6">
          ยินดีต้อนรับสู่แอปฝึกสมองของคุณ!
        </h2>
        <p className="text-xl text-textSecondary mb-8 leading-relaxed">
          แอปต้นแบบนี้ออกแบบมาพร้อมองค์ประกอบขนาดใหญ่และชัดเจน เพื่อประสบการณ์ที่ใช้งานง่าย
          มาเริ่มการฝึกความจำของคุณกันเลย
        </p>

        <div className="flex flex-col space-y-6">
          <button
            className="bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-xl text-2xl transition-all duration-300 ease-in-out shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-surface
                       active:scale-98"
            onClick={() => setIsGameStarted(true)}
          >
            เริ่มเกมความจำ
          </button>

          <button
            className="bg-secondary hover:bg-secondary/90 text-white font-bold py-5 px-10 rounded-xl text-2xl transition-all duration-300 ease-in-out shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-surface
                       active:scale-98"
            onClick={() => setIsUserDashboardVisible(true)}
          >
            ดู Dashboard ผู้ใช้
          </button>

          <button
            className="bg-error hover:bg-error/90 text-white font-bold py-5 px-10 rounded-xl text-2xl transition-all duration-300 ease-in-out shadow-lg
                       focus:outline-none focus:ring-4 focus:ring-error/50 focus:ring-offset-2 focus:ring-offset-surface
                       active:scale-98"
            onClick={handleSignOut}
          >
            ออกจากระบบ
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;

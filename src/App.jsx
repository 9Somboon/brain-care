import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import MemoryGame from './MemoryGame';
import UserDashboard from './UserDashboard'; // Import UserDashboard

function App() {
  console.log('App.jsx loaded - Version with User Dashboard integration');
  const [message, setMessage] = useState('กำลังเชื่อมต่อกับ Supabase...');
  const [isConnected, setIsConnected] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isUserDashboardVisible, setIsUserDashboardVisible] = useState(false); // New state for user dashboard

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase.from('non_existent_table').select('*').limit(1);
        if (error && error.code === '42P01') {
          setMessage('เชื่อมต่อ Supabase แล้ว! พร้อมสร้างแอปฝึกสมองของคุณ');
          setIsConnected(true);
        } else if (error) {
          setMessage(`ข้อผิดพลาดในการเชื่อมต่อ Supabase: ${error.message}`);
          setIsConnected(false);
        } else {
          setMessage('เชื่อมต่อ Supabase สำเร็จ (ได้รับข้อมูลที่ไม่คาดคิด)');
          setIsConnected(true);
        }
      } catch (err) {
        setMessage(`เชื่อมต่อ Supabase ล้มเหลว: ${err.message}`);
        setIsConnected(false);
      }
    };

    checkSupabaseConnection();
  }, []);

  if (isGameStarted) {
    return <MemoryGame onBack={() => setIsGameStarted(false)} />;
  }

  if (isUserDashboardVisible) {
    return <UserDashboard onBack={() => setIsUserDashboardVisible(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-text">
      <header className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-6xl font-bold text-primary mb-4 leading-tight">
          BrainCare Pro
        </h1>
        <p className="text-2xl text-textSecondary max-w-2xl mx-auto">
          เสริมสร้างพลังสมอง ทีละเกม ออกแบบมาเพื่อความชัดเจนและใช้งานง่าย
        </p>
      </header>

      <main className="bg-surface p-10 rounded-3xl shadow-2xl max-w-2xl w-full text-center border border-border">
        <h2 className="text-4xl font-semibold text-text mb-6">
          ยินดีต้อนรับสู่แอปฝึกสมองของคุณ!
        </h2>
        <p className="text-xl text-textSecondary mb-8 leading-relaxed">
          แอปต้นแบบนี้ออกแบบมาพร้อมองค์ประกอบขนาดใหญ่และชัดเจน เพื่อประสบการณ์ที่ใช้งานง่าย
          มาเริ่มการฝึกความจำของคุณกันเลย
        </p>

        <div className={`p-6 rounded-xl mb-8 ${isConnected ? 'bg-success/20 border-success text-success' : 'bg-error/20 border-error text-error'} border-2`}>
          <p className="text-2xl font-medium">{message}</p>
        </div>

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
        </div>

        <p className="text-lg text-textSecondary mt-8">
          การเดินทางสู่จิตใจที่เฉียบคมของคุณเริ่มต้นที่นี่
        </p>
      </main>

      <footer className="mt-12 text-textSecondary text-lg">
        &copy; {new Date().getFullYear()} BrainCare Pro. สงวนลิขสิทธิ์
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const UserDashboard = ({ onBack }) => {
  const [gameSessions, setGameSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameSessions = async () => {
      try {
        // For a true user dashboard, you would filter by auth.uid() here:
        // const { data, error } = await supabase
        //   .from('game_sessions')
        //   .select('*')
        //   .eq('user_id', (await supabase.auth.getUser()).data.user.id) // Requires user to be logged in
        //   .order('created_at', { ascending: true });

        // For now, fetching all sessions as authentication is not yet implemented
        const { data, error } = await supabase
          .from('game_sessions')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setGameSessions(data);
      } catch (err) {
        console.error('Error fetching game sessions:', err.message);
        setError('ไม่สามารถโหลดข้อมูลสถิติได้: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameSessions();
  }, []);

  const totalGames = gameSessions.length;
  const totalScore = gameSessions.reduce((sum, session) => sum + session.score, 0);
  const totalTime = gameSessions.reduce((sum, session) => sum + session.time_taken_seconds, 0);
  const totalFlips = gameSessions.reduce((sum, session) => sum + session.flips, 0);

  const avgScore = totalGames > 0 ? (totalScore / totalGames).toFixed(2) : 0;
  const avgTime = totalGames > 0 ? (totalTime / totalGames).toFixed(2) : 0;
  const avgFlips = totalGames > 0 ? (totalFlips / totalGames).toFixed(2) : 0;

  // Prepare data for charts
  const chartLabels = gameSessions.map((_, index) => `เกมที่ ${index + 1}`);
  const scoreData = gameSessions.map(session => session.score);
  const timeData = gameSessions.map(session => session.time_taken_seconds);
  const flipsData = gameSessions.map(session => session.flips);

  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'คะแนนที่ได้',
        data: scoreData,
        borderColor: 'rgb(158, 127, 255)', // primary
        backgroundColor: 'rgba(158, 127, 255, 0.5)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(158, 127, 255)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'เวลาที่ใช้ (วินาที)',
        data: timeData,
        borderColor: 'rgb(56, 189, 248)', // secondary
        backgroundColor: 'rgba(56, 189, 248, 0.5)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgb(56, 189, 248)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'จำนวนครั้งที่พลิกการ์ด',
        data: flipsData,
        backgroundColor: 'rgba(244, 114, 182, 0.7)', // accent
        borderColor: 'rgb(244, 114, 182)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#A3A3A3', // textSecondary
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: 'สถิติการเล่นเกม',
        color: '#FFFFFF', // text
        font: {
          size: 24,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(38, 38, 38, 0.9)', // surface
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#9E7FFF', // primary
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: '#A3A3A3', font: { size: 14 } },
        grid: { color: 'rgba(47, 47, 47, 0.5)' }, // border
      },
      y: {
        ticks: { color: '#A3A3A3', font: { size: 14 } },
        grid: { color: 'rgba(47, 47, 47, 0.5)' }, // border
      },
    },
    animation: {
      duration: 1000, // milliseconds
      easing: 'easeInOutQuart',
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <p className="text-3xl text-primary">กำลังโหลดข้อมูลสถิติ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-error">
        <p className="text-3xl mb-4">{error}</p>
        <button
          className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 ease-in-out shadow-lg"
          onClick={onBack}
        >
          กลับสู่หน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-background text-text">
      <header className="w-full max-w-6xl text-center mb-12">
        <h1 className="text-6xl font-bold text-primary mb-4 leading-tight">
          Dashboard ผู้ใช้
        </h1>
        <p className="text-2xl text-textSecondary max-w-3xl mx-auto">
          ภาพรวมสถิติการเล่นเกมความจำ เพื่อติดตามความคืบหน้าและประสิทธิภาพของคุณ
        </p>
      </header>

      <main className="w-full max-w-6xl bg-surface p-10 rounded-3xl shadow-2xl border border-border mb-12">
        <h2 className="text-4xl font-semibold text-text mb-8 text-center">
          ภาพรวมสถิติ
        </h2>

        {totalGames === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="text-center text-2xl text-textSecondary p-8 bg-background rounded-xl border border-border"
          >
            <p>ยังไม่มีข้อมูลการเล่นเกม กรุณาเล่นเกมความจำก่อนเพื่อดูสถิติ</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <motion.div
                className="bg-background p-8 rounded-xl shadow-lg border border-border text-center transform transition-transform duration-300 hover:scale-105"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <h3 className="text-xl text-textSecondary mb-2">จำนวนเกมที่เล่น</h3>
                <p className="text-5xl font-bold text-primary">{totalGames}</p>
              </motion.div>

              <motion.div
                className="bg-background p-8 rounded-xl shadow-lg border border-border text-center transform transition-transform duration-300 hover:scale-105"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl text-textSecondary mb-2">คะแนนเฉลี่ย</h3>
                <p className="text-5xl font-bold text-secondary">{avgScore}</p>
              </motion.div>

              <motion.div
                className="bg-background p-8 rounded-xl shadow-lg border border-border text-center transform transition-transform duration-300 hover:scale-105"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl text-textSecondary mb-2">เวลาเฉลี่ย (วินาที)</h3>
                <p className="text-5xl font-bold text-accent">{avgTime}</p>
              </motion.div>

              <motion.div
                className="bg-background p-8 rounded-xl shadow-lg border border-border text-center transform transition-transform duration-300 hover:scale-105"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl text-textSecondary mb-2">พลิกการ์ดเฉลี่ย</h3>
                <p className="text-5xl font-bold text-success">{avgFlips}</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                className="bg-background p-8 rounded-xl shadow-lg border border-border h-96"
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <Line data={lineChartData} options={chartOptions} />
              </motion.div>

              <motion.div
                className="bg-background p-8 rounded-xl shadow-lg border border-border h-96"
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <Bar data={barChartData} options={chartOptions} />
              </motion.div>
            </div>
          </>
        )}
      </main>

      <button
        className="bg-primary hover:bg-primary/90 text-white font-bold py-5 px-10 rounded-xl text-2xl transition-all duration-300 ease-in-out shadow-lg
                   focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-surface
                   active:scale-98 mt-12"
        onClick={onBack}
      >
        กลับสู่หน้าหลัก
      </button>

      <footer className="mt-12 text-textSecondary text-lg">
        &copy; {new Date().getFullYear()} BrainCare Pro. สงวนลิขสิทธิ์
      </footer>
    </div>
  );
};

export default UserDashboard;

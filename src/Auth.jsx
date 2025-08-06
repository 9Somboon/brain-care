import React, { useState } from 'react';
import { auth } from './firebaseClient';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // To toggle between sign up and sign in

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('ลงทะเบียนสำเร็จ! โปรดเข้าสู่ระบบ');
        setIsSignUp(false); // Switch to sign in after successful signup
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setMessage(`ข้อผิดพลาด: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Firebase will handle the redirect and session management.
      // The onAuthStateChanged listener in App.jsx will handle the session.
    } catch (error) {
      setMessage(`ข้อผิดพลาดในการเข้าสู่ระบบด้วย Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-border">
      <h2 className="text-4xl font-semibold text-text mb-6">
        {isSignUp ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
      </h2>
      <p className="text-xl text-textSecondary mb-8 leading-relaxed">
        {isSignUp ? 'สร้างบัญชีใหม่เพื่อเริ่มฝึกสมอง' : 'เข้าสู่ระบบเพื่อเล่นเกมและดูสถิติ'}
      </p>

      <form onSubmit={handleAuth} className="flex flex-col space-y-6">
        <input
          className="p-4 rounded-xl bg-background border border-border text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          type="email"
          placeholder="อีเมลของคุณ"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="p-4 rounded-xl bg-background border border-border text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          type="password"
          placeholder="รหัสผ่านของคุณ"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 ease-in-out shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-surface
                     active:scale-98"
          type="submit"
          disabled={loading}
        >
          {loading ? 'กำลังดำเนินการ...' : (isSignUp ? 'ลงทะเบียน' : 'เข้าสู่ระบบ')}
        </button>
      </form>

      {message && (
        <p className={`mt-6 text-lg font-medium ${message.includes('ข้อผิดพลาด') ? 'text-error' : 'text-success'}`}>
          {message}
        </p>
      )}

      <div className="mt-6 border-t border-border pt-6">
        <p className="text-textSecondary mb-4">หรือเข้าสู่ระบบด้วย</p>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 ease-in-out shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-blue-600/50 focus:ring-offset-2 focus:ring-offset-surface
                     active:scale-98 flex items-center justify-center space-x-3"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google logo" className="w-6 h-6" />
          <span>เข้าสู่ระบบด้วย Google</span>
        </button>
      </div>

      <button
        className="mt-6 text-secondary hover:underline text-lg"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? ลงทะเบียนที่นี่'}
      </button>
    </div>
  );
}

export default Auth;

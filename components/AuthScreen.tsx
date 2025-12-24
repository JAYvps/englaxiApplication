
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, RefreshCw, LogIn, UserPlus, HelpCircle, CheckCircle2, Send, ChevronLeft, KeyRound, Heart, Check, AlertCircle } from 'lucide-react';
import Character from './Character';
import { Player } from '../types';
import { login } from '../services/apiService';

interface Props {
  onLoginSuccess: (player: Player) => void;
}

const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('zxcvbnm55');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForgotSuccessModal, setShowForgotSuccessModal] = useState(false);
  
  const [countdown, setCountdown] = useState(0);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendEmailCode = () => {
    // This is mock logic for now
    if (!validateEmail(email)) {
      setError('发送失败：请输入有效的邮箱地址');
      return;
    }
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('发送失败：请先输入正确的图形验证码');
      generateCaptcha();
      return;
    }
    setError('');
    setCountdown(60);
    setSuccessMsg('验证码已发送（演示模式）');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!validateEmail(email) || !password) {
        setError('请输入邮箱和密码。');
        return;
      }
      
      // Bypassing captcha for login as per our simplification
      // if (captchaInput.toUpperCase() !== captchaCode) {
      //   setError('图形验证码错误');
      //   generateCaptcha();
      //   return;
      // }

      setIsProcessing(true);
      try {
        const playerData = await login(email, password);
        setSuccessMsg('登录成功！正在进入世界...');
        setTimeout(() => {
          onLoginSuccess(playerData);
        }, 1200); // A small delay for the user to see the success message
      } catch (err: any) {
        setError(err.message || '登录失败，请检查您的凭据。');
        setIsProcessing(false);
        generateCaptcha(); // Refresh captcha on error
      }
    } else {
      // Mock logic for Register and Forgot Password
      alert(`此功能 ( ${mode} ) 仍在开发中！`);
    }
  };

  const resetForm = () => {
    setError('');
    setCaptchaInput('');
    setEmailCode('');
    // Keep email/password for user convenience
    // setPassword(''); 
    setNewPassword('');
    setConfirmPassword('');
    generateCaptcha();
  };

  const toggleMode = (newMode: 'login' | 'register' | 'forgot') => {
    resetForm();
    setMode(newMode);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* (All the AnimatePresence and Modal JSX remains the same as the full-featured version) */}
      <AnimatePresence>
        {showForgotSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} className="bg-white rounded-[3rem] p-10 w-full max-w-xs text-center shadow-2xl relative overflow-hidden">
              <div className="mb-6"><Character emotion="neutral" scale={0.9} /></div>
              <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">不要再忘记密码了哦</h3>
              <p className="text-pink-500 font-black text-lg mb-6">Momo会难过的</p>
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex justify-center text-pink-500 mb-2"><Heart size={40} fill="currentColor" /></motion.div>
              <div className="mt-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">即将返回登录...</div>
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100"><motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 3.5, ease: "linear" }} className="h-full bg-gradient-to-r from-pink-500 to-indigo-500" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {successMsg && !showForgotSuccessModal && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="absolute top-0 z-50 px-6 py-3 bg-white text-emerald-600 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-emerald-100 font-black text-sm max-w-[80%] text-center">
            <div className="bg-emerald-500 text-white p-1 rounded-full shrink-0"><CheckCircle2 size={16} /></div>
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4 z-10">
        <Character emotion={successMsg ? 'happy' : (error ? 'shocked' : 'neutral')} scale={0.9} />
      </motion.div>
      <motion.div layout className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/50 z-10 relative max-h-[85vh] flex flex-col">
        <AnimatePresence>{mode !== 'login' && <motion.button initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onClick={() => toggleMode('login')} disabled={isProcessing} className="absolute left-6 top-6 z-20 text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-black text-[10px] transition-colors bg-indigo-50/80 px-3 py-2 rounded-full border border-indigo-100"><ChevronLeft size={14} /><span>返回</span></motion.button>}</AnimatePresence>
        <AnimatePresence>{mode === 'forgot' && <motion.button initial={{ x: 20, opacity: 0, scale: 0.5 }} animate={{ x: 0, opacity: 1, scale: 1 }} exit={{ x: 20, opacity: 0, scale: 0.5 }} onClick={() => handleSubmit()} disabled={isProcessing} className="absolute right-6 top-6 z-30 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-full shadow-lg shadow-pink-200 flex items-center gap-1.5 active:scale-90 transition-all border border-white/20"><span className="text-[11px] font-black tracking-widest">确认</span><div className="bg-white/20 rounded-full p-0.5"><Check size={14} strokeWidth={4} /></div><motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-pink-400 rounded-full -z-10" /></motion.button>}</AnimatePresence>
        <div className="overflow-y-auto px-2 pt-10 pb-4 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{mode === 'login' ? '欢迎回来' : mode === 'register' ? '开启冒险' : '找回密码'}</h2>
                <p className="text-slate-500 text-[10px] font-bold mt-1 px-4 leading-relaxed">{mode === 'login' ? '进入 Momo 的单词西游世界' : mode === 'register' ? '创建一个新账号以保存进度' : '输入信息后点击右上角 [确认] 重置'}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={16} /></div><input type="text" placeholder="注册邮箱" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isProcessing} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-slate-700" /></div>
                {mode !== 'forgot' && <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={16} /></div><input type="password" placeholder={mode === 'login' ? '登录密码' : '设置密码'} value={password} onChange={(e) => setPassword(e.target.value)} disabled={isProcessing} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all text-slate-700" /></div>}
                <div className="flex gap-2">
                  <div className="relative flex-1"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><ShieldCheck size={16} /></div><input type="text" placeholder="验证码" maxLength={4} value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} disabled={isProcessing} className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 uppercase" /></div>
                  <div className="flex items-center justify-center bg-indigo-50 border border-indigo-100 rounded-2xl px-3 relative min-w-[80px] select-none"><span className="text-indigo-600 font-black italic tracking-widest text-base">{captchaCode}</span><button type="button" onClick={generateCaptcha} className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-sm text-indigo-400"><RefreshCw size={10} /></button></div>
                </div>
                {mode !== 'login' && <div className="flex gap-2"><div className="relative flex-1"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Send size={16} /></div><input type="text" placeholder="邮箱验证码" maxLength={4} value={emailCode} onChange={(e) => setEmailCode(e.target.value)} disabled={isProcessing} className="w-full pl-11 pr-3 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400" /></div><button type="button" onClick={handleSendEmailCode} disabled={isProcessing || countdown > 0} className={`min-w-[90px] rounded-2xl text-[9px] font-black ${countdown > 0 ? 'bg-slate-100 text-slate-400' : 'bg-indigo-500 text-white'}`}>{countdown > 0 ? `${countdown}s` : '获取验证码'}</button></div>}
                {mode === 'forgot' && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3.5"><div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><KeyRound size={16} /></div><input type="password" placeholder="新密码" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isProcessing} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400" /></div><div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><KeyRound size={16} /></div><input type="password" placeholder="再次输入密码" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isProcessing} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400" /></div></motion.div>}
                {error && <p className="text-red-500 text-[10px] font-bold text-center flex items-center justify-center gap-2 bg-red-50 py-2 rounded-lg"><AlertCircle size={14} /> {error}</p>}
                {mode !== 'forgot' && <button type="submit" disabled={isProcessing} className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-2xl shadow-lg shadow-pink-100 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2">{isProcessing ? <RefreshCw className="animate-spin" size={18} /> : ( <>{mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />} {mode === 'login' ? '立即登录' : '注册账号'}</> )}</button>}
              </form>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center justify-between px-2">
            <button onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')} disabled={isProcessing} className="text-[10px] font-bold text-indigo-500 underline underline-offset-4">{mode === 'login' ? '去注册' : '返回登录'}</button>
            {mode === 'login' && <button type="button" onClick={() => toggleMode('forgot')} disabled={isProcessing} className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><HelpCircle size={10} /> 找回密码</button>}
          </div>
        </div>
      </motion.div>
      <p className="mt-6 text-white/50 text-[9px] font-black tracking-widest uppercase">Momo's Adventure v1.3</p>
    </div>
  );
};

export default AuthScreen;

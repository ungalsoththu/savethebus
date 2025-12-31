
import React, { useState } from 'react';
import { GeneratedEmail } from '../types';
import { RECIPIENT_EMAIL } from '../constants';

interface Props {
  email: GeneratedEmail;
  onReset: () => void;
}

const EmailResult: React.FC<Props> = ({ email, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${RECIPIENT_EMAIL}\nSubject: ${email.subject}\n\n${email.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMail = () => {
    const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="bg-white rounded-3xl material-shadow overflow-hidden border border-emerald-100 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-emerald-600 px-8 py-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            <i className="fas fa-check-double"></i>
          </div>
          <div>
            <h3 className="text-xl font-black">Objection Ready!</h3>
            <p className="text-emerald-100 text-sm font-medium">Review, copy, or send immediately.</p>
          </div>
        </div>
        <button 
          onClick={onReset} 
          className="p-2 hover:bg-white/20 rounded-xl transition-all"
        >
          <i className="fas fa-rotate-left text-xl"></i>
        </button>
      </div>
      
      <div className="p-6 md:p-10 space-y-6">
        {email.isOptimized && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest inline-flex items-center">
            <i className="fas fa-sparkles mr-2"></i> AI Optimized & Polished
          </div>
        )}

        <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 text-sm md:text-base">
          <div className="flex flex-col gap-2 mb-6 border-b border-slate-200 pb-4">
            <p><span className="font-black text-slate-400 uppercase text-[10px] tracking-widest mr-4">Recipient</span> <span className="font-bold text-slate-700">{RECIPIENT_EMAIL}</span></p>
            <p><span className="font-black text-slate-400 uppercase text-[10px] tracking-widest mr-4">Subject</span> <span className="font-bold text-slate-900">{email.subject}</span></p>
          </div>
          <div className="whitespace-pre-wrap text-slate-800 leading-relaxed font-serif text-lg bg-white p-6 rounded-xl shadow-inner border border-slate-100 h-80 overflow-y-auto custom-scrollbar">
            {email.body}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleCopy}
            className={`py-5 rounded-2xl font-black flex items-center justify-center transition-all border-2 text-xl ${
              copied ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md'
            }`}
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-2`}></i>
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          
          <button
            onClick={handleSendMail}
            className="py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl flex items-center justify-center transition-all transform hover:-translate-y-1 active:translate-y-0 text-xl"
          >
            <i className="fas fa-envelope-open-text mr-2"></i>
            Open Mail App
          </button>
        </div>
        
        <div className="bg-slate-100 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
            <i className="fas fa-paper-plane"></i>
          </div>
          <div>
            <p className="text-sm text-slate-600 font-bold mb-1">How to submit?</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clicking 'Open Mail App' will pre-fill the letter. If it doesn't work, manually copy and email to <span className="font-bold text-slate-900">{RECIPIENT_EMAIL}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailResult;

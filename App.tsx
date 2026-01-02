
import React, { useState, useEffect } from 'react';
import ObjectionForm from './components/ObjectionForm';
import EmailResult from './components/EmailResult';
import { GeneratedEmail, Language } from './types';
import { AMENDMENT_DETAILS, RECIPIENT_ADDRESS, TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [view, setView] = useState<'action' | 'knowledge'>('action');
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const deadline = new Date('2026-01-07');
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  const KnowledgeView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex items-center">
        <button 
          onClick={() => { setView('action'); window.scrollTo(0, 0); }}
          className="p-4 bg-white shadow-md rounded-2xl text-blue-600 font-black flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
          aria-label="Back to home"
        >
          <i className="fas fa-arrow-left"></i> {t.backBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* De Facto Ban Callout */}
        <section className="col-span-1 md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="fas fa-file-invoice-dollar text-9xl"></i>
          </div>
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              {lang === 'en' ? 'The De Facto Procurement Bar' : 'மறைமுக கொள்முதல் தடை'}
            </h3>
            <p className="text-xl md:text-2xl font-medium text-slate-300 leading-relaxed mb-8">
              {lang === 'en' 
                ? "By enabling hiring for regular operations, Rule 288-A allows officials to cite 'economy' to skip bus purchases. This creates a state of permanent dependency on private owners."
                : "வழக்கமான செயல்பாடுகளுக்கே வாடகை முறையைப் பயன்படுத்த அனுமதிப்பதன் மூலம், விதி 288-A அரசு புதிய பேருந்துகளை வாங்குவதை மறைமுகமாகத் தடுக்கிறது. இது தனியார் நிறுவனங்களைச் சார்ந்திருக்க நம்மைத் தள்ளும்."}
            </p>
            <div className="inline-flex items-center bg-blue-600 px-6 py-3 rounded-2xl font-black shadow-lg">
              {lang === 'en' ? 'DEMAND STATE-OWNED FLEET' : 'அரசு பேருந்துகளை அரசே வாங்கக் கோருவோம்'}
            </div>
          </div>
        </section>

        {/* Vidiyal Payanam Alert */}
        <section className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-8 shadow-xl text-white flex flex-col h-full relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-4 opacity-10">
            <i className="fas fa-female text-[10rem] translate-y-10"></i>
          </div>
          <h3 className="text-2xl font-black mb-6 flex items-center">
            <span className="p-3 bg-white/20 rounded-2xl mr-4"><i className="fas fa-exclamation-triangle"></i></span>
            {t.vidiyalTitle}
          </h3>
          <p className="text-rose-50 text-lg leading-relaxed mb-6 font-medium relative z-10">
            {lang === 'en' 
              ? "Existing GCC buses in Chennai are only AC/Electric/Low-floor and ALREADY exclude women from Vidiyal Payanam. Rule 288-A will extend this profit-first model statewide, ending free travel for millions."
                : "சென்னையில் தற்போதுள்ள GCC ஏசி/எலக்ட்ரிக் பேருந்துகளில் பெண்களுக்கு இலவசப் பயணம் கிடையாது. விதி 288-A இந்த 'லாப நோக்கு' முறையை மாநிலம் முழுவதும் கொண்டு வந்து, பெண்களுக்கு வழங்கப்படும் இலவசப் பயண உரிமையைப் பறிக்கும்."}
          </p>
          <div className="bg-black/20 p-5 rounded-2xl text-white text-sm font-bold border border-white/10 backdrop-blur-sm relative z-10">
            {lang === 'en' ? 'PRIVATE PROFIT vs PUBLIC SERVICE' : 'தனியார் லாபம் vs மக்கள் சேவை'}
          </div>
        </section>

        {/* Short-term Economy Critique */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col h-full">
          <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center">
            <span className="p-3 bg-slate-100 rounded-2xl mr-4 text-blue-600"><i className="fas fa-chart-line"></i></span>
            {lang === 'en' ? 'The "Economy" Trap' : '"சிக்கனம்" என்ற பொறி'}
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium grow">
            {lang === 'en' 
              ? "Hiring might seem 'economical' for 500 buses in the short term, but for 20,000 buses in the long term, state ownership is the only sustainable model. Abandoning procurement is a failure of vision."
              : "500 பேருந்துகளை வாடகைக்கு எடுப்பது குறுகிய காலத்தில் 'சிக்கனமாக'த் தெரியலாம். ஆனால் 20,000 பேருந்துகளைக் கொண்ட ஒரு பெரும் அமைப்பிற்கு, அரசு உரிமையே சிறந்த முறையாகும்."}
          </p>
          <div className="flex items-center gap-3 text-rose-600 font-black uppercase text-sm tracking-widest">
            <i className="fas fa-arrow-down"></i>
            {lang === 'en' ? 'End the De Facto Procurement Bar' : 'மறைமுக கொள்முதல் தடையை நிறுத்து'}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 col-span-1 md:col-span-2">
          <h3 className="text-3xl font-black text-slate-800 mb-10 flex items-center">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl mr-4"><i className="fas fa-history"></i></span>
            {t.historyTitle}
          </h3>
          
          <div className="space-y-12 relative before:content-[''] before:absolute before:left-4 md:before:left-6 before:top-2 before:bottom-2 before:w-1 before:bg-slate-100">
            <div className="relative pl-10 md:pl-16">
              <div className="absolute left-1.5 md:left-3.5 top-1.5 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
              <h4 className="font-black text-blue-900 text-2xl">{t.history1972}</h4>
              <p className="text-slate-600 text-lg mt-3 leading-relaxed">{t.history1972Desc}</p>
            </div>
            
            <div className="relative pl-10 md:pl-16">
              <div className="absolute left-1.5 md:left-3.5 top-1.5 w-6 h-6 bg-blue-400 rounded-full border-4 border-white shadow-lg z-10"></div>
              <h4 className="font-black text-blue-800 text-xl">{t.history2020}</h4>
              <p className="text-slate-600 text-lg mt-3 leading-relaxed">{t.history2020Desc}</p>
            </div>

            <div className="relative pl-10 md:pl-16">
              <div className="absolute left-1.5 md:left-3.5 top-1.5 w-6 h-6 bg-rose-600 rounded-full border-4 border-white shadow-lg z-10"></div>
              <h4 className="font-black text-rose-900 text-2xl">{lang === 'en' ? '2025: The Skip Strategy' : '2025: கொள்முதல் தவிர்ப்பு'}</h4>
              <p className="text-slate-600 text-lg mt-3 font-semibold leading-relaxed">
                {lang === 'en' 
                  ? "Rule 288-A allows STUs to skip purchasing and instead hire for all needs. This is a quiet dismantling of the state's transport infrastructure."
                  : "விதி 288-A மூலம் அரசு புதிய பேருந்துகள் வாங்குவதைத் தவிர்த்து, அனைத்திற்கும் வாடகை முறையை நாடுகிறது. இது நமது பொதுப் போக்குவரத்து கட்டமைப்பைச் சிதைக்கும் செயலாகும்."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center pt-10">
        <button 
          onClick={() => { setView('action'); window.scrollTo(0,0); }}
          className="px-12 py-6 bg-blue-600 text-white font-black rounded-3xl shadow-2xl hover:bg-blue-700 transform hover:scale-105 transition-all text-2xl flex items-center gap-4 mx-auto"
        >
          {t.actionBtn}
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:py-6 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto"></div>
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 p-1.5 rounded-3xl flex items-center gap-1.5 pointer-events-auto material-shadow">
          <button 
            onClick={() => setLang('en')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg translate-y-[-1px]' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('ta')}
            className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${lang === 'ta' ? 'bg-blue-600 text-white shadow-lg translate-y-[-1px]' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            தமிழ்
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className={`gradient-bg text-white transition-all duration-1000 ${view === 'action' ? 'pt-24 pb-40 md:pb-56' : 'pt-20 pb-20'} px-4 overflow-hidden relative shadow-2xl`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden">
          <i className="fas fa-bus text-[40rem] rotate-[-15deg]"></i>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block bg-yellow-400 text-blue-950 px-6 py-2 rounded-full font-black text-sm md:text-base mb-10 shadow-xl animate-bounce tracking-tight">
            <i className="fas fa-exclamation-circle mr-2"></i> {t.urgentTag}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-10 leading-[0.95] tracking-tighter">
            {t.heroTitle} <br/>
            <span className="text-yellow-400/90 text-[0.8em]">{t.heroSubtitle}</span>
          </h1>
          
          {view === 'action' && (
            <>
              <p className="text-xl md:text-3xl text-blue-100 max-w-3xl mx-auto mb-14 leading-relaxed px-6 font-medium opacity-90">
                {t.heroDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 px-6">
                <a href="#action-form" className="px-12 py-6 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-black rounded-3xl shadow-2xl transition-all flex items-center justify-center transform hover:-translate-y-2 active:scale-95 text-xl tracking-tight">
                  {t.actionBtn}
                  <i className="fas fa-bolt-lightning ml-3"></i>
                </a>
                <button 
                  onClick={() => { setView('knowledge'); window.scrollTo(0, 0); }}
                  className="px-12 py-6 bg-white/10 hover:bg-white/20 text-white font-black rounded-3xl border-2 border-white/20 backdrop-blur-md transition-all flex items-center justify-center transform hover:-translate-y-2 active:scale-95 text-xl tracking-tight"
                >
                  {t.learnMoreBtn}
                  <i className="fas fa-chevron-right ml-3"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 -mt-24 md:-mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-8 space-y-10">
            {view === 'action' ? (
              <div className="space-y-10">
                {!generatedEmail ? (
                  <ObjectionForm language={lang} onSuccess={setGeneratedEmail} />
                ) : (
                  <EmailResult email={generatedEmail} onReset={() => setGeneratedEmail(null)} />
                )}
                
                <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000"></div>
                  <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight relative z-10">
                    {lang === 'en' ? 'State Ownership is a Social Promise' : 'அரசு உரிமை என்பது ஒரு சமூக வாக்குறுதி'}
                  </h3>
                  <p className="text-blue-200 text-lg md:text-xl font-medium max-w-2xl mx-auto relative z-10">
                    {lang === 'en' 
                      ? 'When the state skips bus procurement, it abandons the common citizen. Demand the withdrawal of the Rule 288-A hire/lease mandate.'
                      : 'அரசு பேருந்துகளை வாங்குவதைத் தவிர்க்கும் போது, அது சாமானிய மக்களைக் கைவிடுகிறது. விதி 288-A வாடகை முறையைத் திரும்பப் பெறக் கோருவோம்.'}
                  </p>
                </div>
              </div>
            ) : (
              <KnowledgeView />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 pb-20">
            <div className="bg-blue-900 text-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-800 transition-all hover:shadow-blue-500/20">
              <h4 className="text-xs font-black mb-8 flex items-center uppercase tracking-[0.3em] text-blue-400">
                <i className="fas fa-hourglass-start mr-3"></i>
                {t.clockTitle}
              </h4>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="text-7xl md:text-8xl font-black tracking-tighter text-yellow-400 tabular-nums">
                  {daysLeft}
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black uppercase tracking-widest leading-none">Days</span>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">{t.daysRemaining}</span>
                </div>
              </div>
              
              <div className="w-full bg-slate-950/50 rounded-full h-5 mb-10 p-1.5 border border-white/10 shadow-inner overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                  style={{ width: `${(daysLeft / 30) * 100}%` }}
                ></div>
              </div>
              
              <div className="space-y-6 text-sm">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-blue-300 font-bold uppercase tracking-wider text-[10px]">{t.published}</span>
                  <span className="font-black">{AMENDMENT_DETAILS.notificationDate}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-400 text-blue-950 rounded-2xl shadow-lg">
                  <span className="font-black uppercase tracking-wider text-[10px]">{t.deadline}</span>
                  <span className="font-black">{AMENDMENT_DETAILS.deadline}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
              <h4 className="text-xs font-black mb-6 uppercase tracking-[0.3em] text-slate-400">{t.mailAddress}</h4>
              <p className="text-lg text-slate-700 leading-relaxed font-bold">
                {RECIPIENT_ADDRESS}
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-4 border-blue-600">
              <h4 className="font-black text-2xl mb-4 text-slate-900">{t.shareTitle}</h4>
              <p className="text-slate-600 mb-10 font-medium leading-relaxed">{t.shareDesc}</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(lang === 'en' ? '🚨 Help save our public buses! Stop privatization. Send an objection to TN Govt now: ' : '🚨 நமது அரசு பேருந்துகளைக் காப்போம்! தமிழக அரசிற்கு உங்கள் எதிர்ப்பை இப்போதே தெரிவியுங்கள்: ') + window.location.href}`, '_blank')}
                  className="py-5 bg-[#25D366] hover:bg-[#20bd5c] text-white rounded-[1.5rem] font-black flex items-center justify-center transition-all active:scale-95 shadow-lg text-xl"
                  aria-label="Share on WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(lang === 'en' ? 'Stop privatization of TN bus routes! Ithu Ungal Soththu. #SaveOurBusesTN #SaveTheBus #Rule288A' : 'தமிழக அரசு பேருந்து வழித்தடங்களை தனியார்மயமாக்காதே! இது உங்கள் சொத்து. #SaveOurBusesTN #SaveTheBus #Rule288A')}&url=${window.location.href}`, '_blank')}
                  className="py-5 bg-black hover:bg-slate-900 text-white rounded-[1.5rem] font-black flex items-center justify-center transition-all active:scale-95 shadow-lg text-xl"
                  aria-label="Share on X (Twitter)"
                >
                  <i className="fab fa-x-twitter"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="mt-32 bg-slate-900 text-slate-400 py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12 text-center relative z-10">
          <div className="text-white text-3xl md:text-5xl font-black tracking-tighter">
            {t.campaignName}
          </div>
          <p className="text-lg font-medium max-w-2xl mx-auto leading-relaxed opacity-60">
            {lang === 'en' 
              ? 'Public transit belongs to the people. Rule 288-A and its de facto procurement bar is an encroachment on public rights.' 
              : 'பொதுப் போக்குவரத்து மக்களுக்குச் சொந்தமானது. விதி 288-A மற்றும் அதன் கொள்முதல் தவிர்ப்பு என்பது பொது உரிமையின் மீதான அத்துமீறல்.'}
          </p>
          <div className="flex justify-center gap-10 text-3xl">
            <a href="https://github.com/UngalSoththu/savethebus" target="_blank" className="hover:text-blue-400 transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><i className="fas fa-solid fa-bus-simple"></i></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><i className="fas fa-universal-access"></i></a>
            <a href="https://x.com/ungalsoththu" className="hover:text-blue-400 transition-colors"><i className="fas fa-brands fa-x-twitter"></i></a>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-600">🄯 - Ungal Soththu</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      </footer>
    </div>
  );
};

export default App;

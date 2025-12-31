
import React, { useState } from 'react';
import { ObjectionTone, ObjectionData, GeneratedEmail, Language, GenerationMode } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateObjectionEmail } from '../services/aiService';
import { BACKUP_TEMPLATES } from '../backupTemplates';

interface Props {
  language: Language;
  onSuccess: (email: GeneratedEmail) => void;
}

const ObjectionForm: React.FC<Props> = ({ language, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[language];
  
  const [formData, setFormData] = useState<ObjectionData>({
    name: '',
    location: '',
    tone: ObjectionTone.FIRM,
    concerns: [],
    language: language,
    mode: GenerationMode.AUTO,
    customText: ''
  });

  React.useEffect(() => {
    setFormData(prev => ({ ...prev, language }));
  }, [language]);

  const handleToggleConcern = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const handlePreFill = (templateId: string) => {
    const template = BACKUP_TEMPLATES[language][templateId];
    if (template) {
      setFormData(p => ({ ...p, customText: template.body }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      alert(language === 'en' ? "Please fill in your name and location." : "தயவுசெய்து உங்கள் பெயர் மற்றும் இடத்தை நிரப்பவும்.");
      return;
    }

    if (formData.mode === GenerationMode.AUTO && formData.concerns.length === 0) {
      alert(language === 'en' ? "Please select at least one concern." : "குறைந்தது ஒரு கவலையைத் தேர்ந்தெடுக்கவும்.");
      return;
    }

    if (formData.mode === GenerationMode.MANUAL && !formData.customText?.trim()) {
      alert(language === 'en' ? "Please write your own objection text or use a template." : "உங்கள் சொந்த ஆட்சேபனை கருத்தை எழுதவும் அல்லது மாதிரியைத் தேர்வு செய்யவும்.");
      return;
    }
    
    setLoading(true);
    try {
      const email = await generateObjectionEmail(formData);
      onSuccess(email);
    } catch (error) {
      alert(language === 'en' ? "Something went wrong. Please try again." : "ஏதோ தவறு நடந்துவிட்டது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="action-form" className="bg-white rounded-3xl material-shadow p-6 md:p-10 border border-slate-100 transition-all">
      <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 flex items-center">
        <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl mr-4">
          <i className="fas fa-bullhorn"></i>
        </span>
        {t.formTitle}
      </h2>

      {/* Mode Selection Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setFormData(p => ({ ...p, mode: GenerationMode.AUTO }))}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all ${formData.mode === GenerationMode.AUTO ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {t.modeAuto}
        </button>
        <button
          type="button"
          onClick={() => setFormData(p => ({ ...p, mode: GenerationMode.MANUAL }))}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all ${formData.mode === GenerationMode.MANUAL ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {t.modeManual}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="name">
              {t.fullName}
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. S. Kumar"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="location">
              {t.location}
            </label>
            <input
              id="location"
              type="text"
              required
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Madurai"
            />
          </div>
        </div>

        {formData.mode === GenerationMode.AUTO ? (
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t.concernsLabel}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.concernOptions.map((concern, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleConcern(concern)}
                  className={`text-left px-5 py-3 rounded-2xl text-sm border-2 transition-all flex items-center gap-3 ${
                    formData.concerns.includes(concern)
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg font-bold translate-y-[-2px]'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <i className={`fas ${formData.concerns.includes(concern) ? 'fa-check-circle' : 'fa-circle-notch text-slate-200'} text-lg`}></i>
                  {concern}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
                {t.templateLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {t.templateOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePreFill(opt.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-blue-200"
                  >
                    <i className="fas fa-file-lines mr-1.5 opacity-60"></i>
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="customText">
                {t.customTextLabel}
              </label>
              <textarea
                id="customText"
                rows={6}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium resize-none custom-scrollbar"
                placeholder={t.customTextPlaceholder}
                value={formData.customText}
                onChange={e => setFormData(p => ({ ...p, customText: e.target.value }))}
              />
              <p className="text-xs text-slate-400 italic">
                <i className="fas fa-magic mr-1"></i> {t.optimizeBtn}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1" htmlFor="tone">{t.toneLabel}</label>
          <div className="relative">
            <select
              id="tone"
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all text-lg font-medium appearance-none cursor-pointer"
              value={formData.tone}
              onChange={e => setFormData(prev => ({ ...prev, tone: e.target.value as ObjectionTone }))}
            >
              {Object.values(ObjectionTone).map(tone => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
            <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black rounded-2xl shadow-xl transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-2xl tracking-tight"
        >
          {loading ? (
            <>
              <i className="fas fa-circle-notch fa-spin mr-3"></i>
              {t.loadingBtn}
            </>
          ) : (
            <>
              <i className={`fas ${formData.mode === GenerationMode.MANUAL ? 'fa-wand-magic-sparkles' : 'fa-feather-pointed'} mr-3`}></i>
              {formData.mode === GenerationMode.MANUAL ? t.optimizeBtn : t.submitBtn}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ObjectionForm;

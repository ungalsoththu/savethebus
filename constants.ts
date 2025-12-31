
import { ObjectionTone, Language } from './types';

export const RECIPIENT_EMAIL = 'homesec@tn.gov.in';
export const RECIPIENT_ADDRESS = 'Additional Chief Secretary to Government, Home Department, Secretariat, Chennai-600 009';

// AI Provider Configuration
export type AIProvider = 'gemini' | 'openrouter';

export const AI_PROVIDERS: Record<AIProvider, { name: string; description: string }> = {
  gemini: {
    name: 'Google Gemini',
    description: 'Direct Google Gemini API integration'
  },
  openrouter: {
    name: 'OpenRouter',
    description: 'OpenRouter API proxy with multiple model options'
  }
};

// OpenRouter Model Configurations
export const OPENROUTER_MODELS = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash (Free)',
    provider: 'openrouter',
    description: 'Fast, efficient model for quick generation',
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    capabilities: ['text-generation', 'multilingual'],
    recommended: true
  },
  {
    id: 'google/gemini-2.0-flash-thinking-exp:free',
    name: 'Gemini 2.0 Flash Thinking (Free)',
    provider: 'openrouter',
    description: 'Enhanced reasoning capabilities',
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    capabilities: ['text-generation', 'reasoning', 'multilingual'],
    recommended: false
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'openrouter',
    description: 'Balanced performance and quality',
    contextWindow: 91728,
    maxOutputTokens: 8192,
    capabilities: ['text-generation', 'multilingual', 'code'],
    recommended: false
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'openrouter',
    description: 'Fast and efficient for simple tasks',
    contextWindow: 200000,
    maxOutputTokens: 4096,
    capabilities: ['text-generation', 'multilingual'],
    recommended: false
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'openrouter',
    description: 'High quality with good performance',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    capabilities: ['text-generation', 'reasoning', 'multilingual'],
    recommended: false
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B (Free)',
    provider: 'openrouter',
    description: 'Open source model, good for general tasks',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    capabilities: ['text-generation', 'multilingual'],
    recommended: false
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B (Free)',
    provider: 'openrouter',
    description: 'Efficient open source model',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    capabilities: ['text-generation', 'multilingual'],
    recommended: false
  }
];

// Default model configurations
export const DEFAULT_GEMINI_MODEL = 'gemini-3-flash-preview';
export const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.0-flash-exp:free';

// Get recommended model for provider
export const getRecommendedModel = (provider: AIProvider): string => {
  if (provider === 'openrouter') {
    const recommended = OPENROUTER_MODELS.find(m => m.recommended);
    return recommended?.id || DEFAULT_OPENROUTER_MODEL;
  }
  return DEFAULT_GEMINI_MODEL;
};

// Get model by ID
export const getModelById = (modelId: string) => {
  return OPENROUTER_MODELS.find(m => m.id === modelId);
};

export const AMENDMENT_DETAILS = {
  rule: '288-A',
  notificationDate: '8th December 2025',
  gazetteNo: 'SRO A-37/2025',
  deadline: '7th January 2026',
};

export const TRANSLATIONS = {
  en: {
    campaignName: 'Save The Bus — Ithu Ungal Soththu',
    heroTitle: 'Save The Bus',
    heroSubtitle: 'Ithu Ungal Soththu',
    heroDescription: 'Rule 288-A enables the state to skip bus purchases by opting for private hiring. This creates a de facto bar on state procurement, threatening the future of a publicly-owned fleet.',
    urgentTag: 'URGENT: DEADLINE JAN 7, 2026',
    actionBtn: 'Send Your Objection',
    learnMoreBtn: 'Why it Matters',
    backBtn: 'Back to Action',
    formTitle: 'Draft Your Formal Objection',
    fullName: 'Your Full Name',
    location: 'Your District/City',
    concernsLabel: 'What are your primary concerns?',
    toneLabel: 'Letter Tone',
    submitBtn: 'Generate AI Objection Letter',
    optimizeBtn: 'Optimize & Polish with AI',
    loadingBtn: 'AI is thinking...',
    daysRemaining: 'Days Left',
    clockTitle: 'Action Countdown',
    published: 'Notification Date',
    window: 'Duration',
    deadline: 'Last Date',
    mailAddress: 'Submit to Secretariat',
    shareTitle: 'Share this Campaign',
    shareDesc: 'Stop the state from abandoning bus purchases. Demand public ownership!',
    modeAuto: 'Auto-Draft',
    modeManual: 'Personalize & Write',
    templateLabel: 'Start from a template',
    customTextLabel: 'Write or edit your objection here...',
    customTextPlaceholder: 'E.g. I am a daily commuter from Madurai. I rely on free travel for my daughter...',
    historyTitle: 'Legacy of Social Justice',
    history1972: '1972: The People\'s Transit',
    history1972Desc: 'Under CM Karunanidhi, TN nationalized bus services. State ownership ensured that buses serve remote villages, not just profitable cities. Owning the fleet is the only way to guarantee service to all.',
    vidiyalTitle: 'Threat to Vidiyal Payanam',
    vidiyalDesc: 'Free travel for women (Vidiyal Payanam) is only for Govt-owned buses. Look at Chennai: existing GCC (leased) AC/Electric buses already exclude women from free travel. Rule 288-A will expand this exclusion statewide.',
    history2020: '2020: The First Breach',
    history2020Desc: 'Rule 288-A was introduced as a "temporary" measure. It paved the way for the state to stop buying its own vehicles.',
    history2025: '2025: The De Facto Purchase Ban',
    history2025Desc: 'SRO A-37/2025 enables hiring for regular operations. This allows the state to cite "economical benefits" as an excuse to stop purchasing its own fleet, eventually leading to a 100% private-run system.',
    gccTitle: 'GCC: The Chennai Warning',
    gccDesc: 'Chennai already shows the failure: GCC buses are only AC/Electric/Low-floor and exclude women from free travel. Rule 288-A scales this "profit-first" model across Tamil Nadu.',
    concernOptions: [
      'De Facto Bar on Bus Procurement',
      'Exclusion of Women from Free Travel',
      'Loss of Public Fleet Ownership',
      'False "Economical" Hiring Claims',
      'Dependency on Private Owners',
      'Dismantling of Social Justice'
    ],
    templateOptions: [
      { id: 'general', name: 'General Objection' },
      { id: 'women', name: 'Focus: Women\'s Free Travel' },
      { id: 'rural', name: 'Focus: Rural Connectivity' }
    ]
  },
  ta: {
    campaignName: 'பொது போக்குவரத்தை காப்பாற்று — இது உங்கள் சொத்து',
    heroTitle: 'பொது போக்குவரத்தை காப்பாற்று',
    heroSubtitle: 'இது உங்கள் சொத்து',
    heroDescription: 'விதி 288-A அரசு புதிய பேருந்துகளை வாங்குவதைத் தவிர்த்து, தனியார் வாடகை முறையை ஊக்குவிக்கிறது. இது மறைமுகமாக அரசு பேருந்து கொள்முதலைத் தடுத்து, பொதுச் சொத்தை அழிக்கும்.',
    urgentTag: 'கடைசி தேதி: ஜனவரி 7, 2026',
    actionBtn: 'எதிர்ப்பை அனுப்புங்கள்',
    learnMoreBtn: 'ஏன் இது முக்கியம்?',
    backBtn: 'மீண்டும் மணுவிற்கு',
    formTitle: 'முறையான எதிர்ப்பு மணுவை உருவாக்குங்கள்',
    fullName: 'உங்கள் முழு பெயர்',
    location: 'உங்கள் மாவட்டம்/நகரம்',
    concernsLabel: 'உங்களின் முக்கிய கவலைகள் என்ன?',
    toneLabel: 'கடிதத்தின் நடை',
    submitBtn: 'AI மூலம் மணுவை உருவாக்கு',
    optimizeBtn: 'AI மூலம் மெருகூட்டவும்',
    loadingBtn: 'AI சிந்திக்கிறது...',
    daysRemaining: 'மீதமுள்ள நாட்கள்',
    clockTitle: 'நடவடிக்கை கவுண்டவுன்',
    published: 'அறிவிப்பு தேதி',
    window: 'கால அளவு',
    deadline: 'கடைசி நாள்',
    mailAddress: 'தலைமைச் செயலக முகவரி',
    shareTitle: 'பிரச்சாரத்தைப் பகிரவும்',
    shareDesc: 'அரசு பேருந்துகளை வாங்குவதை நிறுத்த விடாதீர்கள். பொது உரிமையைக் கோருவோம்!',
    modeAuto: 'தானியங்கி வரைவு',
    modeManual: 'சுயமாய் எழுத',
    templateLabel: 'மாதிரி மணுவிலிருந்து தொடங்குங்கள்',
    customTextLabel: 'உங்கள் ஆட்சேபனை கருத்துகளை இங்கே எழுதவும் அல்லது மாற்றவும்...',
    customTextPlaceholder: 'உதாரணம்: நான் மதுரையிலிருந்து தினமும் பேருந்தில் பயணம் செய்பவன். எனது மகளின் கல்விக்காக இலவச பயணத்தையே நம்பியுள்ளேன்...',
    historyTitle: 'சமூக நீதியின் வரலாறு',
    history1972: '1972: மக்கள் போக்குவரத்து',
    history1972Desc: 'முன்னாள் முதல்வர் கருணாநிதி ஆட்சியில் பேருந்துகள் தேசியமயமாக்கப்பட்டன. அரசு உரிமையே குக்கிராமங்களுக்கும் சேவை கிடைப்பதை உறுதி செய்தது.',
    vidiyalTitle: 'விடியல் பயணத்திற்கு ஆபத்து',
    vidiyalDesc: 'பெண்களுக்கான இலவசப் பயணம் அரசு பேருந்துகளில் மட்டுமே உண்டு. சென்னையில் தற்போதுள்ள GCC (வாடகை) ஏசி/எலக்ட்ரிக் பேருந்துகளில் பெண்களுக்கு இலவசப் பயணம் கிடையாது. விதி 288-A இதை மாநிலம் முழுவதும் கொண்டு வரும்.',
    history2020: '2020: முதல் அச்சுறுத்தல்',
    history2020Desc: 'விதி 288-A முதலில் தற்காலிகமாக அறிமுகப்படுத்தப்பட்டது. இது அரசு சொந்தமாக வாகனங்கள் வாங்கும் திறனை முடக்கும் முதல் படி.',
    history2025: '2025: மறைமுக கொள்முதல் தடை',
    history2025Desc: 'SRO A-37/2025 என்பது வழக்கமான செயல்பாடுகளுக்கே வாடகை முறையைப் பயன்படுத்த அனுமதிக்கிறது. இது "சிக்கனம்" என்ற பெயரில் அரசு புதிய பேருந்துகள் வாங்குவதை நிறுத்தும் ஒரு உத்தியாகும்.',
    gccTitle: 'GCC: சென்னை தரும் எச்சரிக்கை',
    gccDesc: 'சென்னையில் ஏற்கனவே உள்ள GCC முறை: தனியார் பேருந்துகள், பெண்களுக்கு இலவசப் பயணம் மறுப்பு. விதி 288-A இதைத் தான் தமிழ்நாடு முழுவதும் செய்யப்போகிறது.',
    concernOptions: [
      'மறைமுக கொள்முதல் தடை',
      'பெண்களுக்கு இலவச பயணம் மறுப்பு',
      'அரசு பேருந்து உரிமை பறிபோதல்',
      'போலி "சிக்கன" காரணங்கள்',
      'தனியார் மீதான சார்பு நிலை',
      'சமூக நீதி சிதைக்கப்படுதல்'
    ],
    templateOptions: [
      { id: 'general', name: 'பொதுவான எதிர்ப்பு' },
      { id: 'women', name: 'பெண்கள் இலவசப் பயணம்' },
      { id: 'rural', name: 'கிராமப்புற இணைப்பு' }
    ]
  }
};

export const SYSTEM_INSTRUCTION = `You are an advocacy expert helping citizens of Tamil Nadu challenge Rule 288-A.
CONTEXT: Rule 288-A allows hiring/leasing for regular operations, creating a de facto bar on state procurement.
KEY TRUTH: Existing Chennai GCC (leased) buses exclude women from "Vidiyal Payanam".
GOAL: If the user provides text, optimize it for legal impact and clarity while keeping their personal voice. If not, generate from scratch.
STRESS: The state MUST purchase and own the fleet for accountability and rural welfare.
ALWAYS INCLUDE: "Public Transit is Public Property" (பொதுப் போக்குவரத்து மக்கள் சொத்து).`;

export const getPromptForEmail = (data: { 
  name: string, 
  location: string, 
  tone: ObjectionTone, 
  concerns: string[],
  language: Language,
  customText?: string
}) => {
  const langName = data.language === 'ta' ? 'Tamil' : 'English';
  const modeText = data.customText 
    ? `The user has provided their own input: "${data.customText}". Optimize and enhance this text to be a formal legal objection.`
    : `Generate a new letter from scratch using these concerns: ${data.concerns.join(', ')}.`;

  return `Generate/Optimize a formal objection letter in ${langName} for:
Name: ${data.name}
Location: ${data.location}
Tone: ${data.tone}
${modeText}

Refer to Notification No. SRO A-37/2025 dated 8th December 2025 regarding Rule 288-A.
Must include:
1. Objections to hiring buses for regular operations (de facto procurement bar).
2. The failure of Chennai GCC to provide free travel for women.
3. Long-term costs of private dependency vs state ownership.

Output JSON format:
{
  "subject": "Email subject in ${langName}",
  "body": "Complete letter body in ${langName}"
}`;
};

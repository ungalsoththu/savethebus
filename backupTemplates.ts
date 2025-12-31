
import { Language } from './types';

export const BACKUP_TEMPLATES: Record<Language, Record<string, { subject: string; body: string }>> = {
  en: {
    general: {
      subject: "Objection to Rule 288-A - Demand for State-Owned Fleet Procurement",
      body: `To,
The Additional Chief Secretary to Government,
Home Department, Secretariat, Chennai-600 009.

Ref: Notification No. SRO A-37/2025 dated 8th December 2025 regarding Rule 288-A.

I formally object to the proposed amendment of Rule 288-A. Enabling hiring for regular operations creates a de facto bar on new bus procurement. Public transport must be a state-owned social service. Private leasing models lead to dependency and dismantle the legacy of social justice. 

Demand the state rescind this amendment. "Public Transit is Public Property" (பொதுப் போக்குவரத்து மக்கள் சொத்து).`
    },
    women: {
      subject: "Objection to Rule 288-A - Protecting Women's Free Travel Rights",
      body: `To,
The Additional Chief Secretary, Home Dept, Secretariat.

Rule 288-A allows hiring/leasing for regular bus operations. Chennai's existing GCC (leased) buses already deny women the Vidiyal Payanam free travel. Expanding this model statewide will end free mobility for millions of women. I demand the Govt continue purchasing state-owned buses to protect our welfare schemes.`
    },
    rural: {
      subject: "Objection to Rule 288-A - Ensuring Rural Connectivity",
      body: `To,
The Additional Chief Secretary, Home Dept, Secretariat.

Private leased buses under Rule 288-A will only focus on profitable routes. Only a state-owned fleet ensures buses reach remote villages. I object to any rule that creates a de facto bar on state procurement of new buses.`
    }
  },
  ta: {
    general: {
      subject: "விதி 288-A திருத்தத்திற்கு எதிர்ப்பு - அரசுப் பேருந்துகள் கொள்முதல் செய்யக் கோரிக்கை",
      body: `பெறுநர்,
கூடுதல் தலைமைச் செயலாளர்,
உள்துறை, தலைமைச் செயலகம், சென்னை-600 009.

விதி 288-A திருத்தம் அரசுப் பேருந்துகளை வாங்குவதைத் தவிர்த்து, தனியார் வாடகை முறையை ஊக்குவிக்கிறது. இது மறைமுகமாக அரசுப் பேருந்து கொள்முதலை முடக்கும் செயலாகும். பொதுப் போக்குவரத்து என்பது மக்களின் சொத்து. அதைத் தனியார் லாபத்திற்காகக் கைவிடுவது சமூக நீதிக்கு எதிரானது. "பொதுப் போக்குவரத்து மக்கள் சொத்து".`
    },
    women: {
      subject: "விதி 288-A எதிர்ப்பு - பெண்களின் இலவசப் பயண உரிமையைப் பாதுகாக்கக் கோரிக்கை",
      body: `சென்னையில் ஏற்கனவே உள்ள வாடகை (GCC) பேருந்துகளில் பெண்களுக்கு இலவசப் பயணம் (விடியல் பயணம்) கிடையாது. விதி 288-A இந்த முறையை மாநிலம் முழுவதும் கொண்டு வருவது பெண்களின் பயண உரிமையைப் பறிக்கும். எனவே அரசு தனது சொந்தப் பேருந்துகளை வாங்கி இயக்க வேண்டும்.`
    },
    rural: {
      subject: "விதி 288-A எதிர்ப்பு - கிராமப்புற பேருந்து சேவையை உறுதி செய்யக் கோரிக்கை",
      body: `தனியார் வாடகை பேருந்துகள் லாபம் உள்ள வழித்தடங்களில் மட்டுமே இயங்கும். அரசுக்குச் சொந்தமான பேருந்துகள் மட்டுமே குக்கிராமங்களுக்குச் சேவையை உறுதி செய்யும். விதி 288-A மூலம் அரசு பேருந்து வாங்குவதைத் தவிர்ப்பது கிராமப்புற மக்களைப் பாதிக்கும்.`
    }
  }
};

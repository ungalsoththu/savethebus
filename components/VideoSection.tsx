import React, { useState, useRef } from 'react';

interface VideoSectionProps {
  englishVideoId: string;
  tamilVideoId: string;
  titleText?: {
    english: string;
    tamil: string;
  };
}

const VideoSection: React.FC<VideoSectionProps> = ({ 
  englishVideoId, 
  tamilVideoId,
  titleText = {
    english: 'Watch the English version',
    tamil: 'தமிழ் பதிப்பைப் பாருங்கள்'
  }
}) => {
  const [activeTab, setActiveTab] = useState<'en' | 'ta'>('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentVideoId = activeTab === 'en' ? englishVideoId : tamilVideoId;
  const currentTitle = activeTab === 'en' ? titleText.english : titleText.tamil;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleTabChange = (lang: 'en' | 'ta') => {
    setActiveTab(lang);
    setIsPlaying(false);
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-16 px-4" aria-label="Video section">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200" role="tablist">
          <button
            onClick={() => handleTabChange('en')}
            role="tab"
            aria-selected={activeTab === 'en'}
            aria-controls="video-player"
            id="tab-en"
            tabIndex={activeTab === 'en' ? 0 : -1}
            className={`flex-1 px-8 py-4 md:px-12 md:py-6 font-black text-base md:text-lg transition-all border-b-3 ${
              activeTab === 'en'
                ? 'bg-blue-50 text-blue-600 border-blue-600'
                : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleTabChange('ta')}
            role="tab"
            aria-selected={activeTab === 'ta'}
            aria-controls="video-player"
            id="tab-ta"
            tabIndex={activeTab === 'ta' ? 0 : -1}
            className={`flex-1 px-8 py-4 md:px-12 md:py-6 font-black text-base md:text-lg transition-all border-b-3 ${
              activeTab === 'ta'
                ? 'bg-blue-50 text-blue-600 border-blue-600'
                : 'bg-white text-slate-500 border-transparent hover:bg-slate-50'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Video Container with 16:9 Aspect Ratio */}
        <div 
          className="relative w-full bg-black"
          style={{ aspectRatio: '16 / 9' }}
        >
          {!isPlaying ? (
            // Thumbnail with Play Button (Lazy Loading)
            <button
              onClick={handlePlay}
              className="w-full h-full flex items-center justify-center group relative cursor-pointer focus:outline-none"
              aria-label={`Play ${currentTitle}`}
            >
              <img
                src={`https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`}
                alt={`Thumbnail for ${currentTitle}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all"></div>
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <div className="bg-red-600 text-white w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <i className="fas fa-play text-3xl md:text-4xl ml-2"></i>
                </div>
                {/* Open in YouTube Button */}
                <a
                  href={`https://www.youtube.com/watch?v=${currentVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base shadow-lg transition-all flex items-center gap-2"
                  aria-label="Open video in YouTube"
                >
                  <i className="fab fa-youtube"></i>
                  <span>YouTube</span>
                </a>
              </div>
            </button>
          ) : (
            // YouTube Iframe (Loaded on Click)
            <>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1&si=0&html5=1&playsinline=1`}
                title={currentTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
              />
              {/* Close button to stop video when watched */}
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/70 hover:bg-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
                aria-label="Close video player"
                title="Close video"
              >
                <i className="fas fa-times"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

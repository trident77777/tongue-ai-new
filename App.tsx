import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { ImageUploader } from './ImageUploader';
import { DiagnosisReport } from './DiagnosisReport';
import { LoadingSpinner } from './LoadingSpinner';
import { AuthModal } from './AuthModal';
import { analyzeTongueImage } from './geminiService';
import { DiagnosisResult } from './types';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const user = localStorage.getItem('tcm_ai_user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleImageSelect = (base64Image: string) => {
    setImage(base64Image);
    setResult(null);
    setError(null);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('tcm_ai_user', 'demo_user');
    setIsLoggedIn(true);
    setShowAuthModal(false);
    // Auto-trigger analysis if image is present
    if (image) {
      handleAnalyze();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tcm_ai_user');
    setIsLoggedIn(false);
    setResult(null);
  };

  const handleAnalyzeClick = () => {
    if (!image) return;
    
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      handleAnalyze();
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // Remove data URL prefix if present for the API call
      // Ensure image exists since this is called after checks
      if (!image) return;
      
      const cleanBase64 = image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
      const diagnosis = await analyzeTongueImage(cleanBase64);
      setResult(diagnosis);
    } catch (err: any) {
      console.error(err);
      setError("AI 分析失败，请稍后重试或检查 API Key 设置。");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLogin={handleLoginSuccess}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!image ? (
          <div className="space-y-8">
             <section className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-serif font-bold text-tcm-dark">
                望闻问切 · 舌诊先行
              </h2>
              <p className="text-tcm-stone text-lg max-w-2xl mx-auto">
                请上传或拍摄一张清晰的舌头照片（自然光下最佳）。AI 将根据传统中医理论，分析您的舌质、舌苔与舌形，提供体质辨识与养生建议。
              </p>
            </section>
            <ImageUploader onImageSelect={handleImageSelect} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <FeatureCard 
                icon="📷" 
                title="拍摄/上传" 
                desc="在自然光线下拍摄清晰的正面舌像。"
              />
              <FeatureCard 
                icon="🧠" 
                title="AI 辨证" 
                desc="基于中医五脏六腑理论进行深度分析。"
              />
              <FeatureCard 
                icon="🍵" 
                title="调理建议" 
                desc="获取个性化的饮食与生活起居指导。"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Image Preview Side */}
              <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow-md border border-tcm-stone/20 sticky top-4">
                <img 
                  src={image} 
                  alt="Uploaded tongue" 
                  className="w-full h-auto rounded-lg object-cover aspect-square mb-4" 
                />
                <div className="flex gap-2">
                  {!result && !loading && (
                    <button
                      onClick={handleAnalyzeClick}
                      className="flex-1 bg-tcm-accent hover:bg-red-900 text-white font-serif py-2 px-4 rounded transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {!isLoggedIn && <span className="text-xs">🔒</span>}
                      开始诊断
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="flex-1 border border-tcm-stone/50 text-tcm-stone hover:bg-tcm-stone/10 font-serif py-2 px-4 rounded transition-colors"
                  >
                    重新上传
                  </button>
                </div>
                {!isLoggedIn && !loading && !result && (
                  <p className="text-xs text-center text-tcm-stone/70 mt-3">
                    * 需要登录才能查看详细诊断报告
                  </p>
                )}
              </div>

              {/* Result Side */}
              <div className="w-full md:w-2/3">
                {loading && (
                  <div className="bg-white p-12 rounded-xl shadow-md border border-tcm-stone/20 flex flex-col items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                    <p className="mt-6 text-tcm-dark font-serif text-lg animate-pulse">
                      老中医正在斟酌方脉...
                    </p>
                    <p className="text-sm text-tcm-stone mt-2">正在分析舌质、舌苔与经络状态</p>
                  </div>
                )}
                
                {error && (
                   <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">⚠️</div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {result && !loading && (
                  <DiagnosisReport result={result} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-tcm-stone/10 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-serif font-bold text-tcm-dark mb-2">{title}</h3>
      <p className="text-tcm-stone text-sm">{desc}</p>
    </div>
  );
}

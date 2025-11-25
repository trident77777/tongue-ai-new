import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn, onLogout }) => {
  return (
    <div className="min-h-screen bg-tcm-bg flex flex-col font-sans">
      <header className="bg-tcm-dark text-tcm-bg shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tcm-accent rounded-full flex items-center justify-center text-white font-serif font-bold text-xl border-2 border-tcm-gold">
              舌
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide">
              AI 智能舌诊
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {isLoggedIn && (
               <div className="flex items-center gap-3">
                 <div className="hidden md:block text-xs text-tcm-bg/70">
                   已登录: 访客
                 </div>
                 <button 
                  onClick={onLogout}
                  className="text-xs border border-tcm-bg/30 rounded px-2 py-1 hover:bg-tcm-bg/10 transition-colors"
                 >
                   退出
                 </button>
               </div>
             )}
             {!isLoggedIn && (
               <nav className="text-sm text-tcm-bg/80 font-serif hidden md:block">
                Traditional Chinese Medicine AI
              </nav>
             )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-tcm-dark/90 text-tcm-bg/60 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-2">
          <p className="font-serif">源于传统，赋能现代</p>
          <p className="text-xs">
            免责声明：本应用基于人工智能技术，分析结果仅供参考，不能替代专业医师的诊断与治疗。如有不适，请及时就医。
          </p>
        </div>
      </footer>
    </div>
  );
};
import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-tcm-dark/60 backdrop-blur-sm p-4">
      <div className="bg-tcm-bg w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-tcm-stone/30 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-tcm-stone hover:text-tcm-dark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-tcm-dark p-6 text-center">
           <div className="w-12 h-12 bg-tcm-accent rounded-full flex items-center justify-center text-white font-serif font-bold text-2xl border-2 border-tcm-gold mx-auto mb-3">
              诊
            </div>
           <h2 className="text-2xl font-serif font-bold text-tcm-bg">
             {isRegistering ? '注册中医健康账号' : '登录查看诊断结果'}
           </h2>
           <p className="text-tcm-bg/70 text-sm mt-2">
             建立您的专属中医健康档案，追踪身体变化
           </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-tcm-dark mb-1 font-serif">手机号 / 邮箱</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded border border-tcm-stone/30 bg-white focus:outline-none focus:border-tcm-accent focus:ring-1 focus:ring-tcm-accent transition-colors"
                placeholder="example@tcm.ai"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-tcm-dark mb-1 font-serif">密码</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-2 rounded border border-tcm-stone/30 bg-white focus:outline-none focus:border-tcm-accent focus:ring-1 focus:ring-tcm-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {isRegistering && (
               <div>
                <label className="block text-sm font-bold text-tcm-dark mb-1 font-serif">确认密码</label>
                <input 
                  type="password" 
                  required
                  className="w-full px-4 py-2 rounded border border-tcm-stone/30 bg-white focus:outline-none focus:border-tcm-accent focus:ring-1 focus:ring-tcm-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-tcm-accent hover:bg-red-900 text-white font-serif font-bold py-3 px-4 rounded transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  处理中...
                </>
              ) : (
                isRegistering ? '立即注册' : '立即登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-tcm-stone hover:text-tcm-accent text-sm underline decoration-dotted underline-offset-4"
            >
              {isRegistering ? '已有账号？去登录' : '还没有账号？去注册'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
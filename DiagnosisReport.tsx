import React from 'react';
import { DiagnosisResult } from '../types';

interface DiagnosisReportProps {
  result: DiagnosisResult;
}

export const DiagnosisReport: React.FC<DiagnosisReportProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-tcm-accent">
        <h2 className="text-2xl font-serif font-bold text-tcm-dark mb-2">辨证综述</h2>
        <p className="text-tcm-stone text-lg leading-relaxed font-serif">
          {result.overview}
        </p>
      </div>

      {/* Main Syndrome Card & Symptoms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-tcm-bg to-stone-100 p-6 rounded-xl shadow-md border border-tcm-stone/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl font-bold text-tcm-dark select-none pointer-events-none">
            证
          </div>
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 bg-tcm-accent text-white text-xs font-bold rounded mb-2">
              核心证型
            </div>
            <h3 className="text-3xl font-serif font-bold text-tcm-accent mb-4">
              {result.syndrome.name}
            </h3>
            <p className="text-tcm-dark mb-4 text-justify">
              {result.syndrome.description}
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-tcm-stone">相关脏腑：</span>
              {result.syndrome.organsInvolved.map((organ, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-tcm-stone/30 rounded-full text-sm text-tcm-dark font-serif">
                  {organ}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Symptoms Column */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-tcm-stone/10 flex flex-col justify-center">
           <h4 className="font-serif font-bold text-tcm-dark mb-4 flex items-center gap-2 border-b border-tcm-stone/10 pb-2">
            <span className="text-xl">🩺</span> 常见症状
           </h4>
           <ul className="space-y-3">
             {result.symptoms.map((symptom, idx) => (
               <li key={idx} className="flex items-center text-tcm-dark font-serif">
                 <span className="w-1.5 h-1.5 rounded-full bg-tcm-accent mr-3"></span>
                 {symptom}
               </li>
             ))}
           </ul>
        </div>
      </div>

       {/* Meridian Balance Section - NEW */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-tcm-stone/10">
        <h3 className="text-xl font-serif font-bold text-tcm-dark mb-4 flex items-center gap-2">
          <span className="text-xl">☯️</span> 经络平衡辨识
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.meridianAnalysis && result.meridianAnalysis.length > 0 ? (
            result.meridianAnalysis.map((meridian, idx) => (
              <div key={idx} className="border border-tcm-stone/20 rounded-lg p-4 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-tcm-dark font-serif text-lg">{meridian.name}</h4>
                  <span className="px-2 py-0.5 bg-tcm-dark text-tcm-bg text-xs rounded font-serif">
                    {meridian.status}
                  </span>
                </div>
                <p className="text-sm text-tcm-stone leading-relaxed">
                  {meridian.description}
                </p>
              </div>
            ))
          ) : (
             <p className="text-tcm-stone text-sm col-span-2">暂无显著异常经络。</p>
          )}
        </div>
      </div>

      {/* Details Grid (Tongue Body & Coating) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tongue Body */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-tcm-stone/10">
          <div className="flex items-center gap-2 mb-4 border-b border-tcm-stone/10 pb-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-serif font-bold">质</div>
            <h3 className="text-lg font-bold text-tcm-dark">舌质分析</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-tcm-stone">颜色</span>
              <span className="font-semibold text-tcm-dark">{result.tongueBody.color}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-tcm-stone">形态</span>
              <span className="font-semibold text-tcm-dark">{result.tongueBody.shape}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-tcm-stone">津液</span>
              <span className="font-semibold text-tcm-dark">{result.tongueBody.moisture}</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-stone-50 rounded text-sm text-tcm-dark leading-relaxed">
            {result.tongueBody.analysis}
          </div>
        </div>

        {/* Tongue Coating */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-tcm-stone/10">
          <div className="flex items-center gap-2 mb-4 border-b border-tcm-stone/10 pb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center font-serif font-bold">苔</div>
            <h3 className="text-lg font-bold text-tcm-dark">舌苔分析</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-tcm-stone">苔色</span>
              <span className="font-semibold text-tcm-dark">{result.tongueCoating.color}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-tcm-stone">厚薄</span>
              <span className="font-semibold text-tcm-dark">{result.tongueCoating.thickness}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-tcm-stone">苔质</span>
              <span className="font-semibold text-tcm-dark">{result.tongueCoating.nature}</span>
            </li>
          </ul>
           <div className="mt-4 p-3 bg-stone-50 rounded text-sm text-tcm-dark leading-relaxed">
            {result.tongueCoating.analysis}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-tcm-stone/10">
         <h3 className="text-xl font-serif font-bold text-tcm-dark mb-6 text-center border-b border-tcm-stone/20 pb-4">
           调理建议
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Diet */}
            <div className="p-4 bg-emerald-50/50 rounded-lg">
              <h4 className="flex items-center font-bold text-emerald-800 mb-3 border-b border-emerald-100 pb-2">
                <span className="mr-2 text-xl">🥬</span> 饮食禁宜
              </h4>
              <ul className="space-y-2">
                {result.recommendations.diet.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-tcm-stone">
                    <span className="mr-2 text-emerald-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

             {/* Lifestyle */}
             <div className="p-4 bg-blue-50/50 rounded-lg">
              <h4 className="flex items-center font-bold text-blue-800 mb-3 border-b border-blue-100 pb-2">
                <span className="mr-2 text-xl">🧘🏻</span> 起居养生
              </h4>
              <ul className="space-y-2">
                {result.recommendations.lifestyle.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-tcm-stone">
                    <span className="mr-2 text-blue-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

             {/* Herbs/Food Therapy */}
             <div className="p-4 bg-amber-50/50 rounded-lg">
              <h4 className="flex items-center font-bold text-amber-800 mb-3 border-b border-amber-100 pb-2">
                <span className="mr-2 text-xl">🍵</span> 食疗推荐
              </h4>
               <ul className="space-y-2">
                {result.recommendations.herbsOrFoods.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-tcm-stone">
                    <span className="mr-2 text-amber-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Herbal Medicine Formulas */}
             <div className="p-4 bg-rose-50/50 rounded-lg">
              <h4 className="flex items-center font-bold text-tcm-accent mb-3 border-b border-rose-100 pb-2">
                <span className="mr-2 text-xl">🏺</span> 建议方药
              </h4>
              <div className="space-y-3">
                {result.recommendations.tcmFormulas.map((item, idx) => (
                  <div key={idx} className="bg-white/60 p-2 rounded border border-rose-100">
                    <span className="block font-bold text-tcm-dark text-sm mb-1">{item.name}</span>
                    <span className="block text-xs text-tcm-stone">{item.description}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-rose-400 mt-3 italic">
                * 处方药请遵医嘱服用，孕妇及特殊体质慎用。
              </p>
            </div>
         </div>
      </div>
    </div>
  );
};
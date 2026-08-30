import React from 'react';

export default function WelcomePage({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-700 to-brand-900 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-white">
        <div className="text-5xl mb-4">🏙️</div>
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">天河青年通</h1>
        <p className="text-brand-200 text-sm text-center mb-10">刚到天河？让我帮你找到所有可申请的政策</p>

        {/* Feature cards */}
        <div className="w-full max-w-sm space-y-3 mb-10">
          {[
            { icon: '📋', title: '6-9道简单问题', desc: '回答你的基本情况，无需了解政策名称' },
            { icon: '🎯', title: '精准政策匹配', desc: '自动匹配求职、租房、社保、居住证、公积金' },
            { icon: '📱', title: '个性化办事方案', desc: '你需要的材料清单、办理入口和时间成本' },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm">{f.title}</div>
                <div className="text-brand-200 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full max-w-sm bg-white text-brand-700 font-bold text-lg rounded-2xl py-4 shadow-lg
                     hover:bg-brand-50 active:bg-brand-100 transition-colors duration-150
                     focus:outline-none focus:ring-4 focus:ring-white/40"
        >
          开始匹配 →
        </button>

        <p className="text-brand-300 text-xs mt-4 text-center">约 2-3 分钟完成 · 完全免费 · 数据仅在本地处理</p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-brand-400 text-xs">
          适用场景：毕业生落脚天河 · 求职→租房→社保→居住证→公积金完整链路
        </p>
        <p className="text-brand-500 text-xs mt-2">
          参赛作品 · 2026年青AI天河人工智能协作创新大赛
        </p>
      </div>
    </div>
  );
}

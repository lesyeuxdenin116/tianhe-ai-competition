import React, { useState, useEffect } from 'react';
import { QUESTIONS, getVisibleQuestions } from '../engine/ruleEngine.js';

export default function Survey({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const visible = getVisibleQuestions(answers);
  const currentQ = visible[currentIdx];
  const progress = visible.length > 0 ? ((currentIdx) / visible.length) * 100 : 0;
  const isLast = currentIdx === visible.length - 1;

  function handleSelect(value) {
    if (animating) return;

    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    // Auto-advance after short delay
    setTimeout(() => {
      const newVisible = getVisibleQuestions(newAnswers);
      if (currentIdx < newVisible.length - 1) {
        setAnimating(true);
        setTimeout(() => {
          setCurrentIdx(idx => idx + 1);
          setAnimating(false);
        }, 200);
      } else {
        // Last question answered
        onComplete(newAnswers);
      }
    }, 280);
  }

  function handleBack() {
    if (currentIdx === 0) return;
    // Remove current question's answer when going back
    const newAnswers = { ...answers };
    delete newAnswers[currentQ.id];
    setAnswers(newAnswers);
    setCurrentIdx(idx => idx - 1);
  }

  if (!currentQ) return null;

  const totalVisible = visible.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {currentIdx > 0 ? (
            <button
              onClick={handleBack}
              className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="返回上一题"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-7" />
          )}

          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>第 {currentIdx + 1} 题</span>
              <span>共 {totalVisible} 题</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentIdx + 1) / totalVisible) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className={`flex-1 px-4 py-8 max-w-lg mx-auto w-full transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        {/* Category badge */}
        <div className="mb-4">
          <span className="text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            {getCategoryLabel(currentQ.id)}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-xl font-bold text-slate-800 mb-2 leading-snug">
          {currentQ.text}
        </h2>
        {currentQ.hint && (
          <p className="text-xs text-slate-400 mb-5">{currentQ.hint}</p>
        )}
        {!currentQ.hint && <div className="mb-5" />}

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map(opt => {
            const isSelected = answers[currentQ.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                disabled={animating}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                    ${isSelected
                      ? 'border-brand-600 bg-brand-600'
                      : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm leading-snug">{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Already answered questions summary */}
        {currentIdx > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2 font-medium">你的回答</p>
            <div className="space-y-1.5">
              {visible.slice(0, currentIdx).map(q => {
                const ans = q.options.find(o => o.value === answers[q.id]);
                return ans ? (
                  <div key={q.id} className="flex gap-2 text-xs text-slate-500">
                    <span className="text-slate-400 flex-shrink-0">{q.text.replace('？', '')}</span>
                    <span className="text-slate-600 font-medium">· {ans.label}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-6 text-center max-w-lg mx-auto w-full">
        <p className="text-xs text-slate-300">
          以上信息仅在你的设备上处理，不会上传服务器
        </p>
      </div>
    </div>
  );
}

function getCategoryLabel(qId) {
  const map = {
    Q1: '就业状态',
    Q1_5: '毕业情况',
    Q_age: '年龄信息',
    Q2: '学历背景',
    Q3: '户籍信息',
    Q4: '家庭情况',
    Q5: '居住情况',
    Q6: '社保/公积金',
    Q7: '单位类型',
  };
  return map[qId] || '基本信息';
}

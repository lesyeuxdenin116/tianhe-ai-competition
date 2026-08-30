import React, { useState, useRef, useEffect } from 'react';
import { POLICIES } from '../data/policies.js';

function buildSystemPrompt(answers, result) {
  const policyContext = POLICIES.map(p =>
    `【${p.name}】（${p.category}）\n资格条件：${p.eligibility_text}\n办理流程：${p.process || '见官方网站'}\n${p.notes ? '注意：' + p.notes : ''}`
  ).join('\n\n');

  const answerSummary = buildAnswerSummary(answers);

  return `你是"天河青年通"的政策顾问，专门帮助刚到广州天河区的年轻毕业生了解可申请的政府政策。
你掌握以下政策的完整信息，请基于这些政策数据和用户的个人情况回答问题。回答要准确、简洁、实用，用中文回答。

用户基本情况：
${answerSummary}

你掌握的政策数据：
${policyContext}

注意事项：
1. 只回答与天河/广州政策相关的问题
2. 不确定的信息要明确说明需要用户自行核实
3. 建议用户关注官方渠道获取最新信息
4. 回答简洁，重点突出`;
}

function buildAnswerSummary(answers) {
  const Q1_MAP = { A: '已有正式offer/已入职', B: '灵活就业/接单', C: '求职中' };
  const Q1_5_MAP = { A: '已毕业', B: '在校学年在读' };
  const Q_AGE_MAP = { A: '18-25岁', B: '26-35岁', C: '36岁以上' };
  const Q2_MAP = { A: '大专/高职', B: '本科', C: '硕士及以上' };
  const Q3_MAP = { A: '广州户籍', B: '广东省内非广州', C: '外省户籍' };
  const Q5_MAP = { A: '已签租房合同', B: '住宿舍/亲友处', C: '还没找到住处' };

  const lines = [
    answers.Q1 && `就业状态：${Q1_MAP[answers.Q1]}`,
    answers.Q1_5 && `毕业状态：${Q1_5_MAP[answers.Q1_5]}`,
    answers.Q_age && `年龄：${Q_AGE_MAP[answers.Q_age]}`,
    answers.Q2 && `学历：${Q2_MAP[answers.Q2]}`,
    answers.Q3 && `户籍：${Q3_MAP[answers.Q3]}`,
    answers.Q5 && `住所：${Q5_MAP[answers.Q5]}`,
  ].filter(Boolean);

  return lines.join('\n');
}

export default function AIChat({ answers, result }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '你好！我是天河青年通的政策顾问 🤖\n\n我已经了解了你的基本情况，可以回答你关于这些政策的具体问题。比如：\n• 某个材料从哪里获取？\n• 办理流程的具体步骤？\n• 我的情况是否符合某个条件？',
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: buildSystemPrompt(answers, result) },
            ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({ role: m.role, content: m.content })),
            userMsg,
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `请求失败：${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '抱歉，没有获取到回复，请重试。';
      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ ${err.message}\n\n请稍后重试。`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      {/* Toggle header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4"
        onClick={() => setIsOpen(o => !o)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🤖</span>
          <div className="text-left">
            <p className="font-semibold text-slate-800 text-sm">AI 智能追问</p>
            <p className="text-slate-400 text-xs">对以上政策有疑问？直接问我</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100">
          {/* Messages area */}
          <div className="h-72 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={msg.role === 'user' ? 'chat-user' : 'chat-ai'}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="chat-ai">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-4 pb-4 border-t border-slate-100 pt-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="输入你的问题..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-brand-700 hover:bg-brand-800 disabled:bg-slate-200 text-white rounded-xl px-4 py-2.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

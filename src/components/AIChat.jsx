import React, { useState, useRef, useEffect, useMemo } from 'react';
import { POLICIES } from '../data/policies.js';

function formatInline(text) {
  const result = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*([\s\S]*)$/);
    if (boldMatch) {
      if (boldMatch[1]) result.push(boldMatch[1]);
      result.push(<strong key={key++}>{boldMatch[2]}</strong>);
      remaining = boldMatch[3];
      continue;
    }
    const italicMatch = remaining.match(/^(.*?)\*(.*?)\*([\s\S]*)$/);
    if (italicMatch && !italicMatch[2].startsWith('*')) {
      if (italicMatch[1]) result.push(italicMatch[1]);
      result.push(<em key={key++}>{italicMatch[2]}</em>);
      remaining = italicMatch[3];
      continue;
    }
    const codeMatch = remaining.match(/^(.*?)`(.*?)`([\s\S]*)$/);
    if (codeMatch) {
      if (codeMatch[1]) result.push(codeMatch[1]);
      result.push(<code key={key++} className="bg-slate-100 text-slate-700 px-1 rounded text-xs">{codeMatch[2]}</code>);
      remaining = codeMatch[3];
      continue;
    }
    result.push(remaining);
    break;
  }
  return result;
}

function ChatMarkdown({ content }) {
  const elements = useMemo(() => {
    const lines = content.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.match(/^[-*•]\s/)) {
        const items = [];
        while (i < lines.length && lines[i].match(/^[-*•]\s/)) {
          items.push(lines[i].replace(/^[-*•]\s/, ''));
          i++;
        }
        result.push(
          <ul key={result.length} className="list-disc list-inside space-y-0.5 my-1 ml-1">
            {items.map((item, j) => <li key={j}>{formatInline(item)}</li>)}
          </ul>
        );
        continue;
      }

      if (line.match(/^\d+[.)]\s/)) {
        const items = [];
        while (i < lines.length && lines[i].match(/^\d+[.)]\s/)) {
          items.push(lines[i].replace(/^\d+[.)]\s/, ''));
          i++;
        }
        result.push(
          <ol key={result.length} className="list-decimal list-inside space-y-0.5 my-1 ml-1">
            {items.map((item, j) => <li key={j}>{formatInline(item)}</li>)}
          </ol>
        );
        continue;
      }

      if (line.trim() === '') {
        result.push(<div key={result.length} className="h-2" />);
      } else {
        result.push(<p key={result.length} className="my-0.5">{formatInline(line)}</p>);
      }
      i++;
    }
    return result;
  }, [content]);

  return <div className="text-sm leading-relaxed">{elements}</div>;
}

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
      const response = await fetch(`/api/chat?_=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: buildSystemPrompt(answers, result) },
            ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({ role: m.role, content: m.content })),
            userMsg,
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let detail;
        try {
          const data = JSON.parse(text);
          detail = data.error?.message || data.error || text;
        } catch {
          detail = text.substring(0, 200);
        }
        throw new Error(detail || `请求失败(${response.status})`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '抱歉，没有获取到回复，请重试。';
      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (err) {
      const isNetworkIssue = !err.message || err.message.includes('405') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isNetworkIssue
          ? '⚠️ AI追问功能在当前网络环境下暂不可用。\n\n这不影响上方的政策匹配结果（那些是100%离线计算的）。如需使用AI追问，请尝试在电脑浏览器中打开本页面。'
          : `❌ ${err.message}\n\n请稍后重试。`,
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
                  {msg.role === 'user'
                    ? <p className="text-sm leading-relaxed">{msg.content}</p>
                    : <ChatMarkdown content={msg.content} />
                  }
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

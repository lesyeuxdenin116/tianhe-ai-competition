import React from 'react';

const URGENCY_CONFIG = {
  high: {
    containerClass: 'bg-red-50 border-red-200',
    titleClass: 'text-red-700',
    contentClass: 'text-red-600',
    dotClass: 'bg-red-500',
    label: '紧急',
    labelClass: 'bg-red-100 text-red-700',
  },
  medium: {
    containerClass: 'bg-amber-50 border-amber-200',
    titleClass: 'text-amber-700',
    contentClass: 'text-amber-600',
    dotClass: 'bg-amber-500',
    label: '近期',
    labelClass: 'bg-amber-100 text-amber-700',
  },
  low: {
    containerClass: 'bg-blue-50 border-blue-200',
    titleClass: 'text-blue-700',
    contentClass: 'text-blue-600',
    dotClass: 'bg-blue-400',
    label: '提醒',
    labelClass: 'bg-blue-100 text-blue-700',
  },
};

export function ImmediateAlertCard({ alert }) {
  const cfg = URGENCY_CONFIG[alert.urgency] || URGENCY_CONFIG.medium;

  return (
    <div className={`rounded-xl border px-4 py-4 ${cfg.containerClass}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{alert.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.labelClass}`}>
              {cfg.label}
            </span>
            <h3 className={`font-semibold text-sm ${cfg.titleClass}`}>{alert.title}</h3>
          </div>
          <p className={`text-xs leading-relaxed whitespace-pre-line ${cfg.contentClass}`}>
            {alert.content}
          </p>
          {alert.relatedLink && (
            <a
              href={alert.relatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${cfg.titleClass} hover:underline`}
            >
              查看官方办理入口 →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function FutureReminderCard({ item }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{item.emoji}</span>
        <div>
          <h3 className="font-semibold text-slate-700 text-sm mb-1">{item.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{item.content}</p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { getPolicyById } from '../data/policies.js';

export default function PolicyCard({ policyId, status, reason, condition, alternative, materials, supplyWarning, urgency, isAutoTransfer, howToConfirm, importantNote }) {
  const [expanded, setExpanded] = useState(false);
  const policy = getPolicyById(policyId);
  if (!policy) return null;

  const statusConfig = {
    eligible: {
      badge: '✅ 符合条件',
      badgeClass: 'tag-eligible',
      borderClass: 'border-green-200',
      bgClass: 'bg-green-50',
    },
    pending: {
      badge: '⚠️ 需确认',
      badgeClass: 'tag-pending',
      borderClass: 'border-amber-200',
      bgClass: 'bg-amber-50/50',
    },
    ineligible: {
      badge: '❌ 暂不符合',
      badgeClass: 'tag-ineligible',
      borderClass: 'border-slate-200',
      bgClass: 'bg-white',
    },
  };

  const cfg = statusConfig[status] || statusConfig.ineligible;

  return (
    <div className={`card border ${cfg.borderClass} overflow-hidden`}>
      {/* Supply warning - top banner */}
      {supplyWarning && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-2.5">
          <p className="text-orange-700 text-xs font-medium leading-snug">{supplyWarning}</p>
        </div>
      )}

      {/* Auto-transfer notice */}
      {isAutoTransfer && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5">
          <p className="text-blue-700 text-xs font-medium">✨ 省内自动接续，无需任何操作</p>
        </div>
      )}

      {/* Card header */}
      <button
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={cfg.badgeClass}>{cfg.badge}</span>
            <span className="text-xs text-slate-400">{policy.category}</span>
          </div>
          <h3 className="font-semibold text-slate-800 text-sm leading-snug">{policy.name}</h3>
          {policy.amount && (
            <p className="text-brand-700 text-xs font-bold mt-0.5">{policy.amount}</p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Summary reason/condition */}
      {(reason || condition) && (
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-lg px-3 py-2">
            {reason || condition}
          </p>
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-4 section-enter">
          {/* Ineligible alternative */}
          {status === 'ineligible' && alternative && (
            <div className="mb-4 bg-blue-50 rounded-lg px-3 py-2.5">
              <p className="text-blue-700 text-xs font-medium mb-0.5">💡 替代路线</p>
              <p className="text-blue-600 text-xs">{alternative}</p>
            </div>
          )}

          {/* Pending how to confirm */}
          {howToConfirm && (
            <div className="mb-4 bg-amber-50 rounded-lg px-3 py-2.5">
              <p className="text-amber-700 text-xs font-medium mb-0.5">如何确认？</p>
              <p className="text-amber-700 text-xs">{howToConfirm}</p>
            </div>
          )}

          {/* Important note */}
          {importantNote && (
            <div className="mb-4 bg-red-50 rounded-lg px-3 py-2.5">
              <p className="text-red-700 text-xs">{importantNote}</p>
            </div>
          )}

          {/* Materials list */}
          {materials && materials.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">所需材料</p>
              <ul className="space-y-1.5">
                {materials.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Process */}
          {policy.process && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">办理方式</p>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{policy.process}</p>
            </div>
          )}

          {/* Time cost */}
          {policy.time_cost && (
            <div className="mb-4 flex items-start gap-2">
              <span className="text-xs text-slate-400 flex-shrink-0">⏱</span>
              <p className="text-xs text-slate-500">{policy.time_cost}</p>
            </div>
          )}

          {/* Notes */}
          {policy.notes && (
            <div className="mb-4 bg-yellow-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-yellow-800 leading-relaxed">{policy.notes}</p>
            </div>
          )}

          {/* Practical tip */}
          {policy.practical_tip && (
            <div className="mb-4 bg-teal-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-teal-800 leading-relaxed">{policy.practical_tip}</p>
            </div>
          )}

          {/* Authority & date */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
            {policy.authority && <span>主管：{policy.authority}</span>}
            {policy.source_date && <span>信息日期：{policy.source_date}</span>}
          </div>

          {/* Official link */}
          {policy.official_url && (
            <div className="mt-3">
              <a
                href={policy.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                查看官方链接
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

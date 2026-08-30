import React, { useState } from 'react';
import PolicyCard from './PolicyCard.jsx';
import { ImmediateAlertCard, FutureReminderCard } from './AlertCard.jsx';
import AIChat from './AIChat.jsx';

const ANSWER_LABELS = {
  Q1: { A: '正式就业', B: '灵活就业', C: '求职中' },
  Q1_5: { A: '已毕业', B: '在读学年' },
  Q_age: { A: '18-25岁', B: '26-35岁', C: '36岁+' },
  Q2: { A: '大专/高职', B: '本科', C: '硕士+' },
  Q3: { A: '广州户籍', B: '省内非广州', C: '外省' },
  Q5: { A: '已租房', B: '住宿舍/亲友处', C: '未找住处' },
};

function HousingFallback() {
  return (
    <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-4">
      <p className="text-slate-500 text-xs font-medium mb-2">📌 住房整体情况说明</p>
      <p className="text-slate-600 text-xs leading-relaxed mb-3">
        根据你目前的情况，暂时没有可立即申请的政府住房援助渠道。这对很多刚到天河的年轻人来说是普遍情况——公租房个人申请有学历和年龄门槛，集体租赁供应极为有限（2026年天河全区仅6套）。
      </p>
      <p className="text-slate-600 text-xs font-medium mb-1.5">你现在能做的最实际的事：</p>
      <ol className="space-y-1.5 text-xs text-slate-600">
        <li className="flex gap-2">
          <span className="text-brand-600 font-bold flex-shrink-0">①</span>
          <span>按市场价租房，找好住所后立即办居住登记（居住证6个月等待期从那天算）</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-600 font-bold flex-shrink-0">②</span>
          <span>入职后确认公司为你缴了公积金，满3个月后用公积金提取抵扣租金（每月约月薪×10%，不使用要等到退休才能取）</span>
        </li>
        <li className="flex gap-2">
          <span className="text-brand-600 font-bold flex-shrink-0">③</span>
          <span>如你的公司是高新技术企业或总部企业，主动问HR是否有参与集体租赁申报</span>
        </li>
      </ol>
    </div>
  );
}

function Section({ title, emoji, count, children, defaultOpen = true, emptyText }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{emoji}</span>
          <span className="font-bold text-slate-800 text-base">{title}</span>
          {count !== undefined && (
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
              {count}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 section-enter">
          {count === 0 && emptyText ? (
            <p className="text-sm text-slate-400 text-center py-4">{emptyText}</p>
          ) : children}
        </div>
      )}
    </div>
  );
}

export default function Results({ answers, result, onRestart }) {
  const { eligible, pending, ineligible, immediate, future, housingFallback } = result;

  // Build answer tags for summary
  const answerTags = Object.entries(answers)
    .map(([k, v]) => ANSWER_LABELS[k]?.[v])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onRestart}
            className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="重新填写"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 text-base">你的办事方案</h1>
            <p className="text-xs text-slate-400">天河青年通 · 政策匹配结果</p>
          </div>
          <button
            onClick={onRestart}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors"
          >
            重新填写
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* User summary tags */}
        <div className="flex flex-wrap gap-2">
          {answerTags.map(tag => (
            <span key={tag} className="text-xs bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Self-confirm housing ownership */}
        {(eligible.some(e => ['gz_new_employee_housing_individual', 'gz_new_employee_housing_unit', 'th_talent_apartment', 'gz_provident_fund_rent_withdrawal'].includes(e.policyId)) ||
          pending.some(p => ['gz_new_employee_housing_individual', 'gz_new_employee_housing_unit', 'th_talent_apartment', 'gz_provident_fund_rent_withdrawal'].includes(p.policyId))) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700">
              💡 以上结果基于你在广州无自有产权住房。如你或配偶在广州有房产，请重新填写以获取准确结果。
            </p>
          </div>
        )}

        {/* 立即要做 */}
        {immediate.length > 0 && (
          <Section title="立即要做" emoji="🔴" count={immediate.length} defaultOpen={true}>
            <div className="space-y-3">
              {immediate.map(alert => (
                <ImmediateAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </Section>
        )}

        {/* 符合的政策 */}
        <Section
          title="你符合的政策"
          emoji="✅"
          count={eligible.length}
          defaultOpen={true}
          emptyText="根据你的情况，目前没有直接符合条件的政策。"
        >
          <div className="space-y-3">
            {eligible.map(item => (
              <PolicyCard
                key={item.policyId}
                policyId={item.policyId}
                status="eligible"
                reason={item.reason}
                materials={item.materials}
                urgency={item.urgency}
              />
            ))}
          </div>
        </Section>

        {/* 需确认/值得关注 */}
        {pending.length > 0 && (
          <Section title="值得关注（需确认）" emoji="⚠️" count={pending.length} defaultOpen={true}>
            <p className="text-xs text-slate-500 mb-3">以下政策你可能符合条件，但还需要确认某些细节。</p>
            <div className="space-y-3">
              {pending.map(item => (
                <PolicyCard
                  key={item.policyId}
                  policyId={item.policyId}
                  status="pending"
                  condition={item.condition}
                  supplyWarning={item.supplyWarning}
                  materials={item.materials}
                  isAutoTransfer={item.isAutoTransfer}
                  howToConfirm={item.howToConfirm}
                  importantNote={item.importantNote}
                />
              ))}
            </div>
          </Section>
        )}

        {/* 不符合的政策 */}
        {ineligible.length > 0 && (
          <Section title="暂不符合" emoji="❌" count={ineligible.length} defaultOpen={false}>
            <p className="text-xs text-slate-500 mb-3">以下政策根据你的情况不符合条件。</p>
            <div className="space-y-3">
              {ineligible.map(item => (
                <PolicyCard
                  key={item.policyId}
                  policyId={item.policyId}
                  status="ineligible"
                  reason={item.reason}
                  alternative={item.alternative}
                />
              ))}
            </div>
            {housingFallback && <HousingFallback />}
          </Section>
        )}

        {/* 未来提醒 */}
        {future.length > 0 && (
          <Section title="未来提醒" emoji="📅" count={future.length} defaultOpen={false}>
            <p className="text-xs text-slate-500 mb-3">以下事项需要在特定时间节点操作，记得到时候回来查看。</p>
            <div className="space-y-3">
              {future.map(item => (
                <FutureReminderCard key={item.id} item={item} />
              ))}
            </div>
          </Section>
        )}

        {/* AI智能追问 */}
        <AIChat answers={answers} result={result} />

        {/* Disclaimer */}
        <div className="bg-slate-100 rounded-xl px-4 py-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            ⚠️ <strong>免责声明</strong>：以上政策信息仅供参考，具体以政府最新规定为准。政策可能随时调整，建议在办理前通过官方渠道核实最新要求。
          </p>
          <p className="text-xs text-slate-400 mt-2">
            参赛作品 · 2026年青AI天河人工智能协作创新大赛 · 板块二 · 方向1（社区便民）
          </p>
        </div>
      </div>
    </div>
  );
}

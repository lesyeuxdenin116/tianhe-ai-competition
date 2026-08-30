/**
 * 天河青年通 · 政策资格判定规则引擎
 * 依据：trigger_logic_FINAL.md v2.1 FINAL
 *
 * 输入：answers 对象 { Q1, Q1_5, Q_age, Q2, Q3, Q4, Q5, Q6, Q7 }
 * 输出：{ eligible, pending, ineligible, immediate, future, housingFallback, summary }
 */

export function evaluate(answers) {
  const {
    Q1, Q1_5, Q_age, Q2, Q3, Q4, Q5, Q6, Q7
  } = answers;

  const eligible = [];
  const pending = [];
  const ineligible = [];
  const immediate = [];
  const future = [];

  // ────────────────────────────────────────
  // 2.1 就业补贴类
  // ────────────────────────────────────────

  // gz_subsidy_job_seeking（一次性求职补贴）
  if (Q1_5 === 'A') {
    ineligible.push({
      policyId: 'gz_subsidy_job_seeking',
      reason: '你已毕业，此补贴只能在毕业前通过学校申请，申请窗口已关闭。',
    });
  } else if (Q1_5 === 'B') {
    if (Q4 === 'B') {
      eligible.push({
        policyId: 'gz_subsidy_job_seeking',
        reason: '你目前在校且属于困难群体，符合申请条件。',
        urgentAlert: true,
        materials: ['基本身份证明', '困难情形证明（低保证/残疾人证/助学贷款佐证材料等之一）', '学籍证明'],
      });
    } else if (Q4 === 'A') {
      ineligible.push({
        policyId: 'gz_subsidy_job_seeking',
        reason: '此补贴仅限低保、零就业、特困人员、残疾人、曾获助学贷款等困难群体，普通家庭不符合。',
      });
    }
    // Q4未填（理论上不会发生，Q1.5==B必问Q4）
  }

  // gz_subsidy_flexible_employment（灵活就业社保补贴）
  if (Q1 === 'B') {
    pending.push({
      policyId: 'gz_subsidy_flexible_employment',
      condition: '你已是灵活就业身份，符合基础条件。还需确认：①已办理灵活就业登记；②以个人身份缴纳职工养老保险和职工医疗保险（非居民医保）；③毕业时间在2年内。',
      howToConfirm: '前往居住地街道（镇）就业服务机构办理灵活就业登记，再办理社保缴纳。',
    });
  } else if (Q1 === 'A') {
    ineligible.push({
      policyId: 'gz_subsidy_flexible_employment',
      reason: '此补贴仅限灵活就业人员（自由职业/接单/个体经营），你已签订劳动合同，属于正式就业，不适用此项。',
    });
  }
  // Q1==C（求职中）：就业方式未确定，暂不展示此政策

  // gz_subsidy_sme_social_insurance（小微企业社保补贴·企业端）
  if (Q1 === 'A') {
    pending.push({
      policyId: 'gz_subsidy_sme_social_insurance',
      condition: '此补贴由公司申请，不是你个人申请。如果你所在公司是小微企业，公司可能有资格申请。',
      howToConfirm: '入职后可主动询问HR，公司是否已申请此补贴。该补贴降低公司社保成本，对你有间接利好。',
    });
  }

  // ────────────────────────────────────────
  // 2.2 居住证类
  // ────────────────────────────────────────

  // gz_residence_registration（居住登记）
  if (Q3 !== 'A') {
    let addressDoc = '';
    if (Q5 === 'A') addressDoc = '你已有租房合同，可用租房合同作为地址证明（备案与否均可用）。';
    else if (Q5 === 'B') addressDoc = '你住在公司宿舍/亲友处，需让公司/亲友出具住宿证明或借住手续作为地址证明。';
    else addressDoc = '你还没确定住处，找好住所后当天即可办理，租房合同/宿舍证明均可用。';

    eligible.push({
      policyId: 'gz_residence_registration',
      reason: '作为非广州户籍居民，你需要办理居住登记（免费，线上几分钟完成），这是后续申请居住证的前提条件。',
      materials: ['本人居民身份证原件', `居住地址证明（${addressDoc}）`],
      urgent: Q5 === 'A' || Q5 === 'B',
    });
  }

  // gz_residence_permit（电子居住证）
  if (Q3 !== 'A') {
    let greenChannel = false;
    let greenReason = '';

    // 绿色通道判定
    if (Q1 === 'A' && Q1_5 === 'A') {
      // 入职后连续缴纳社保满6个月可走绿色通道
      greenChannel = true;
      greenReason = '如果你已在广州连续缴纳社保满6个月，可走绿色通道，无需等满6个月居住登记时间。';
    }

    const condition = greenChannel
      ? `先完成居住登记，然后可走绿色通道（在居住地辖区内累计缴纳社保满6个月）申领居住证，无需等待标准通道的6个月。\n${greenReason}`
      : '先完成居住登记，居住登记满6个月后，凭租房合同或劳动合同即可申领电子居住证。';

    pending.push({
      policyId: 'gz_residence_permit',
      condition,
      greenChannel,
      materials: [
        '本人居民身份证',
        '本人照片（线上申请可拍摄上传）',
        Q5 === 'A' ? '居住地址证明：你已有租房合同，可直接使用' : '居住地址证明（租房合同、单位住宿证明等之一）',
        Q1 === 'A' ? '就业证明：你有劳动合同，可用此证明' : '就业/住所/就读证明之一',
      ],
    });
  }

  // ────────────────────────────────────────
  // 2.3 社保转移类
  // ────────────────────────────────────────

  // Q6 仅对 Q1==A && Q3!=A 的用户展示
  const hasQ6 = Q1 === 'A' && Q3 !== 'A';

  if (hasQ6) {
    // gz_pension_transfer（养老保险转移）
    if (Q6 === 'B') {
      eligible.push({
        policyId: 'gz_pension_transfer',
        reason: '你曾在省外缴纳过养老保险，转入广州后两地缴费年限合并计算。此项不紧迫，退休前2年内办理即可。',
        materials: ['线上办理全程免材料，身份核验通过即可', '线下：本人身份证原件'],
        urgency: 'low',
      });
    } else if (Q6 === 'A') {
      // 省内自动接续，无需操作，仅展示说明
      pending.push({
        policyId: 'gz_pension_transfer',
        condition: '你曾在广东省内其他城市缴过社保。好消息：省内养老保险系统自动接续，无需任何操作，缴费年限会自动合并。',
        isAutoTransfer: true,
      });
    }
    // Q6==C：无先前缴存，不展示社保转移政策

    // gz_medical_insurance_transfer（医保转移）
    if (Q6 === 'B') {
      eligible.push({
        policyId: 'gz_medical_insurance_transfer',
        reason: '你曾在省外缴纳过医保，建议入职广州并拿到社保卡后尽快办理转入，个人账户余额转入后可在广州药店和门诊刷卡使用。',
        materials: [
          '本人身份证',
          '广州市医保凭证（社保卡）',
          '线上办理可免材料，通过身份核验后直接提交',
        ],
        urgency: 'medium',
      });
    }

    // gz_unemployment_insurance_transfer（失业保险转移）
    if (Q6 === 'B') {
      eligible.push({
        policyId: 'gz_unemployment_insurance_transfer',
        reason: '你曾在省外缴纳过失业保险，缴费年限全国累计计算。如需在广州领取失业保险金，须先完成转入。',
        materials: [
          '原参保地社保经办机构开具的《失业保险参保凭证》',
          '本人身份证',
        ],
        urgency: 'low',
      });
    }
  }

  // Q6 相关公积金转入判定（省内也需要手动转）
  if (Q6 === 'A' || Q6 === 'B') {
    pending.push({
      policyId: 'gz_provident_fund_transfer_in',
      condition: '你在其他城市有过公积金缴存记录，可以转入广州。需要先在广州稳定缴存满6个月后再申请办理，不紧迫。',
      howToConfirm: '关注"广州住房公积金管理中心"微信公众号→异地账户转入，在广州缴存满6个月后操作。',
    });
  }

  // ────────────────────────────────────────
  // 2.4 住房类
  // ────────────────────────────────────────

  let housingIndividualStatus = 'hidden'; // eligible / pending / ineligible / hidden
  let housingUnitStatus = 'hidden';
  let talentApartmentStatus = 'hidden';

  // gz_new_employee_housing_individual（公租房·个人申请）
  if (Q1 === 'A') {
    if (Q_age === 'C') {
      ineligible.push({
        policyId: 'gz_new_employee_housing_individual',
        reason: '年龄超过35岁，不符合新就业无房职工公租房的年龄要求（18-35周岁）。',
      });
      housingIndividualStatus = 'ineligible';
    } else if (Q2 === 'A') {
      ineligible.push({
        policyId: 'gz_new_employee_housing_individual',
        reason: '大专/高职学历不符合个人申请路线（需要本科及以上学历）。建议关注单位整体租赁路线。',
        alternative: '如果你的公司属于高新技术企业等特定类型，可以通过单位整体租赁路线申请。',
      });
      housingIndividualStatus = 'ineligible';
    } else {
      // 本科+ 且年龄18-35
      pending.push({
        policyId: 'gz_new_employee_housing_individual',
        condition: '你的学历和年龄符合条件。还需满足：①连续缴纳五险满6个月；②本人及配偶在广州无自有产权住房。申请批次不定期开放，需关注官方公告。',
        materials: [
          '广州市公共租赁住房保障申请表',
          '身份证',
          '学历证书复印件',
          '劳动合同',
          '工作单位证明（含社保缴费确认）',
          '诚信承诺书',
          '广州市自然人不动产信息查询结果（一个月内有效）',
          '广州市无享受政策性住房证明（一个月内有效）',
        ],
      });
      housingIndividualStatus = 'pending';
    }
  } else if (Q1 === 'B' || Q1 === 'C') {
    housingIndividualStatus = 'hidden';
  }

  // gz_new_employee_housing_unit（公租房·单位整体租赁）
  if (Q1 === 'A') {
    if (Q_age === 'C') {
      ineligible.push({
        policyId: 'gz_new_employee_housing_unit',
        reason: '年龄超过35岁，不符合年龄要求。',
      });
      housingUnitStatus = 'ineligible';
    } else {
      // 年龄符合，看公司类型（Q7 可能有值）
      let companyNote = '';
      if (Q7 === 'A') {
        companyNote = '你的公司属于高新技术企业/总部企业等优先类型（第一类），建议主动询问HR是否有参与集体租赁申报计划。';
      } else if (Q7 === 'B') {
        companyNote = '你的公司可能属于第二类普通法人单位，优先级低于高新技术企业，建议向HR确认公司是否具备申报资质。';
      } else if (Q7 === 'C') {
        companyNote = '不确定公司类型，建议向HR询问公司是否属于高新技术企业或总部企业，这直接影响是否有资格申报。';
      } else {
        // Q7未问（Q2!=A或Q_age==C），只要Q1==A且Q_age!=C都可能符合
        companyNote = '此路线由公司统一申报，建议向HR了解公司是否有参与集体租赁申报计划。';
      }

      pending.push({
        policyId: 'gz_new_employee_housing_unit',
        condition: `此路线由用人单位统一申报，个人无法独立申请。${companyNote}`,
        supplyWarning: '⚠️ 供应量极度有限：2026年天河全区仅推出6套，按先到先得+第一类单位优先原则分配，成功概率极低。',
        materials: [
          '由公司统一提交，员工无需独立申请',
          '需向HR提供：社保缴纳证明、身份证复印件、广州市自然人不动产信息查询结果（一个月内有效）、广州市无享受政策性住房证明',
        ],
      });
      housingUnitStatus = 'pending';
    }
  } else {
    housingUnitStatus = 'hidden';
  }

  // th_talent_apartment（天河区人才公寓）— 无年龄限制
  if (Q1 === 'A') {
    if (Q2 === 'B' || Q2 === 'C') {
      pending.push({
        policyId: 'th_talent_apartment',
        condition: '你的学历符合条件（本科及以上）。此申请以公司为单位统一申报，个人不可直接申请，需向HR了解公司是否参与过申报。',
        supplyWarning: '⚠️ 供应量极度有限：历史批次约100-200套，面向天河全区所有符合条件企业的员工，竞争激烈，属于"值得关注但不可依赖"的路线。',
        materials: [
          '由公司统一收集提交',
          '员工个人需提供：申请表、无房承诺书、学历证书/职称证书、身份证',
        ],
      });
      talentApartmentStatus = 'pending';
    } else if (Q2 === 'A') {
      ineligible.push({
        policyId: 'th_talent_apartment',
        reason: '大专学历不符合条件（需本科及以上学历，或中级及以上职称证书，或上年度纳税清单达标）。如持有中级职称或纳税达标，可向HR了解具体情况。',
        alternative: '关注单位整体租赁路线（普通公租房）。',
      });
      talentApartmentStatus = 'ineligible';
    }
  } else {
    talentApartmentStatus = 'hidden';
  }

  // 住房板块兜底结论判定（当所有住房路线都不符合或仅剩低概率路线时展示）
  const housingFallback =
    Q1 === 'A' &&
    housingIndividualStatus === 'ineligible' &&
    (housingUnitStatus === 'ineligible' || housingUnitStatus === 'pending') &&
    talentApartmentStatus === 'ineligible';

  // ────────────────────────────────────────
  // 2.5 租赁备案类
  // ────────────────────────────────────────
  // gz_rental_contract_registration：Q5==A 时展示为主动提醒 PT-3，不作为常规政策展示

  // ────────────────────────────────────────
  // 2.6 公积金类
  // ────────────────────────────────────────

  // gz_provident_fund_enrollment（公积金开户）
  if (Q1 === 'A') {
    pending.push({
      policyId: 'gz_provident_fund_enrollment',
      condition: '公积金账户由公司代办，你需要入职后主动核查：公司是否已为你开立公积金账户并正常缴存。',
      howToConfirm: '可在广州住房公积金管理中心官网（gjj.gz.gov.cn）或关注"广州住房公积金管理中心"微信公众号→个人业务→缴存查询。',
      importantNote: '⚠️ 部分中小企业或非正规雇主未依法为员工缴纳公积金，这是判断用工是否合规的重要指标。',
    });
  }

  // gz_provident_fund_rent_withdrawal（公积金租房提取）
  if (Q1 === 'A') {
    if (Q5 === 'A') {
      pending.push({
        policyId: 'gz_provident_fund_rent_withdrawal',
        condition: '你有租房合同，入职满3个月后即可申请公积金租房提取，把账户里积累的公积金全部提出来支付租金。提取额度：有备案租房合同可按实际租金全额提取；无备案合同每人每月上限2000元。',
        materials: ['线上申请免材料，系统联网核验信息', '线下：本人身份证、租赁合同'],
      });
    } else {
      // Q5==B/C，放入未来提醒
    }
  }

  // ────────────────────────────────────────
  // 三、主动提醒触发规则
  // ────────────────────────────────────────

  // PT-1：求职补贴申请窗口即将关闭（紧急）
  if (Q1_5 === 'B' && Q4 === 'B') {
    immediate.push({
      id: 'PT-1',
      urgency: 'high',
      emoji: '🚨',
      title: '紧急：求职补贴申请窗口即将关闭',
      content: '一次性求职补贴（3000元）必须在你毕业前通过学校申请，毕业后无法补申。如果你还没申请，现在就应该联系辅导员或学校就业办公室，时间非常紧迫！',
    });
  }

  // PT-2：居住登记提醒
  if (Q3 !== 'A') {
    let pt2Title = '';
    let pt2Content = '';
    let pt2Urgency = 'high';

    if (Q5 === 'A') {
      pt2Title = '立即要做：用租房合同办居住登记';
      pt2Content = '用你的租房合同去办居住登记。居住证的6个月等待期从你登记那天开始算，今天就办能最早拿到居住证。用"粤居码"微信小程序线上办理，几分钟完成。\n\n注意：租房合同即使还未完成备案，也可以用来办居住登记。';
    } else if (Q5 === 'B') {
      pt2Title = '立即要做：用宿舍证明办居住登记';
      pt2Content = '用宿舍证明或借住手续去办居住登记。居住证的6个月等待期从登记那天开始算，尽快办理。让公司/亲友出具住宿证明，用"粤居码"小程序线上提交。';
    } else {
      pt2Title = '待办提醒：签好住处后立即办居住登记';
      pt2Content = '当你签好租房合同或确定住所后，当天就去办居住登记。居住证的6个月等待期从登记那天开始算，每晚一天就晚一天拿到居住证。用"粤居码"微信小程序线上办理，租房合同即使还未备案也可以用。';
      pt2Urgency = 'medium';
    }

    immediate.push({
      id: 'PT-2',
      urgency: pt2Urgency,
      emoji: '📍',
      title: pt2Title,
      content: pt2Content,
    });
  }

  // PT-3：租赁合同备案30天倒计时
  if (Q5 === 'A') {
    immediate.push({
      id: 'PT-3',
      urgency: 'medium',
      emoji: '📋',
      title: '30天内：提醒房东办理租赁合同备案',
      content: '你已签租房合同，有一件事需要在30天内完成：提醒房东办理租赁合同登记备案（法律要求房东在签合同后30天内完成）。\n\n备案的直接好处：你之后申请用公积金提取租金时，有备案合同可以按实际租金全额提取；没有备案合同，每人每月上限只有2000元。\n\n备案不影响你现在用租房合同办居住登记。',
      relatedLink: 'https://zfcj.gz.gov.cn/zfcj/ygjy',
    });
  }

  // PT-4：公司是否缴了社保和公积金
  if (Q1 === 'A') {
    immediate.push({
      id: 'PT-4',
      urgency: 'medium',
      emoji: '💼',
      title: '入职后核查：公司应履行的义务',
      content: '入职后核查清单（公司应做但你需要确认）：\n① 公司是否已为你开立公积金账户？（可在公积金官网查询）\n② 公司是否为你缴纳了五险（养老/医疗/失业/工伤/生育）？\n③ 缴纳基数是否正确（应以实际工资为基数，不能虚报低报）\n\n如发现未依法缴纳，可向天河区人社局投诉。',
    });
  }

  // ────────────────────────────────────────
  // 未来提醒
  // ────────────────────────────────────────

  // PT-5：公积金租房提取
  if (Q1 === 'A') {
    if (Q5 === 'A') {
      future.push({
        id: 'PT-5',
        emoji: '🎉',
        title: '入职满3个月：可以用公积金抵扣租金了',
        content: '你已连续缴存满3个月后，可以把账户里积累的公积金全部提出来用于支付租金。通过"广州住房公积金管理中心"微信公众号→个人业务→提取→租房提取，3个工作日内到账。\n\n有备案租房合同可全额提取实际租金；无备案合同每月上限2000元。',
      });
    } else {
      future.push({
        id: 'PT-5',
        emoji: '💡',
        title: '入职3个月后：记住这件事',
        content: '如果你届时在广州租房居住且无自有住房，可以申请公积金租房提取，把账户里积累的钱全部提出来付租金。\n\n按月薪5000元/10%缴存估算，每月约500元入账，3个月后账户里约有1500元可提取，此后每月持续可提取。这笔钱不主动申请就要等到退休才能取，建议到时记得操作。',
      });
    }
  }

  // Q5==B/C 时，未来提醒中加入租赁备案提示
  if (Q5 === 'B') {
    future.push({
      id: 'PT-3-future',
      emoji: '📋',
      title: '当你签好租房合同后：30天内提醒房东备案',
      content: '当你日后签订租房合同后，记得在30天内提醒房东办理租赁备案。有备案合同申请公积金提取租金时可按实际租金全额提取，无备案合同月上限2000元。',
    });
  } else if (Q5 === 'C') {
    future.push({
      id: 'PT-3-future',
      emoji: '📋',
      title: '签好租房合同后：记得提醒房东办备案',
      content: '当你签好租房合同后，记得在30天内提醒房东办理租赁备案，否则日后公积金提取租金的月上限只有2000元。线上通过穗好办APP或住建局官网办理，免费。',
    });
  }

  // PT-6：居住登记6个月后申请居住证
  if (Q3 !== 'A') {
    future.push({
      id: 'PT-6',
      emoji: '🪪',
      title: '居住登记满6个月：申请居住证',
      content: '完成居住登记满6个月后，通过穗好办APP申请广东省电子居住证（免费）。\n\n持居住证可享受更多公共服务权益，并且是日后积分入户的必要条件。每年须签注续期一次。',
    });
  }

  // 整理输出
  return {
    eligible,
    pending,
    ineligible,
    immediate,
    future,
    housingFallback,
    answers,
  };
}

// ────────────────────────────────────────
// 问卷显示逻辑辅助函数
// ────────────────────────────────────────

export const QUESTIONS = [
  {
    id: 'Q1',
    text: '你目前的就业状态？',
    options: [
      { value: 'A', label: '已拿到天河某企业的正式 offer，准备或已入职（签劳动合同）' },
      { value: 'B', label: '以自由职业 / 接单 / 个体经营方式在天河工作（灵活就业）' },
      { value: 'C', label: '还在找工作，尚未确定去向' },
    ],
  },
  {
    id: 'Q1_5',
    text: '你目前的毕业状态？',
    options: [
      { value: 'A', label: '已毕业（已拿到毕业证）' },
      { value: 'B', label: '还在毕业学年在读，尚未正式毕业' },
    ],
  },
  {
    id: 'Q_age',
    text: '你的年龄区间？',
    options: [
      { value: 'A', label: '18—25 岁' },
      { value: 'B', label: '26—35 岁' },
      { value: 'C', label: '36 岁及以上' },
    ],
  },
  {
    id: 'Q2',
    text: '你的最高学历？',
    options: [
      { value: 'A', label: '大专 / 高职（三年制）' },
      { value: 'B', label: '本科' },
      { value: 'C', label: '硕士及以上' },
    ],
  },
  {
    id: 'Q3',
    text: '你的户籍所在地？',
    options: [
      { value: 'A', label: '广州市' },
      { value: 'B', label: '广东省其他城市（非广州）' },
      { value: 'C', label: '外省（广东省以外）' },
    ],
  },
  {
    id: 'Q4',
    text: '你的家庭情况？',
    condition: (answers) => answers.Q1_5 === 'B',
    options: [
      { value: 'A', label: '普通家庭' },
      { value: 'B', label: '低保家庭 / 零就业家庭 / 防止返贫致贫家庭 / 特困人员 / 持证残疾人 / 曾获国家助学贷款' },
    ],
  },
  {
    id: 'Q5',
    text: '你目前的住所情况？',
    options: [
      { value: 'A', label: '已签租房合同，正在租住' },
      { value: 'B', label: '住在公司宿舍 / 亲友家，无租房合同' },
      { value: 'C', label: '还没找到住处' },
    ],
  },
  {
    id: 'Q6',
    text: '你是否曾在外省/外市正式就业并缴过社保或公积金？',
    condition: (answers) => answers.Q1 === 'A' && answers.Q3 !== 'A',
    options: [
      { value: 'A', label: '有，曾在广东省内其他城市（非广州）缴过' },
      { value: 'B', label: '有，曾在外省缴过' },
      { value: 'C', label: '没有，这是我第一份正式工作' },
    ],
  },
  {
    id: 'Q7',
    text: '你入职的公司类型是？',
    condition: (answers) => answers.Q1 === 'A' && answers.Q2 === 'A' && answers.Q_age !== 'C',
    hint: '（此题仅用于判断住房申请路线，大专+正式就业+35岁以下才会看到）',
    options: [
      { value: 'A', label: '高新技术企业 / 创新标杆企业 / 总部企业 / 高等院校或科研机构' },
      { value: 'B', label: '普通企业（不属于上述类型）' },
      { value: 'C', label: '不清楚公司类型' },
    ],
  },
];

export function getVisibleQuestions(answers) {
  return QUESTIONS.filter(q => !q.condition || q.condition(answers));
}

export function getNextQuestion(currentId, answers) {
  const visible = getVisibleQuestions(answers);
  const idx = visible.findIndex(q => q.id === currentId);
  return idx >= 0 && idx < visible.length - 1 ? visible[idx + 1] : null;
}

export function isComplete(answers) {
  const visible = getVisibleQuestions(answers);
  return visible.every(q => answers[q.id] !== undefined);
}

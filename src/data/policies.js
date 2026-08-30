export const POLICIES = [
  {
    policy_id: "gz_subsidy_job_seeking",
    name: "一次性求职补贴",
    category: "就业补贴",
    authority: "广东省人力资源和社会保障厅 / 广州市人力资源和社会保障局",
    eligibility_text: "须同时满足：①当前为广东省内普通高校/职校/技工院校毕业学年在校生（尚未毕业）；②符合以下之一：低保/零就业/防止返贫致贫家庭成员、特困人员、持证残疾人、曾获国家助学贷款",
    required_docs: ["基本身份证明", "困难情形证明（低保证/残疾人证/助学贷款佐证材料等之一）", "学籍证明"],
    process: "毕业前向所在学校提出申请，由学校汇总提交至所在地人社部门。毕业后无法申请。",
    amount: "3000元，一次性",
    official_url: "https://www.gz.gov.cn/zt/ljgaqngcwqwl/zccs/content/post_10903377.html",
    source_date: "2026年6月17日（粤人社规〔2026〕20号）",
    notes: "⚠️ 仅限在校期间通过学校申请，毕业后不可自行申领。大多数普通家庭毕业生不符合条件。",
    time_cost: "通过学校汇总，通常1-2周内到账"
  },
  {
    policy_id: "gz_subsidy_flexible_employment",
    name: "灵活就业社保补贴",
    category: "就业补贴",
    authority: "广州市人力资源和社会保障局",
    eligibility_text: "须同时满足：①毕业2年内高校毕业生；②已向公共就业服务机构办理灵活就业登记；③以个人身份缴纳职工养老保险和职工医疗保险",
    required_docs: ["身份证明", "毕业证书", "灵活就业状况承诺书（含工作地点、时间、内容、劳动收入）", "医保缴费记录"],
    process: "办理灵活就业登记之日起1年内，向参保地人力资源社会保障部门申请",
    amount: "广州市约800元/月，最长3年",
    official_url: "https://www.gz.gov.cn/zt/ljgaqngcwqwl/zccs/content/post_10903377.html",
    source_date: "2026年6月17日（粤人社规〔2026〕20号）",
    notes: "⚠️ 仅限灵活就业（自由职业/接单）人员，已签劳动合同者不适用。",
    time_cost: "申请后通常3-5个工作日审批"
  },
  {
    policy_id: "gz_subsidy_sme_social_insurance",
    name: "小微企业社保补贴（企业端）",
    category: "就业补贴",
    authority: "广州市人力资源和社会保障局",
    eligibility_text: "补贴给企业而非个人。条件：①用人单位为小微企业；②招用的员工属于毕业2年内高校毕业生；③已签订1年以上劳动合同并缴纳社保",
    required_docs: ["由用人单位申请，毕业生本人需提供毕业证书、身份证明等给公司使用"],
    process: "由用人单位向所在地人社部门申请，首次签订劳动合同之日起2年内提出",
    amount: "按公司实际缴纳的养老、医疗、失业、工伤保险费给予补贴，每人最长2年",
    official_url: "https://www.gz.gov.cn/zt/ljgaqngcwqwl/zccs/content/post_10903377.html",
    source_date: "2026年6月17日（粤人社规〔2026〕20号）",
    notes: "⚠️ 补贴直接给公司，毕业生本人不直接领钱。间接价值：降低小微企业雇用成本，可在求职/薪资谈判中了解公司是否已申请。",
    time_cost: "无需本人操作，由HR处理"
  },
  {
    policy_id: "gz_residence_registration",
    name: "广州市居住登记",
    category: "居住证",
    authority: "广州市公安局 / 天河区各街道镇政务服务中心",
    eligibility_text: "离开常住户口所在地，在广州市行政区域内实际居住的非广州户籍流动人口均须申报居住登记。",
    required_docs: [
      "本人居民身份证原件",
      "居住地址证明原件（以下之一）：房屋租赁合同、房屋产权证明文件、购房合同、房屋出租人/用人单位/就读学校出具的住宿证明、屋主与借住人签订的借住手续证明"
    ],
    process: "线上：微信搜索「粤居码」小程序，扫描居住地址门牌二维码申报；或通过「粤省事」小程序→热门服务→居住登记办理。线下：携材料前往居住地所属街道（镇）政务服务中心窗口办理。",
    time_limit: "到达广州后应尽快办理，居住时长从登记之日起计算",
    fee: "免费",
    official_url: "https://gz.bendibao.com/life/20251125/363922.shtml",
    source_date: "2025年（现行有效）",
    notes: "⚠️ 这是办居住证的前提，居住证的6个月等待期从登记之日起算。越早办登记越早能拿到居住证。",
    time_cost: "线上申报：几分钟；审核1-3个工作日"
  },
  {
    policy_id: "gz_residence_permit",
    name: "广东省电子居住证申领（广州）",
    category: "居住证",
    authority: "广州市公安局",
    eligibility_text: "须同时满足：①已办理广州市居住登记；②居住登记满半年（或满足绿色通道条件）。",
    required_docs: [
      "本人居民身份证",
      "本人照片（线上申请可拍摄上传）",
      "居住地址证明（租房合同、产权证明、单位住宿证明等之一）",
      "就业/住所/就读证明之一：劳动合同或社保缴费记录（就业）；房屋产权证明或租赁合同（住所）；学籍证明或学生证（就读）"
    ],
    process: "【推荐线上】：「穗好办」APP首页→热门服务→居住证→电子居住证申领；或「粤居码」/「粤省事」小程序→居住证→申领居住证。上传材料提交后5个工作日内审核，通过后在「粤居码」查看和亮码使用。",
    validity: "有效期1年，每年须签注1次",
    fee: "电子居住证免费",
    official_url: "https://zsj.gz.gov.cn/zmhd/cjwt/shbapp/content/post_10146719.html",
    source_date: "2025年2月20日（广州市政务服务和数据管理局官方页面）",
    notes: "⚠️ 广州已于2024年1月16日全面切换为电子居住证，在「粤居码」查看亮码即可。",
    time_cost: "线上申请5个工作日审核"
  },
  {
    policy_id: "gz_pension_transfer",
    name: "企业职工基本养老保险转移接续（转入广州）",
    category: "社保转移",
    authority: "广州市人力资源和社会保障局",
    who_needs_this: "曾在广东省外正式就业并缴纳养老保险、现在来广州就业的人员。",
    eligibility_text: "须同时满足：①已在广州参加企业职工基本养老保险；②原参保地为广东省外其他省市。",
    required_docs: [
      "线上办理全程免材料，身份核验通过即可",
      "线下办理：本人身份证原件"
    ],
    process: "【全程线上，推荐】：可通过国家社会保险公共服务平台（网页或APP）；电子社保卡APP；掌上12333 APP；广东政务服务网→搜索「养老保险关系转移」申请。",
    urgency: "不紧迫。官方明确提示「可在退休前一两年集中办理」。",
    official_url: "https://www.gz.gov.cn/zwfw/zxfw/sbfw/content/post_9943025.html",
    source_date: "2024年10月25日",
    notes: "广东省内（如从深圳、佛山来广州）：完全无需操作，系统自动接续。",
    time_cost: "提交申请后2-4周完成"
  },
  {
    policy_id: "gz_medical_insurance_transfer",
    name: "基本医疗保险关系转移接续（转入广州）",
    category: "社保转移",
    authority: "广州市医疗保险服务中心",
    who_needs_this: "曾在广东省外正式就业并缴纳职工医保、现在来广州就业的人员。建议尽早办理，个人账户余额转入后可直接在广州刷卡使用。",
    eligibility_text: "须同时满足：①未达法定退休年龄；②已在广州参加职工基本医疗保险；③原参保地有医保关系及个人账户余额需转入。",
    required_docs: [
      "本人身份证",
      "广州市医保凭证（社保卡）",
      "（线上办理可免材料，通过身份核验后直接提交）"
    ],
    process: "【推荐线上】：通过国家医保服务平台APP→关系转移；「粤医保」微信小程序；广东政务服务网申请。",
    urgency: "建议入职广州、拿到广州社保卡后尽快办理。",
    official_url: "https://www.nhsa.gov.cn/art/2025/6/18/art_14_16894.html",
    source_date: "2025年6月18日",
    notes: "咨询电话：广州医保服务热线 12345 转医保；或直接拨打 12393。",
    time_cost: "约1个月全程完成"
  },
  {
    policy_id: "gz_unemployment_insurance_transfer",
    name: "失业保险关系转移接续（转入广州）",
    category: "社保转移",
    authority: "广州市人力资源和社会保障局",
    who_needs_this: "曾在广东省外正式就业并缴纳失业保险、现在来广州就业的人员。",
    eligibility_text: "原参保地为广东省外（省内各市之间失业保险关系随同转移，无需办理）。",
    required_docs: [
      "向原参保地社保经办机构申请开具《失业保险参保凭证》",
      "本人身份证",
      "凭《失业保险参保凭证》到广州市天河区社保经办机构申请转入"
    ],
    process: "第一步：联系原参保地社保经办机构取得《失业保险参保凭证》。第二步：携凭证及身份证前往广州市天河区社会保险基金管理局申请转入。",
    urgency: "相对不紧迫。失业保险缴费年限全国累计计算，暂时不转不影响缴费年限记录。",
    official_url: "https://rsj.gz.gov.cn/",
    source_date: "2025年（现行政策）",
    notes: "⚠️ 如需在广州申领失业保险金时须已完成转入。",
    time_cost: "2-4周"
  },
  {
    policy_id: "gz_new_employee_housing_individual",
    name: "新就业无房职工公共租赁住房（个人申请）",
    category: "住房保障",
    who_qualifies: "本科及以上学历 OR 技师/高级技师职业资格证书持有者；大专学历不符合此路线。",
    eligibility_text: "须同时满足：①18周岁以上、35周岁以下；②本科及以上学历且获得相应学位，或具有技师、高级技师职业资格证书；③本人、配偶及未成年子女在广州市无自有产权住房，且未享受公共租赁住房保障；④在广州市工作，连续缴纳五险满半年以上。",
    required_docs: [
      "广州市公共租赁住房保障申请表",
      "身份证",
      "学历证书复印件",
      "劳动合同",
      "工作单位证明（含社保缴费确认）",
      "诚信承诺书",
      "广州市自然人不动产信息查询结果（有效期一个月内）",
      "广州市无享受政策性住房证明（有效期一个月内）"
    ],
    process: "向就业地或居住地住房保障部门提出申请，由用人单位对劳动合同和社保材料予以确认。具体批次申请时间由广州市住建局另行公告，非常态化开放。",
    rent_standard: "低于市场价，具体以当批次公告为准",
    official_url: "https://zfcj.gz.gov.cn/gkmlpt/content/10/10037/post_10037548.html",
    source_date: "2025年3月1日（新办法生效，有效期5年至2030年）",
    notes: "⚠️ 大专学历不符合个人申请路线。申请批次不定期开放，需关注官方公告。",
    time_cost: "需等待公告批次，通常数月"
  },
  {
    policy_id: "gz_new_employee_housing_unit",
    name: "新就业无房职工公共租赁住房（单位整体租赁）",
    category: "住房保障",
    who_qualifies: "任何学历均可，但必须由符合资质的用人单位代为申请。",
    eligibility_text: "员工须同时满足：①为用人单位在职员工（有劳动合同或劳务派遣协议）；②年龄18-35周岁；③本人、配偶及未成年子女在广州市无自有产权住房，且未享受公共租赁住房保障。\n\n用人单位须满足：注册地在天河区，具有法人资格，且属于高新技术企业、创新标杆企业、高等院校、科研机构等类型（第一类优先），或其他法人单位（第二类）。",
    required_docs: [
      "【由公司统一提交，员工无需独立申请】",
      "员工需向HR提供：社保缴纳证明、身份证复印件、广州市自然人不动产信息查询结果（一个月内有效）、广州市无享受政策性住房证明、结婚证（已婚者）"
    ],
    process: "由用人单位向区住建部门提出整体租赁申请，员工无法独立申请。员工应主动向HR了解公司是否参与申请，并在公司汇总申请材料时提供个人资料。",
    rent_standard: "天河区广氮生活区（2026年最新批次）：35元/㎡/月，远低于市场价",
    supply_warning: "⚠️ 供应量极度有限。2026年天河区全区仅推出6套，且按先到先得+第一类单位优先原则分配。此为不定期批次，不保证每年均有供应。",
    official_url: "http://www.thnet.gov.cn/thqzdlyxxgkzl/zfbz/bzxzffphtcxx/content/post_10847169.html",
    source_date: "2026年6月8日（天河区住建园林局官方通告，现行有效）",
    notes: "咨询电话：020-85543791（业务咨询）。监督电话：12345。",
    time_cost: "需等待单位统一申报批次"
  },
  {
    policy_id: "th_talent_apartment",
    name: "天河区人才公寓申请",
    category: "住房保障",
    who_qualifies: "本科及以上学历 OR 中级及以上职称，或纳税达标；通过用人单位申请，不支持个人直接申请。",
    eligibility_text: "员工须同时满足：①在天河区用人单位工作；②本人、配偶及未成年子女在广州市无自有产权住房，且未享受公共租赁住房保障；③满足以下学历/职称/纳税条件之一：大学本科及以上学历、中级及以上职称证书，或上年度个人所得税纳税清单（金额门槛以具体批次公告为准）。",
    required_docs: [
      "【由公司统一收集提交】",
      "员工个人需提供：天河区人才公寓申请表（个人）、无房及未享受住房保障承诺书、学历证书/职称证书或纳税清单、身份证"
    ],
    process: "以公司为单位统一申报，个人不可直接申请。人才公寓申请不定期开放，以天河区政府官方公告为准。",
    supply_warning: "⚠️ 供应量极度有限。历史批次约100-200套，面向天河全区所有符合条件企业的员工，竞争激烈。",
    official_url: "http://www.thnet.gov.cn/thqzdlyxxgkzl/zfbz/bzxzffphtcxx/content/post_10393698.html",
    source_date: "2025年8月11日（最近一次受理通告）",
    notes: "⚠️ 大专学历若无纳税清单满足要求，则不符合条件。建议向HR确认公司是否参与过人才公寓申报。",
    time_cost: "需等待公司统一申报批次"
  },
  {
    policy_id: "gz_rental_contract_registration",
    name: "广州市房屋租赁合同登记备案",
    category: "租赁备案",
    authority: "广州市住房和城乡建设局 / 房屋所在地街道办事处或镇人民政府",
    role_in_product: "主动提醒型：法律义务在房东，但与租客的居住登记和居住证办理直接相关，租客应在签合同后30天内主动提醒房东办理。",
    eligibility_text: "主要责任方为出租人（房东）。如房东不积极配合，承租人（租客）可单方申请办理。",
    required_docs_online: [
      "租赁双方身份证明（出租人+承租人）",
      "房屋权属证明（房产证、购房合同等）",
      "房屋租赁合同"
    ],
    process: "【线上办理（推荐）】穗好办APP：首页→民生一站式服务→住建服务→房屋租赁登记备案；或广州市住建局官网（https://zfcj.gz.gov.cn）→阳光家缘→房屋租赁管理。\n\n【线下备选】携带材料前往房屋所在地街道办事处/镇政府来穗人员和出租屋服务管理中心窗口办理。",
    output: "《广州市房屋租赁合同登记备案证明》，可在线上自行打印",
    fee: "免费",
    why_tenant_should_care: "①有备案的合同在公积金租房提取时可按实际租金全额提取，无备案合同月上限2000元；②保护租客权益，发生纠纷时备案证明具有法律效力。",
    official_url: "https://zfcj.gz.gov.cn/zfcj/ygjy",
    source_date: "2021年12月1日施行（2026年前有效）",
    notes: "⚠️ 签合同后30天内完成，否则影响公积金提取额度。咨询电话：020-83301618。",
    time_cost: "线上当场提交，1-3个工作日审核"
  },
  {
    policy_id: "gz_provident_fund_enrollment",
    name: "广州住房公积金账户开立（单位代办）",
    category: "公积金",
    authority: "广州市住房和公积金管理中心",
    who_does_it: "用人单位（HR），不是员工本人",
    eligibility_text: "凡在广州合法用人单位就业的职工，用人单位有法定义务在职工入职之日起30日内为其办理住房公积金账户开立并缴存。",
    required_action_by_employee: "入职后向HR确认公积金开户状态，可通过广州住房公积金管理中心官网查询（https://gjj.gz.gov.cn）",
    contribution_standard: "2025年7月1日至2026年6月30日度：缴存基数为职工本人2024年度月均工资，下限2500元，上限以公积金中心公布为准。单位和个人各缴存5%至12%，共计10%-24%。",
    official_url: "https://gjj.gz.gov.cn",
    source_date: "2026年（现行政策，每年7月1日调整缴存基数）",
    notes: "⚠️ 部分中小企业或非正规雇主未依法为员工缴纳公积金。入职后应明确询问HR。",
    time_cost: "无需本人操作，HR应在入职30天内完成"
  },
  {
    policy_id: "gz_provident_fund_rent_withdrawal",
    name: "广州住房公积金租房提取",
    category: "公积金",
    authority: "广州市住房和公积金管理中心",
    who_needs_this: "在广州租房居住、本人及配偶和未成年子女在广州均无自有产权住房的缴存职工。",
    eligibility_text: "须同时满足：①本人账户处于缴存状态；②本人、配偶及未成年子女在广州市行政区域内均无自有产权住房；③在广州租房自住；④已连续足额缴存住房公积金满3个月（不含补缴）。",
    withdrawal_limit: "有效备案租赁合同：提取额度不超过实际已支付租金；无备案合同：每人每月最高可提取2000元。每次申请可一次性提取多个月的累计金额。",
    required_docs: [
      "【线上申请，免材料】通过广州住房公积金管理中心官网或微信公众号提出申请，系统联网核验信息",
      "【线下办理所需材料】：本人身份证、租赁合同（建议已备案）"
    ],
    process: "【推荐线上：全程3个工作日内到账】关注「广州住房公积金管理中心」微信公众号→个人业务→提取→租房提取→按提示填写租赁信息并提交；或登录中心官网→个人业务→提取办理→在线申请",
    practical_tip: "💡 一个应届生每月公司和个人合计缴存公积金约为月薪的10%-24%，例如月薪6000元按10%缴存则每月入账600元，3个月后账户里约有1800元可提出用于支付租金，此后每月持续可提取。这笔钱不主动申请就要等到退休才能取，建议积极提取。",
    official_url: "https://gjj.gz.gov.cn/bsfw/qtfw/content/post_6998160.html",
    source_date: "2025年（现行政策）",
    notes: "⚠️ 租赁合同是否登记备案会影响提取额度上限，有备案合同按实际租金提取，无备案合同上限2000元/月。",
    time_cost: "审批后3个工作日内到账"
  },
  {
    policy_id: "gz_provident_fund_transfer_in",
    name: "广州住房公积金异地账户转入",
    category: "公积金",
    authority: "广州市住房和公积金管理中心",
    who_needs_this: "在广州入职前已在外省/外市有过正式住房公积金缴存的人员。大多数纯应届毕业生不适用此条。",
    eligibility_text: "须同时满足：①已在广州住房公积金管理中心开立个人账户；②提出申请前12个月内，至少有6个自然月在广州正常缴存住房公积金；③在原工作地（外省市）已设立账户并缴存满6个月。",
    process: "【线上（推荐）】：关注「广州住房公积金管理中心」微信公众号→首页→查看全部→异地账户转入→按提示操作，系统自动通知转出地中心处理。",
    time_advice: "不紧迫。可在广州稳定缴存满6个月后再办理。",
    official_url: "https://www.gz.gov.cn/zwfw/zxfw/zffw/content/post_8761818.html",
    source_date: "2023年1月（持续有效）",
    notes: "广东省内各市（深圳、佛山等）转入广州：同样需要按上述条件办理，省内无自动接续机制（与养老保险不同）。",
    time_cost: "约2-3周全程完成"
  }
];

export function getPolicyById(id) {
  return POLICIES.find(p => p.policy_id === id);
}

export function getPoliciesByIds(ids) {
  return ids.map(id => getPolicyById(id)).filter(Boolean);
}

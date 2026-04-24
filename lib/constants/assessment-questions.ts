import type { AssessmentQuestion } from "@/lib/types/care-plan";

export const ASSESSMENT_CATEGORIES = [
  { id: "adl", name: "日常生活活动能力 (ADL)", icon: "activity" },
  { id: "cognitive", name: "认知与精神状态", icon: "brain" },
  { id: "sensory", name: "感知功能", icon: "eye" },
  { id: "physical", name: "身体健康指标", icon: "heart" },
  { id: "nutrition", name: "营养与饮食", icon: "utensils" },
  { id: "social", name: "社会与心理", icon: "users" },
  { id: "special", name: "特殊护理需求", icon: "stethoscope" },
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // A. 日常生活活动能力 (ADL) - 8项
  {
    id: "mobility",
    category: "adl",
    question: "移动能力",
    type: "single",
    options: [
      { value: "independent", label: "完全独立" },
      { value: "assistive_device", label: "需辅助器具（如拐杖、助行器）" },
      { value: "human_assist", label: "需人搀扶" },
      { value: "wheelchair", label: "使用轮椅" },
      { value: "bedridden", label: "长期卧床" },
    ],
  },
  {
    id: "eating",
    category: "adl",
    question: "进食能力",
    type: "single",
    options: [
      { value: "independent", label: "完全自理" },
      { value: "need_cutting", label: "需将食物切碎" },
      { value: "need_feeding", label: "需他人喂食" },
      { value: "tube_feeding", label: "鼻饲/胃管喂养" },
    ],
  },
  {
    id: "dressing",
    category: "adl",
    question: "穿衣能力",
    type: "single",
    options: [
      { value: "independent", label: "完全自理" },
      { value: "partial_assist", label: "需部分协助" },
      { value: "full_depend", label: "完全依赖他人" },
    ],
  },
  {
    id: "toileting",
    category: "adl",
    question: "如厕能力",
    type: "single",
    options: [
      { value: "independent", label: "完全自理" },
      { value: "need_assist", label: "需扶助" },
      { value: "bedpan", label: "使用便盆/便椅" },
      { value: "diaper", label: "使用尿布/纸尿裤" },
    ],
  },
  {
    id: "bathing",
    category: "adl",
    question: "洗浴能力",
    type: "single",
    options: [
      { value: "independent", label: "完全自理" },
      { value: "partial_assist", label: "需部分协助" },
      { value: "full_depend", label: "完全依赖他人" },
    ],
  },
  {
    id: "hygiene",
    category: "adl",
    question: "个人卫生（刷牙、洗脸、梳头等）",
    type: "single",
    options: [
      { value: "independent", label: "完全自理" },
      { value: "need_reminder", label: "需提醒" },
      { value: "need_assist", label: "需协助完成" },
    ],
  },
  {
    id: "bed_mobility",
    category: "adl",
    question: "床上移动能力",
    type: "single",
    options: [
      { value: "independent", label: "可独立翻身" },
      { value: "need_assist", label: "需协助翻身" },
      { value: "unable", label: "完全不能翻身" },
    ],
  },
  {
    id: "stairs",
    category: "adl",
    question: "上下楼梯能力",
    type: "single",
    options: [
      { value: "independent", label: "独立完成" },
      { value: "need_handrail", label: "需扶扶手" },
      { value: "need_assist", label: "需人搀扶" },
      { value: "unable", label: "无法完成" },
    ],
  },

  // B. 认知与精神状态 - 7项
  {
    id: "orientation",
    category: "cognitive",
    question: "定向力（对时间、地点、人物的认知）",
    type: "single",
    options: [
      { value: "clear", label: "完全清晰" },
      { value: "time_confused", label: "时间混乱" },
      { value: "place_confused", label: "地点混乱" },
      { value: "person_confused", label: "人物混乱" },
      { value: "all_confused", label: "完全混乱" },
    ],
  },
  {
    id: "memory",
    category: "cognitive",
    question: "记忆力状况",
    type: "single",
    options: [
      { value: "normal", label: "正常" },
      { value: "recent_decline", label: "近期记忆下降" },
      { value: "remote_decline", label: "远期记忆下降" },
      { value: "severe_impairment", label: "严重记忆障碍" },
    ],
  },
  {
    id: "communication",
    category: "cognitive",
    question: "沟通能力",
    type: "single",
    options: [
      { value: "normal", label: "正常交流" },
      { value: "express_difficulty", label: "表达困难" },
      { value: "understand_difficulty", label: "理解困难" },
      { value: "unable", label: "无法沟通" },
    ],
  },
  {
    id: "emotion",
    category: "cognitive",
    question: "情绪状态",
    type: "single",
    options: [
      { value: "stable", label: "情绪稳定" },
      { value: "anxious", label: "易焦虑" },
      { value: "depressed", label: "易抑郁" },
      { value: "irritable", label: "易激动" },
      { value: "apathetic", label: "情感淡漠" },
    ],
  },
  {
    id: "sleep",
    category: "cognitive",
    question: "睡眠质量",
    type: "single",
    options: [
      { value: "good", label: "睡眠良好" },
      { value: "difficulty_falling", label: "入睡困难" },
      { value: "easy_wake", label: "易醒/多梦" },
      { value: "reversed", label: "日夜颠倒" },
      { value: "need_medication", label: "需药物辅助" },
    ],
  },
  {
    id: "behavior",
    category: "cognitive",
    question: "行为问题",
    type: "multiple",
    options: [
      { value: "none", label: "无明显行为问题" },
      { value: "wandering", label: "游走行为" },
      { value: "aggressive", label: "攻击性行为" },
      { value: "repetitive", label: "重复性行为" },
      { value: "refuse_care", label: "拒绝照护" },
    ],
  },
  {
    id: "decision",
    category: "cognitive",
    question: "决策能力",
    type: "single",
    options: [
      { value: "autonomous", label: "完全自主决策" },
      { value: "simple_assist", label: "需协助简单决策" },
      { value: "all_assist", label: "需协助所有决策" },
      { value: "unable", label: "无法参与决策" },
    ],
  },

  // C. 感知功能 - 4项
  {
    id: "vision",
    category: "sensory",
    question: "视力状况",
    type: "single",
    options: [
      { value: "normal", label: "正常" },
      { value: "mild_decline", label: "轻度下降（可阅读）" },
      { value: "moderate_decline", label: "中度下降（可辨认人脸）" },
      { value: "severe_decline", label: "严重下降/失明" },
    ],
  },
  {
    id: "hearing",
    category: "sensory",
    question: "听力状况",
    type: "single",
    options: [
      { value: "normal", label: "正常" },
      { value: "mild_decline", label: "轻度下降" },
      { value: "hearing_aid", label: "需佩戴助听器" },
      { value: "severe_decline", label: "严重下降/失聪" },
    ],
  },
  {
    id: "speech",
    category: "sensory",
    question: "语言能力",
    type: "single",
    options: [
      { value: "clear", label: "发音清晰" },
      { value: "slurred", label: "含糊不清" },
      { value: "aphasia", label: "失语" },
    ],
  },
  {
    id: "pain",
    category: "sensory",
    question: "疼痛情况",
    type: "single",
    options: [
      { value: "none", label: "无疼痛" },
      { value: "mild", label: "轻度（可忍受）" },
      { value: "moderate", label: "中度（影响生活）" },
      { value: "severe", label: "重度（需止痛药）" },
    ],
  },

  // D. 身体健康指标 - 5项
  {
    id: "skin",
    category: "physical",
    question: "皮肤状况",
    type: "single",
    options: [
      { value: "intact", label: "完好" },
      { value: "dry", label: "干燥/脱屑" },
      { value: "risk", label: "有压疮风险" },
      { value: "pressure_ulcer", label: "已有压疮" },
    ],
  },
  {
    id: "swallowing",
    category: "physical",
    question: "吞咽功能",
    type: "single",
    options: [
      { value: "normal", label: "正常" },
      { value: "occasional_choke", label: "偶尔呛咳" },
      { value: "frequent_choke", label: "经常呛咳" },
      { value: "severe_impairment", label: "严重吞咽障碍" },
    ],
  },
  {
    id: "bowel",
    category: "physical",
    question: "排便情况",
    type: "single",
    options: [
      { value: "normal", label: "规律正常" },
      { value: "occasional_constipation", label: "偶尔便秘" },
      { value: "frequent_constipation", label: "经常便秘" },
      { value: "incontinence", label: "大便失禁" },
    ],
  },
  {
    id: "urinary",
    category: "physical",
    question: "排尿情况",
    type: "single",
    options: [
      { value: "normal", label: "正常控制" },
      { value: "frequent", label: "尿频" },
      { value: "urgent", label: "尿急" },
      { value: "incontinence", label: "尿失禁" },
      { value: "catheter", label: "留置导尿管" },
    ],
  },
  {
    id: "fall_risk",
    category: "physical",
    question: "跌倒风险评估",
    type: "single",
    options: [
      { value: "low", label: "低风险" },
      { value: "medium", label: "中等风险" },
      { value: "high", label: "高风险" },
    ],
  },

  // E. 营养与饮食 - 4项
  {
    id: "appetite",
    category: "nutrition",
    question: "食欲状况",
    type: "single",
    options: [
      { value: "normal", label: "食欲正常" },
      { value: "decreased", label: "食欲减退" },
      { value: "anorexia", label: "厌食" },
    ],
  },
  {
    id: "diet_restriction",
    category: "nutrition",
    question: "饮食限制",
    type: "multiple",
    options: [
      { value: "none", label: "无特殊限制" },
      { value: "low_salt", label: "低盐饮食" },
      { value: "low_sugar", label: "低糖饮食" },
      { value: "low_fat", label: "低脂饮食" },
      { value: "soft", label: "软食" },
      { value: "liquid", label: "流质/半流质" },
    ],
  },
  {
    id: "drinking",
    category: "nutrition",
    question: "饮水能力",
    type: "single",
    options: [
      { value: "independent", label: "可自主饮水" },
      { value: "need_reminder", label: "需提醒饮水" },
      { value: "need_assist", label: "需协助饮水" },
    ],
  },
  {
    id: "weight_change",
    category: "nutrition",
    question: "近期体重变化",
    type: "single",
    options: [
      { value: "stable", label: "体重稳定" },
      { value: "increased", label: "近期体重增加" },
      { value: "decreased", label: "近期体重减轻" },
    ],
  },

  // F. 社会与心理 - 4项
  {
    id: "social",
    category: "social",
    question: "社交意愿",
    type: "single",
    options: [
      { value: "active", label: "积极参与社交活动" },
      { value: "passive", label: "被动参与" },
      { value: "avoid", label: "回避社交" },
      { value: "refuse", label: "拒绝社交" },
    ],
  },
  {
    id: "family_support",
    category: "social",
    question: "家庭支持程度",
    type: "single",
    options: [
      { value: "good", label: "家庭支持良好" },
      { value: "average", label: "支持一般" },
      { value: "insufficient", label: "支持不足" },
      { value: "none", label: "无家庭支持" },
    ],
  },
  {
    id: "economic",
    category: "social",
    question: "经济状况",
    type: "single",
    options: [
      { value: "sufficient", label: "经济充足" },
      { value: "basic", label: "基本保障" },
      { value: "tight", label: "较为紧张" },
    ],
  },
  {
    id: "religion",
    category: "social",
    question: "宗教信仰/文化需求",
    type: "single",
    options: [
      { value: "has_religion", label: "有特定信仰（需尊重）" },
      { value: "no_specific", label: "无特定要求" },
    ],
  },

  // G. 特殊护理需求 - 3项
  {
    id: "oxygen",
    category: "special",
    question: "氧气依赖程度",
    type: "single",
    options: [
      { value: "none", label: "无需吸氧" },
      { value: "intermittent", label: "间断吸氧" },
      { value: "continuous", label: "持续吸氧" },
    ],
  },
  {
    id: "special_equipment",
    category: "special",
    question: "使用的特殊设备",
    type: "multiple",
    options: [
      { value: "none", label: "无" },
      { value: "hearing_aid", label: "助听器" },
      { value: "dentures", label: "假牙" },
      { value: "ostomy", label: "造口袋" },
      { value: "ventilator", label: "呼吸机" },
      { value: "pacemaker", label: "心脏起搏器" },
    ],
  },
  {
    id: "rehabilitation",
    category: "special",
    question: "康复训练需求",
    type: "multiple",
    options: [
      { value: "none", label: "无特殊康复需求" },
      { value: "physical", label: "肢体康复训练" },
      { value: "speech", label: "语言康复训练" },
      { value: "cognitive", label: "认知功能训练" },
      { value: "occupational", label: "作业疗法" },
    ],
  },
];

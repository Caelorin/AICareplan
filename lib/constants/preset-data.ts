import type { ElderInfo, AssessmentResult } from "@/lib/types/care-plan";

export interface PresetCase {
  id: string;
  name: string;
  description: string;
  elderInfo: Partial<ElderInfo>;
  assessmentResult: AssessmentResult;
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: "case-1",
    name: "案例一：张奶奶（轻度失能）",
    description: "78岁女性，高血压糖尿病史，髋关节置换术后，轻度认知下降",
    elderInfo: {
      name: "张奶奶",
      age: 78,
      gender: "female",
      height: 158,
      weight: 52,
      diagnosis: "高血压、2型糖尿病、轻度认知障碍",
      medicalHistory: "2020年右髋关节置换术，2018年轻度脑梗塞",
      medications: "阿司匹林100mg每日一次、二甲双胍500mg每日两次、氨氯地平5mg每日一次",
      allergies: "青霉素过敏",
      primaryCaregiver: "女儿（每周探望2-3次）",
      livingEnvironment: "institution",
    },
    assessmentResult: {
      // A. 日常生活活动能力 (ADL)
      mobility: "assistive_device",
      eating: "independent",
      dressing: "partial_assist",
      toileting: "need_assist",
      bathing: "partial_assist",
      hygiene: "need_reminder",
      bed_mobility: "independent",
      stairs: "need_handrail",
      // B. 认知与精神状态
      orientation: "time_confused",
      memory: "recent_decline",
      communication: "normal",
      emotion: "stable",
      sleep: "easy_wake",
      behavior: ["none"],
      decision: "simple_assist",
      // C. 感知功能
      vision: "mild_decline",
      hearing: "normal",
      speech: "clear",
      pain: "mild",
      // D. 身体健康指标
      skin: "dry",
      swallowing: "normal",
      bowel: "occasional_constipation",
      urinary: "normal",
      fall_risk: "high",
      // E. 营养与饮食
      appetite: "normal",
      diet_restriction: ["low_salt", "low_sugar"],
      drinking: "need_reminder",
      weight_change: "stable",
      // F. 社会与心理
      social: "passive",
      family_support: "average",
      economic: "basic",
      religion: "no_specific",
      // G. 特殊护理需求
      oxygen: "none",
      special_equipment: ["dentures"],
      rehabilitation: ["physical"],
    },
  },
  {
    id: "case-2",
    name: "案例二：李爷爷（中度失能）",
    description: "85岁男性，帕金森病史，吞咽困难，需全面照护",
    elderInfo: {
      name: "李爷爷",
      age: 85,
      gender: "male",
      height: 168,
      weight: 58,
      diagnosis: "帕金森病（中期）、吞咽困难、骨质疏松",
      medicalHistory: "2015年确诊帕金森病，2022年腰椎压缩性骨折",
      medications: "美多芭250mg每日三次、普拉克索0.25mg每日三次、钙尔奇D每日一次",
      allergies: "无已知过敏",
      primaryCaregiver: "护工24小时陪护",
      livingEnvironment: "institution",
    },
    assessmentResult: {
      // A. 日常生活活动能力 (ADL)
      mobility: "wheelchair",
      eating: "need_cutting",
      dressing: "full_depend",
      toileting: "bedpan",
      bathing: "full_depend",
      hygiene: "need_assist",
      bed_mobility: "need_assist",
      stairs: "unable",
      // B. 认知与精神状态
      orientation: "clear",
      memory: "recent_decline",
      communication: "express_difficulty",
      emotion: "depressed",
      sleep: "difficulty_falling",
      behavior: ["none"],
      decision: "simple_assist",
      // C. 感知功能
      vision: "mild_decline",
      hearing: "mild_decline",
      speech: "slurred",
      pain: "moderate",
      // D. 身体健康指标
      skin: "risk",
      swallowing: "frequent_choke",
      bowel: "frequent_constipation",
      urinary: "urgent",
      fall_risk: "high",
      // E. 营养与饮食
      appetite: "decreased",
      diet_restriction: ["soft"],
      drinking: "need_assist",
      weight_change: "decreased",
      // F. 社会与心理
      social: "avoid",
      family_support: "good",
      economic: "sufficient",
      religion: "no_specific",
      // G. 特殊护理需求
      oxygen: "none",
      special_equipment: ["hearing_aid"],
      rehabilitation: ["physical", "speech"],
    },
  },
  {
    id: "case-3",
    name: "案例三：王奶奶（认知障碍）",
    description: "82岁女性，阿尔茨海默病中期，有走失风险",
    elderInfo: {
      name: "王奶奶",
      age: 82,
      gender: "female",
      height: 155,
      weight: 48,
      diagnosis: "阿尔茨海默病（中期）、高血压",
      medicalHistory: "2019年确诊阿尔茨海默病，高血压病史20年",
      medications: "多奈哌齐5mg每日一次、美金刚10mg每日两次、氨氯地平5mg每日一次",
      allergies: "磺胺类药物过敏",
      primaryCaregiver: "儿子儿媳轮流照护",
      livingEnvironment: "with_family",
    },
    assessmentResult: {
      // A. 日常生活活动能力 (ADL)
      mobility: "independent",
      eating: "independent",
      dressing: "partial_assist",
      toileting: "need_assist",
      bathing: "partial_assist",
      hygiene: "need_reminder",
      bed_mobility: "independent",
      stairs: "need_handrail",
      // B. 认知与精神状态
      orientation: "place_confused",
      memory: "severe_impairment",
      communication: "express_difficulty",
      emotion: "anxious",
      sleep: "reversed",
      behavior: ["wandering", "repetitive"],
      decision: "all_assist",
      // C. 感知功能
      vision: "mild_decline",
      hearing: "normal",
      speech: "clear",
      pain: "none",
      // D. 身体健康指标
      skin: "intact",
      swallowing: "normal",
      bowel: "normal",
      urinary: "incontinence",
      fall_risk: "medium",
      // E. 营养与饮食
      appetite: "normal",
      diet_restriction: ["low_salt"],
      drinking: "need_reminder",
      weight_change: "stable",
      // F. 社会与心理
      social: "passive",
      family_support: "good",
      economic: "basic",
      religion: "has_religion",
      // G. 特殊护理需求
      oxygen: "none",
      special_equipment: ["none"],
      rehabilitation: ["cognitive"],
    },
  },
  {
    id: "case-4",
    name: "案例四：赵爷爷（重度失能）",
    description: "90岁男性，脑卒中后遗症，卧床状态，需全面护理",
    elderInfo: {
      name: "赵爷爷",
      age: 90,
      gender: "male",
      height: 172,
      weight: 55,
      diagnosis: "脑卒中后遗症（左侧偏瘫）、高血压、冠心病、2型糖尿病",
      medicalHistory: "2021年大面积脑梗塞，长期高血压、冠心病史，2型糖尿病15年",
      medications: "阿司匹林100mg每日一次、氯吡格雷75mg每日一次、阿托伐他汀20mg每晚、胰岛素诺和灵30R早16U晚10U",
      allergies: "头孢类抗生素过敏",
      primaryCaregiver: "专业护工24小时照护",
      livingEnvironment: "institution",
    },
    assessmentResult: {
      // A. 日常生活活动能力 (ADL)
      mobility: "bedridden",
      eating: "need_feeding",
      dressing: "full_depend",
      toileting: "diaper",
      bathing: "full_depend",
      hygiene: "need_assist",
      bed_mobility: "unable",
      stairs: "unable",
      // B. 认知与精神状态
      orientation: "time_confused",
      memory: "recent_decline",
      communication: "understand_difficulty",
      emotion: "depressed",
      sleep: "need_medication",
      behavior: ["refuse_care"],
      decision: "unable",
      // C. 感知功能
      vision: "moderate_decline",
      hearing: "hearing_aid",
      speech: "aphasia",
      pain: "severe",
      // D. 身体健康指标
      skin: "pressure_ulcer",
      swallowing: "severe_impairment",
      bowel: "incontinence",
      urinary: "catheter",
      fall_risk: "high",
      // E. 营养与饮食
      appetite: "anorexia",
      diet_restriction: ["liquid", "low_salt", "low_sugar"],
      drinking: "need_assist",
      weight_change: "decreased",
      // F. 社会与心理
      social: "refuse",
      family_support: "average",
      economic: "tight",
      religion: "no_specific",
      // G. 特殊护理需求
      oxygen: "intermittent",
      special_equipment: ["hearing_aid", "dentures"],
      rehabilitation: ["physical", "speech"],
    },
  },
];

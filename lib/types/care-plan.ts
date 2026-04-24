// 老人基本信息
export interface ElderInfo {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  diagnosis: string;
  medicalHistory: string;
  allergies: string;
  medications: string;
  primaryCaregiver: string;
  livingEnvironment: "alone" | "with_family" | "institution";
}

// 评估问题选项
export interface AssessmentOption {
  value: string;
  label: string;
}

// 评估问题
export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  options: AssessmentOption[];
  type: "single" | "multiple";
}

// 评估结果
export interface AssessmentResult {
  [questionId: string]: string | string[];
}

// 照护项目
export interface CarePlanItem {
  category: string;
  title: string;
  goal: string;
  measures: string[];
  rationale: string;
  precautions: string;
  evaluationFrequency: string;
}

// 完整照护方案
export interface CarePlan {
  id: string;
  createdAt: string;
  elderInfo: ElderInfo;
  assessmentResult: AssessmentResult;
  carePlanItems: CarePlanItem[];
  rawAIResponse: string;
}

// 照护类别
export interface CareCategory {
  id: string;
  name: string;
  items: string[];
}

import type { CareCategory } from "@/lib/types/care-plan";

export const CARE_CATEGORIES: CareCategory[] = [
  {
    id: "daily_living",
    name: "日常生活照护",
    items: ["起居照护", "饮食照护", "排泄照护", "清洁照护", "穿着照护"],
  },
  {
    id: "medical",
    name: "医疗护理",
    items: [
      "用药管理",
      "生命体征监测",
      "伤口/造口护理",
      "疼痛管理",
      "康复训练指导",
    ],
  },
  {
    id: "psychological",
    name: "心理与社会支持",
    items: ["情绪支持与心理疏导", "认知刺激活动", "社交活动安排", "精神慰藉"],
  },
  {
    id: "safety",
    name: "安全管理",
    items: ["跌倒预防", "压疮预防", "误吸预防", "走失预防", "环境安全评估"],
  },
  {
    id: "nutrition",
    name: "营养管理",
    items: ["膳食计划制定", "营养状况监测", "饮水管理"],
  },
  {
    id: "special",
    name: "特殊护理",
    items: ["临终关怀", "专科护理"],
  },
];

export const ALL_CARE_ITEMS = CARE_CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({
    category: cat.name,
    categoryId: cat.id,
    item,
  }))
);

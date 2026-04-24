import type { CarePlan } from "@/lib/types/care-plan";

const STORAGE_KEY = "elderly_care_plans";

export function getCarePlans(): CarePlan[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveCarePlan(plan: CarePlan): void {
  const plans = getCarePlans();
  plans.unshift(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function getCarePlanById(id: string): CarePlan | null {
  const plans = getCarePlans();
  return plans.find((p) => p.id === id) || null;
}

export function deleteCarePlan(id: string): void {
  const plans = getCarePlans();
  const filtered = plans.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function generateId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

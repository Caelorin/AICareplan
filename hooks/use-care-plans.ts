"use client";

import { useState, useEffect, useCallback } from "react";
import type { CarePlan } from "@/lib/types/care-plan";
import {
  getCarePlans,
  saveCarePlan,
  deleteCarePlan as deletePlanFromStorage,
  getCarePlanById,
} from "@/lib/utils/storage";

export function useCarePlans() {
  const [plans, setPlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlans = useCallback(() => {
    setLoading(true);
    const data = getCarePlans();
    setPlans(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const addPlan = useCallback((plan: CarePlan) => {
    saveCarePlan(plan);
    setPlans((prev) => [plan, ...prev]);
  }, []);

  const deletePlan = useCallback((id: string) => {
    deletePlanFromStorage(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getPlan = useCallback((id: string) => {
    return getCarePlanById(id);
  }, []);

  return {
    plans,
    loading,
    addPlan,
    deletePlan,
    getPlan,
    refreshPlans: loadPlans,
  };
}

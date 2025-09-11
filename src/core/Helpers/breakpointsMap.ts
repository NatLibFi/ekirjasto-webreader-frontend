"use client";

import { ThBreakpoints } from "@/preferences/models/enums";
import { BreakpointsMap } from "@/core/Hooks/useBreakpoints";

export const makeBreakpointsMap = <T>({
  defaultValue,
  fromEnum,
  pref,
  disabledValue,
}: {
  defaultValue: T;
  fromEnum: any;
  pref?: BreakpointsMap<T> | boolean;
  disabledValue?: T;
}): Required<BreakpointsMap<T>> => {
  
  const isValidType = (t: string | string[]) => {
    if (Array.isArray(t)) {
      return t.every(v => Object.values(fromEnum).includes(v));
    }
    return Object.values(fromEnum).includes(t);
  };

  const breakpointsMap: Required<BreakpointsMap<T>> = {
    [ThBreakpoints.compact]: defaultValue,
    [ThBreakpoints.medium]: defaultValue,
    [ThBreakpoints.expanded]: defaultValue,
    [ThBreakpoints.large]: defaultValue,
    [ThBreakpoints.xLarge]: defaultValue
  };

  if (typeof pref === "boolean" || pref instanceof Boolean) {
    if (!pref && disabledValue) {
      Object.values(ThBreakpoints).forEach((key) => {
        breakpointsMap[key] = disabledValue;
      });
    }
  } else if (typeof pref === "string" && isValidType(pref)) {
    Object.values(ThBreakpoints).forEach((key) => {
      breakpointsMap[key] = pref;
    });
  } else if (typeof pref === "object") {
    Object.entries(pref).forEach(([key, value]) => {
      if (!value) return;
      
      const isValid = Array.isArray(value) 
        ? value.every(v => isValidType(v))
        : isValidType(value.toString());
        
      if (isValid) {
        breakpointsMap[key as ThBreakpoints] = value as T;
      }
    });
  }

  return breakpointsMap;
};
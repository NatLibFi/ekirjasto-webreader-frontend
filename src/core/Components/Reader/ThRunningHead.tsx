"use client";

import React, { useEffect } from "react";

import { HTMLAttributesWithRef } from "../customTypes";

export interface ThRunningHeadProps extends HTMLAttributesWithRef<HTMLHeadingElement> {
  ref?: React.RefObject<HTMLHeadingElement>
  label: string;
  syncDocTitle?: boolean | string;  
}

export const ThRunningHead = ({ 
  ref,
  label,
  syncDocTitle,
  ...props
}: ThRunningHeadProps) => {

  useEffect(() => {
    if (syncDocTitle && label) document.title = syncDocTitle === true ? label : syncDocTitle;
  }, [syncDocTitle, label])

  return(
    <>
    <h1 
      ref={ ref }
      { ...props }
    >
        { label }
      </h1>
    </>
  )
}
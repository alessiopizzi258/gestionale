"use client";
import React, { useEffect } from 'react';

interface ToastProps {
  msg: string;
  onDone: () => void;
}

export default function Toast({ msg, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="toast">
      <i className="ti ti-check" /> {msg}
    </div>
  );
}

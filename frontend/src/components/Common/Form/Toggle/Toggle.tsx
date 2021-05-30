import React from 'react';
import style from './style.module.css';

export default function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange(checked: boolean): void;
  children: React.ReactNode;
}) {
  return (
    <label className="w-full flex items-center justify-between cursor-pointer">
      <div className="mr-2">{children}</div>
      <div className="relative">
        <input
          type="checkbox"
          className={`sr-only ${style.input}`}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-8 h-4 bg-darker-5 rounded-full ${style.dotContainer}`}
        />
        <div
          className={`absolute w-4 h-4 bg-dark-6 rounded-full shadow left-0 top-0 transition ${style.dot}`}
        />
      </div>
    </label>
  );
}

import React from 'react';

export function EditableText({ value, onChange, editable, className = '', ...props }) {
  if (editable) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-none focus:ring-0 p-0 ${className}`}
        {...props}
      />
    );
  }
  return <span className={className}>{value}</span>;
}

export function EditableTextarea({ value, onChange, editable, rows = 3, className = '', ...props }) {
  if (editable) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-[oklch(0.546_0.245_262.24)] focus:border-transparent ${className}`}
        {...props}
      />
    );
  }
  return <p className={`whitespace-pre-wrap ${className}`}>{value}</p>;
}
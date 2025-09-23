import React from 'react';


export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-xl shadow-card p-4 ${className}`}>{children}</section>
  );
}

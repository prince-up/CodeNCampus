import React from "react";
import { School, ShieldCheck, Users, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" /> Multi-Tenant Educational Operating
          System
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Code<span className="text-blue-600">N</span>Campus
        </h1>

        <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto mb-8">
          The next-generation digital operating system for Nursery to Class 12
          schools. Built by{" "}
          <span className="font-semibold text-slate-800">
            Codazk Technologies Private Limited
          </span>
          .
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <School className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Board Agnostic
            </h3>
            <p className="text-xs text-slate-500">
              CBSE, ICSE, and State Board grading and assessment schemes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <Layers className="w-6 h-6 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Tenant Isolation
            </h3>
            <p className="text-xs text-slate-500">
              Rigorous 3-ring security architecture ensuring complete data
              sovereignty.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <Users className="w-6 h-6 text-emerald-600 mb-2" />
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              Unified & Branded
            </h3>
            <p className="text-xs text-slate-500">
              Unified mobile experience with automated white-label EAS store
              builds.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 mb-4">
          <span>Fastify API v1.0</span>
          <span>•</span>
          <span>Next.js 15 App Router</span>
          <span>•</span>
          <span>React Native Expo SDK 58</span>
          <span>•</span>
          <span>PostgreSQL 16 & Prisma</span>
        </div>

        <p className="text-xs text-slate-400">
          © 2026 Codazk Technologies Private Limited. All rights reserved.
        </p>
      </div>
    </main>
  );
}

"use client";

import { Check } from 'lucide-react';
import React from 'react';

export function HeroSection() {
  return (
    <div className="lg:col-span-3 space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="inline-flex items-center bg-green-50 text-green-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        <span className="font-semibold">12,847 users</span> joined this week
      </div>

      <div className="space-y-3 sm:space-y-4 lg:space-y-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-tight">
          Secure File Sharing <span className="text-bolt-blue">Made Simple</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-600 leading-relaxed">
          Transfer files up to <span className="font-bold text-bolt-blue">30GB</span> with bank-level security
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <button className="bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-bold py-3 sm:py-4 px-6 sm:px-8 mb-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-base sm:text-lg w-full sm:w-auto">
          Claim Your 50GB Now - Free Forever
        </button>
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-bolt-light-blue rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-bolt-blue to-bolt-mid-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-semibold text-bolt-dark-purple block">🔥 Free 50GB Accounts Claimed</span>
                  <p className="text-xs text-bolt-blue">Limited time offer - Act fast!</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-base sm:text-lg font-bold text-bolt-dark-purple">78%</span>
                <p className="text-xs text-bolt-blue">claimed</p>
              </div>
            </div>
            <div className="space-y-2 mt-3 sm:mt-4">
              <div className="w-full bg-bolt-light-blue rounded-full h-2 sm:h-3 shadow-inner">
                <div className="bg-gradient-to-r from-bolt-blue to-bolt-cyan h-2 sm:h-3 rounded-full shadow-sm" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 flex items-start sm:items-center">
            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-500 mt-0.5 sm:mt-0 flex-shrink-0" />
            <span className="leading-relaxed">No credit card required • Your privacy protected: Files auto-delete after 30 days</span>
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
          {['256-bit Encryption', 'SOC2 Compliant', 'Zero-Knowledge', '99.9% Uptime'].map((text, i) => (
            <div key={text} className="flex items-center space-x-2">
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${['bg-green-500', 'bg-bolt-blue', 'bg-bolt-purple', 'bg-emerald-500'][i]}`}>
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
              <span className="text-xs sm:text-sm text-slate-600">{text}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="font-medium">1,247 files transferred in the last hour</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-bolt-blue rounded-full animate-pulse"></div>
            <span className="font-medium">Bank-level encryption on every transfer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
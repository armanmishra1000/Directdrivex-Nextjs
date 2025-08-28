"use client";

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Check, Star, X } from 'lucide-react';
import React, 'useState } from 'react';

const features = [
  { name: 'Free Storage', dropbox: '2GB', google: '15GB', mfc: '50GB' },
  { name: 'Max File Size', dropbox: '2GB', google: '15GB', mfc: '30GB' },
  { name: 'Transfer Speed', dropbox: '500MB/s', google: '1GB/s', mfc: '2GB/s' },
  { name: 'No Signup Required', dropbox: false, google: false, mfc: true },
  { name: 'Encryption', dropbox: 'Basic', google: 'Basic', mfc: 'E2E' },
  { name: 'Support', dropbox: 'Business hrs', google: 'Business hrs', mfc: '24/7' },
  { name: 'File Retention', dropbox: '30 days', google: 'Forever', mfc: '30 days' },
];

type Provider = 'dropbox' | 'google' | 'mfc';

export function ComparisonSection() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<Provider>('mfc');

  const renderValue = (value: string | boolean, isMfc: boolean) => {
    if (typeof value === 'boolean') {
      return (
        <div className={`flex items-center justify-center font-bold ${value ? 'text-green-600' : 'text-red-500'}`}>
          {value ? <Check className="w-4 h-4 mr-1" /> : <X className="w-4 h-4 mr-1" />}
          <span>{value ? 'Optional' : 'Required'}</span>
        </div>
      );
    }
    return <div className={cn('text-slate-600', isMfc && 'text-bolt-blue font-bold')}>{value}</div>;
  };

  const DesktopView = () => (
    <div className="hidden grid-cols-4 gap-6 mb-8 md:grid">
      {/* Headers */}
      <div className="font-semibold text-slate-700 text-base uppercase tracking-wide py-4">Features</div>
      <div className="font-semibold text-slate-700 text-base text-center py-4">Dropbox</div>
      <div className="font-semibold text-slate-700 text-base text-center py-4">Google Drive</div>
      <div className="relative">
        <div className="font-semibold text-bolt-dark-purple text-base text-center py-2">DirectDriveX</div>
      </div>

      {/* Rows */}
      <div className="space-y-3 text-base">
        {features.map(f => <div key={f.name} className="py-4">{f.name}</div>)}
      </div>
      <div className="space-y-3 text-base text-center">
        {features.map(f => <div key={f.name} className="py-4">{renderValue(f.dropbox, false)}</div>)}
      </div>
      <div className="space-y-3 text-base text-center">
        {features.map(f => <div key={f.name} className="py-4">{renderValue(f.google, false)}</div>)}
      </div>
      <div className="space-y-3 text-base text-center bg-gradient-to-b from-bolt-light-blue/50 to-white border-2 border-bolt-blue rounded-xl p-2 shadow-lg transform scale-105 relative">
        <div className="absolute text-nowrap -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-bolt-blue to-bolt-cyan text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg flex items-center">
          <Star className="w-4 h-4 mr-1" fill="white" /> BEST CHOICE
        </div>
        {features.map(f => <div key={f.name} className="py-4 hover:scale-105 transition-transform">{renderValue(f.mfc, true)}</div>)}
      </div>
    </div>
  );

  const MobileView = () => {
    const providerData = features.map(f => f[activeTab]);
    const providerName = { dropbox: 'Dropbox', google: 'Google Drive', mfc: 'DirectDriveX' }[activeTab];

    return (
      <div className="md:hidden mb-6">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-6">
          {(['mfc', 'dropbox', 'google'] as Provider[]).map(p => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-md",
                activeTab === p ? 'text-bolt-blue bg-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {{ mfc: 'DirectDriveX', dropbox: 'Dropbox', google: 'Google Drive' }[p]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="font-semibold text-slate-700 uppercase tracking-wide py-3">Features</div>
            {features.map(f => <div key={f.name} className="py-3">{f.name}</div>)}
          </div>
          <div className={cn("space-y-2 text-sm text-center", activeTab === 'mfc' && 'bg-gradient-to-b from-bolt-light-blue/50 to-white border-2 border-bolt-blue rounded-lg')}>
            <div className={cn("font-semibold py-3", activeTab === 'mfc' ? 'text-bolt-dark-purple font-bold' : 'text-slate-700')}>{providerName}</div>
            {providerData.map((value, i) => <div key={i} className="py-3">{renderValue(value, activeTab === 'mfc')}</div>)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:py-16 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 sm:p-6 p-4">
        <div className="text-center mb-12">
          <h2 className="lg:text-4xl md:text-3xl text-xl font-bold text-slate-900 mb-4">
            Why professionals choose DirectDriveX
          </h2>
          <p className="lg:text-lg text-sm text-slate-600 max-w-2xl mx-auto">
            Compare the leading file transfer solutions and see why thousands of professionals trust us for their secure file sharing needs.
          </p>
        </div>
        
        {isMobile ? <MobileView /> : <DesktopView />}

        <div className="text-center">
          <button className="bg-gradient-to-r from-bolt-blue to-bolt-mid-blue text-white font-medium px-8 py-3 rounded-xl transition-all hover:shadow-xl hover:-translate-y-0.5">
            Get Started - 50GB Free Forever
          </button>
          <p className="text-sm text-slate-500 mt-5">
            <span className="inline-flex items-center">
              <Check className="w-4 h-4 mr-1 text-green-500" />
              1,247 files securely transferred in the last hour
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
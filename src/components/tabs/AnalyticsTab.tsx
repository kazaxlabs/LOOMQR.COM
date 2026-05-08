'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LockedState } from '@/components/layout/LockedState';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { BarChart2 } from 'lucide-react';

interface AnalyticsTabProps {
  assets: any[];
  isLoggedIn: boolean;
  userId: string | undefined;
  setShowLoginModal: (show: boolean) => void;
}

export function AnalyticsTab({ assets, isLoggedIn, userId, setShowLoginModal }: AnalyticsTabProps) {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    // Note: This query requires a composite index: ownerId (ASC) + timestamp (DESC)
    const q = query(
      collection(db, 'scans'),
      where('ownerId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scanData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setScans(scanData);
      setLoading(false);
    }, (error) => {
      console.error("Analytics stream error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isLoggedIn, userId]);

  // Data processing for charts
  const timeData = useMemo(() => {
    const groups: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    last7Days.forEach(date => { groups[date] = 0; });

    scans.forEach(scan => {
      const date = new Date(scan.timestamp).toLocaleDateString();
      if (groups[date] !== undefined) {
        groups[date]++;
      }
    });

    return Object.entries(groups).map(([date, count]) => ({ 
      date: date.split('/')[0] + '/' + date.split('/')[1], // Short format
      count 
    }));
  }, [scans]);

  const locationData = useMemo(() => {
    const groups: Record<string, number> = {};
    scans.forEach(scan => {
      const loc = scan.location || 'Unknown';
      groups[loc] = (groups[loc] || 0) + 1;
    });
    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [scans]);

  const deviceData = useMemo(() => {
    const groups: Record<string, number> = {};
    scans.forEach(scan => {
      const dev = scan.device || 'Other';
      groups[dev] = (groups[dev] || 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [scans]);

  if (!isLoggedIn) {
    return <LockedState title="Insights Locked" message="Sign in to view detailed performance metrics for your codes." onLogin={() => setShowLoginModal(true)} />;
  }

  const lifetimeScans = scans.length;
  const activeBridges = assets.filter(a => a.type === 'Dynamic').length;
  const scanRate = assets.length > 0 ? (lifetimeScans / assets.length).toFixed(1) : 0;

  return (
    <div className="pipeline-container animate-fade-in p-4">
      <header className="flex-col m-b-6">
        <div className="flex-row items-center gap-2 color-muted m-b-1">
          <BarChart2 size={14} />
          <span className="text-xs font-bold">Analytics</span>
        </div>
        <h2 className="h-lg">Performance Analytics</h2>
        <p className="text-sm color-muted m-t-1">Monitor your scan activity in real-time.</p>
      </header>

      <div className="grid-3 m-b-4">
        <div className="glass-card center-text p-4">
          <div className="text-xs color-muted font-bold m-b-1">Total Scans</div>
          <div className="font-black text-2xl">
            {lifetimeScans.toLocaleString()}
          </div>
        </div>
        <div className="glass-card center-text p-4">
          <div className="text-xs color-muted font-bold m-b-1">Active Codes</div>
          <div className="font-black text-2xl">{activeBridges}</div>
        </div>
        <div className="glass-card center-text p-4">
          <div className="text-xs color-muted font-bold m-b-1">Average Scans</div>
          <div className="font-black success-text text-2xl">{scanRate}</div>
        </div>
      </div>

      {loading ? (
        <div className="flex-center p-4">
          <div className="loading-spinner" />
        </div>
      ) : scans.length === 0 ? (
        <div className="glass-card p-4 center-text opacity-50">
          <p>No scan data available yet. Distribute your codes to initiate data collection.</p>
        </div>
      ) : (
        <>
          <div className="grid-2 gap-2">
            <div className="glass-card p-4 flex-col">
              <h3 className="text-sm font-bold m-b-4 color-muted">Scans over time</h3>
              <div className="analytics-chart-container">
                <ResponsiveContainer>
                  <AreaChart data={timeData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{fontSize: 10, opacity: 0.5}} />
                    <Tooltip 
                      contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-4 flex-col">
              <h3 className="text-sm font-bold m-b-4 color-muted">Top locations</h3>
              <div className="analytics-chart-container">
                <ResponsiveContainer>
                  <BarChart data={locationData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="glass-card m-t-4 p-4">
            <h3 className="text-sm font-bold m-b-4 color-muted">Devices used</h3>
            <div className="flex items-center gap-4">
              <div className="analytics-pie-container">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : '#ec4899'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-col gap-2">
                {deviceData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <div className="analytics-dot" style={{ background: index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : '#ec4899' }} />
                    <span className="opacity-70">{entry.name}</span>
                    <span className="font-bold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { 
  Activity, BarChart3, PieChart as PieIcon, TrendingUp, 
  FileText, Clock, Zap, Layers, ShieldCheck, Download, Calendar, ArrowUpRight
} from 'lucide-react';
import { ALL_TOOLS } from '../data/tools';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

const monthlyData = [
  { month: 'Jan', processed: 42, compressed: 18, merged: 12, converted: 12 },
  { month: 'Feb', processed: 65, compressed: 25, merged: 20, converted: 20 },
  { month: 'Mar', processed: 88, compressed: 34, merged: 28, converted: 26 },
  { month: 'Apr', processed: 112, compressed: 45, merged: 35, converted: 32 },
  { month: 'May', processed: 145, compressed: 60, merged: 45, converted: 40 },
  { month: 'Jun', processed: 190, compressed: 82, merged: 58, converted: 50 },
  { month: 'Jul', processed: 235, compressed: 105, merged: 72, converted: 58 },
  { month: 'Aug', processed: 284, compressed: 128, merged: 90, converted: 66 },
];

const toolUsageData = [
  { name: 'Merge PDF', count: 95, color: '#2563EB' },
  { name: 'Compress PDF', count: 128, color: '#10B981' },
  { name: 'Split PDF', count: 74, color: '#F59E0B' },
  { name: 'OCR Text Scan', count: 52, color: '#8B5CF6' },
  { name: 'Watermark', count: 41, color: '#EC4899' },
  { name: 'Convert to Image', count: 63, color: '#06B6D4' },
];

const recentHistory = [
  { id: 1, tool: 'Merge PDF', fileName: 'Project_Report_Q3.pdf', date: '2026-08-20 22:14', size: '4.2 MB', status: 'Success' },
  { id: 2, tool: 'Compress PDF', fileName: 'Financial_Statement.pdf', date: '2026-08-20 19:45', size: '12.8 MB', status: 'Success' },
  { id: 3, tool: 'OCR Text Scan', fileName: 'Scanned_Contract_signed.pdf', date: '2026-08-20 15:20', size: '2.1 MB', status: 'Success' },
  { id: 4, tool: 'Split PDF', fileName: 'Handbook_2026.pdf', date: '2026-08-19 11:10', size: '18.4 MB', status: 'Success' },
  { id: 5, tool: 'View PDF Metadata', fileName: 'Tax_Return_2025.pdf', date: '2026-08-19 09:30', size: '1.5 MB', status: 'Success' },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');

  return (
    <div className="min-h-screen bg-[#FAFBFC] py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Processing Dashboard & Analytics - DocuCraft</title>
        <meta name="description" content="Analyze your PDF processing history, monthly activity trends, and most-used tools in real time." />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold tracking-wide uppercase">
                Analytics & History
              </span>
              <span className="text-xs text-[#64748B]">Live Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Processing Dashboard
            </h1>
            <p className="text-sm text-[#64748B]">
              Monitor your document processing volume, tool usage frequency, and secure activity logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] flex items-center text-xs font-semibold">
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === 'month' ? 'bg-white text-[#2563EB] shadow-2xs font-bold' : 'text-[#64748B]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeframe('quarter')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === 'quarter' ? 'bg-white text-[#2563EB] shadow-2xs font-bold' : 'text-[#64748B]'
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setTimeframe('year')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === 'year' ? 'bg-white text-[#2563EB] shadow-2xs font-bold' : 'text-[#64748B]'
                }`}
              >
                Full Year
              </button>
            </div>

            <button
              onClick={() => onNavigate('/tools')}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Tool</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Processed</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">1,161</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">Documents secured & transformed this year</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Storage Optimized</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">482 MB</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 64% avg
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">Saved via lossless compression</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Most Active Tool</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F172A] truncate">Compress PDF</span>
            </div>
            <p className="text-xs text-[#94A3B8]">128 total executions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Privacy Rating</span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#0F172A]">100%</span>
              <span className="text-xs font-bold text-emerald-600">Secure</span>
            </div>
            <p className="text-xs text-[#94A3B8]">Client-side WASM & zero server logs</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Monthly Activity Trend (2 cols) */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Monthly Processing Activity</h3>
                <p className="text-xs text-[#64748B]">Document volume processed across months in 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-[#64748B]">
                  <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block"></span> Total
                </span>
                <span className="flex items-center gap-1 text-xs text-[#64748B]">
                  <span className="w-3 h-3 rounded-full bg-[#10B981] inline-block"></span> Compressed
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompressed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="processed" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProcessed)" name="Total Processed" />
                  <Area type="monotone" dataKey="compressed" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompressed)" name="Compressed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Used Tools (1 col) */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Most-Used Tools</h3>
              <p className="text-xs text-[#64748B]">Distribution of favorite utilities</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={toolUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {toolUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {toolUsageData.map((tool) => (
                <div key={tool.name} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: tool.color }}></span>
                  <span className="text-[#64748B] truncate" title={tool.name}>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Secondary Detailed Bar Chart & Recent History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Tool Frequency Bar Chart */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Tool Execution Frequency</h3>
                <p className="text-xs text-[#64748B]">Total runs by utility type</p>
              </div>
              <BarChart3 className="w-5 h-5 text-[#2563EB]" />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolUsageData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} width={100} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Processing History Table */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Recent Processing Log</h3>
                <p className="text-xs text-[#64748B]">Last executed document tasks</p>
              </div>
              <Clock className="w-5 h-5 text-[#64748B]" />
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F1F5F9] text-[#94A3B8] font-bold">
                    <th className="pb-3">Tool</th>
                    <th className="pb-3">File Name</th>
                    <th className="pb-3">Size</th>
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {recentHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 font-semibold text-[#0F172A]">{item.tool}</td>
                      <td className="py-3 text-[#64748B] truncate max-w-[140px]" title={item.fileName}>{item.fileName}</td>
                      <td className="py-3 text-[#64748B]">{item.size}</td>
                      <td className="py-3 text-[#94A3B8]">{item.date}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
              <span>Showing last 5 secure sessions</span>
              <button 
                onClick={() => alert('Processing log export triggered successfully.')}
                className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export History CSV
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

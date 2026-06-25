import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Mail, BarChart3, LogOut, Trash2, Download,
  ChevronDown, Eye, TrendingUp, MousePointerClick, Scroll,
  Star, Clock, RefreshCw, X, AlertCircle, Search, Filter
} from 'lucide-react';
import { User } from 'firebase/auth';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  budget: string;
  status: string;
  aiScore?: number;
  aiInsight?: string;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}

interface AnalyticsSummary {
  totalPageViews: number;
  totalLeads: number;
  conversionRate: number;
  avgScrollDepth: number;
  variantDistribution: { A: number; B: number };
}

type Tab = 'leads' | 'subscribers' | 'analytics';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('leads');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadsError, setLeadsError] = useState('');

  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscribersError, setSubscribersError] = useState('');

  // Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  const getAuthHeaders = useCallback(async () => {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  }, [user]);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    setLeadsError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/leads', { headers });
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data.leads || data);
    } catch (err: any) {
      setLeadsError(err.message || 'Failed to load leads');
    } finally {
      setLeadsLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch subscribers
  const fetchSubscribers = useCallback(async () => {
    setSubscribersLoading(true);
    setSubscribersError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/newsletter', { headers });
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      setSubscribers(data.subscribers || data);
    } catch (err: any) {
      setSubscribersError(err.message || 'Failed to load subscribers');
    } finally {
      setSubscribersLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/analytics/summary', { headers });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      if (data.success && data.summary) {
        setAnalytics({
          totalPageViews: data.summary.totalPageViews || 0,
          totalLeads: data.summary.totalLeads || 0,
          conversionRate: data.summary.conversionRate || 0,
          avgScrollDepth: data.summary.scrollDepthAvg || 0,
          variantDistribution: {
            A: data.summary.abDistribution?.A || 0,
            B: data.summary.abDistribution?.B || 0,
          },
        });
      } else {
        throw new Error(data.message || 'Failed to parse analytics summary');
      }
    } catch (err: any) {
      setAnalyticsError(err.message || 'Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [getAuthHeaders]);

  // Load data on tab change
  useEffect(() => {
    if (activeTab === 'leads') fetchLeads();
    else if (activeTab === 'subscribers') fetchSubscribers();
    else if (activeTab === 'analytics') fetchAnalytics();
  }, [activeTab, fetchLeads, fetchSubscribers, fetchAnalytics]);

  // Update lead status
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
    } catch {
      // Could add error toast here
    }
  };

  // Delete lead
  const deleteLead = async (leadId: string) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete lead');
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
      setDeleteConfirm(null);
    } catch {
      setDeleteConfirm(null);
    }
  };

  // Delete subscriber
  const deleteSubscriber = async (subId: string) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/newsletter/${subId}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to unsubscribe');
      setSubscribers((prev) => prev.filter((s) => s.id !== subId));
      setDeleteConfirm(null);
    } catch {
      setDeleteConfirm(null);
    }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['Email', 'Source', 'Date'];
    const rows = subscribers.map((s) => [
      s.email,
      s.source,
      new Date(s.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Status badge color
  const statusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'qualified': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'closed': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  // AI Score color
  const scoreColor = (score: number) => {
    if (score >= 61) return 'bg-emerald-500/15 text-emerald-400';
    if (score >= 31) return 'bg-yellow-500/15 text-yellow-400';
    return 'bg-rose-500/15 text-rose-400';
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'leads', label: 'Leads', icon: <Users className="w-4 h-4" /> },
    { key: 'subscribers', label: 'Subscribers', icon: <Mail className="w-4 h-4" /> },
    { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary"
            >
              Boomzy
            </a>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-slate-700"
                />
              )}
              <span className="text-xs font-semibold text-slate-400 hidden sm:block">
                {user.email}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="h-9 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* ───── LEADS TAB ───── */}
          {activeTab === 'leads' && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">Lead Management</h2>
                <button
                  onClick={fetchLeads}
                  className="h-9 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${leadsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {leadsError && (
                <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400 text-xs font-semibold">{leadsError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leads Table */}
                <div className={`${selectedLead ? 'lg:col-span-2' : 'lg:col-span-3'} bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden`}>
                  {leadsLoading && leads.length === 0 ? (
                    <div className="p-12 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">No leads yet</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                            <th className="text-left px-5 py-3.5 font-bold">Name</th>
                            <th className="text-left px-5 py-3.5 font-bold">Email</th>
                            <th className="text-left px-5 py-3.5 font-bold">Budget</th>
                            <th className="text-left px-5 py-3.5 font-bold">Status</th>
                            <th className="text-left px-5 py-3.5 font-bold">AI Score</th>
                            <th className="text-left px-5 py-3.5 font-bold">Date</th>
                            <th className="px-5 py-3.5 font-bold"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {leads.map((lead) => (
                            <tr
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className={`border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors ${
                                selectedLead?.id === lead.id ? 'bg-slate-800/40' : ''
                              }`}
                            >
                              <td className="px-5 py-3.5 font-semibold text-white whitespace-nowrap">
                                {lead.firstName} {lead.lastName}
                              </td>
                              <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{lead.email}</td>
                              <td className="px-5 py-3.5 text-slate-300 font-semibold whitespace-nowrap">{lead.budget}</td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <select
                                  value={lead.status}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    updateLeadStatus(lead.id, e.target.value);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-transparent cursor-pointer focus:outline-none ${statusColor(lead.status)}`}
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="qualified">Qualified</option>
                                  <option value="closed">Closed</option>
                                </select>
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                {lead.aiScore != null ? (
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${scoreColor(lead.aiScore)}`}>
                                    {lead.aiScore}/100
                                  </span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </td>
                              <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirm({ type: 'lead', id: lead.id });
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Lead Detail Panel */}
                {selectedLead && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-wide">Lead Details</h3>
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name</div>
                        <div className="text-sm font-semibold text-white">{selectedLead.firstName} {selectedLead.lastName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email</div>
                        <div className="text-sm text-slate-300">{selectedLead.email}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Budget</div>
                        <div className="text-sm font-semibold text-brand-primary">{selectedLead.budget}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusColor(selectedLead.status)}`}>
                          {selectedLead.status}
                        </span>
                      </div>
                      {selectedLead.aiScore != null && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Quality Score</div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-brand-primary" />
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${scoreColor(selectedLead.aiScore)}`}>
                              {selectedLead.aiScore}/100
                            </span>
                          </div>
                        </div>
                      )}
                      {selectedLead.aiInsight && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">AI Insight</div>
                          <div className="text-xs text-slate-300 bg-slate-800/50 rounded-xl p-3 leading-relaxed border border-slate-700/50">
                            {selectedLead.aiInsight}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Submitted</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(selectedLead.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ───── SUBSCRIBERS TAB ───── */}
          {activeTab === 'subscribers' && (
            <motion.div
              key="subscribers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">Newsletter Subscribers</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportCSV}
                    disabled={subscribers.length === 0}
                    className="h-9 px-4 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  <button
                    onClick={fetchSubscribers}
                    className="h-9 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${subscribersLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              {subscribersError && (
                <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400 text-xs font-semibold">{subscribersError}</span>
                </div>
              )}

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
                {subscribersLoading && subscribers.length === 0 ? (
                  <div className="p-12 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">No subscribers yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                          <th className="text-left px-5 py-3.5 font-bold">Email</th>
                          <th className="text-left px-5 py-3.5 font-bold">Source</th>
                          <th className="text-left px-5 py-3.5 font-bold">Date</th>
                          <th className="px-5 py-3.5 font-bold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.map((sub) => (
                          <tr
                            key={sub.id}
                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="px-5 py-3.5 font-semibold text-white">{sub.email}</td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                                {sub.source}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-500">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => setDeleteConfirm({ type: 'subscriber', id: sub.id })}
                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ───── ANALYTICS TAB ───── */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">Analytics Overview</h2>
                <button
                  onClick={fetchAnalytics}
                  className="h-9 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {analyticsError && (
                <div className="mb-4 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400 text-xs font-semibold">{analyticsError}</span>
                </div>
              )}

              {analyticsLoading && !analytics ? (
                <div className="p-12 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : analytics ? (
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0 }}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Page Views</span>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {analytics.totalPageViews.toLocaleString()}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Leads</span>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {analytics.totalLeads.toLocaleString()}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-brand-primary" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Conversion Rate</span>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {analytics.conversionRate.toFixed(1)}%
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <Scroll className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg Scroll Depth</span>
                      </div>
                      <div className="text-3xl font-black text-white">
                        {analytics.avgScrollDepth.toFixed(0)}%
                      </div>
                    </motion.div>
                  </div>

                  {/* A/B Variant Distribution */}
                  {analytics.variantDistribution && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6"
                    >
                      <h3 className="text-sm font-black text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-brand-primary" />
                        A/B Variant Distribution
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Variant A</div>
                          <div className="text-2xl font-black text-white">{analytics.variantDistribution.A || 0}</div>
                          <div className="text-[10px] text-slate-500 mt-1">views</div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Variant B</div>
                          <div className="text-2xl font-black text-white">{analytics.variantDistribution.B || 0}</div>
                          <div className="text-[10px] text-slate-500 mt-1">views</div>
                        </div>
                      </div>
                      {/* Distribution bar */}
                      <div className="mt-4 h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                        {(analytics.variantDistribution.A + analytics.variantDistribution.B) > 0 && (
                          <>
                            <div
                              className="bg-brand-primary h-full rounded-l-full transition-all"
                              style={{
                                width: `${(analytics.variantDistribution.A / (analytics.variantDistribution.A + analytics.variantDistribution.B)) * 100}%`,
                              }}
                            />
                            <div
                              className="bg-brand-secondary h-full rounded-r-full transition-all"
                              style={{
                                width: `${(analytics.variantDistribution.B / (analytics.variantDistribution.A + analytics.variantDistribution.B)) * 100}%`,
                              }}
                            />
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 text-sm">No analytics data available</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-black text-white mb-2">Confirm Delete</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'lead') deleteLead(deleteConfirm.id);
                    else deleteSubscriber(deleteConfirm.id);
                  }}
                  className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

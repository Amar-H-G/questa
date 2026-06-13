import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, UserX, UserCheck, Search, RefreshCw, ArrowLeft, ArrowRight, ClipboardList, Users } from 'lucide-react';
import { apiClient } from '../../../services/api/client';
import { Button } from '../../../components/ui/Button';
import { InlineAlert } from '../../../components/ui/InlineAlert';
import { SkeletonBlock } from '../../../components/ui/SkeletonBlock';

export const UsersAdminPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'audit-logs'
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Users List
  const { data: usersData, isLoading: isLoadingUsers, error: usersError, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users', page, searchTerm],
    enabled: activeTab === 'users',
    queryFn: async () => {
      const response = await apiClient.get(`/admin/users?page=${page}&limit=10&search=${searchTerm}`);
      return response.data.data;
    },
  });

  // Fetch Audit Logs List
  const { data: auditData, isLoading: isLoadingAudit, error: auditError, refetch: refetchAudit } = useQuery({
    queryKey: ['admin-audit-logs', page],
    enabled: activeTab === 'audit-logs',
    queryFn: async () => {
      const response = await apiClient.get(`/admin/audit-logs?page=${page}&limit=10`);
      return response.data.data;
    },
  });

  const users = usersData?.items || [];
  const usersMeta = usersData?.meta || { total: 0, limit: 10, page: 1 };
  
  const audits = auditData?.items || [];
  const auditMeta = auditData?.meta || { total: 0, limit: 10, page: 1 };

  const currentMeta = activeTab === 'users' ? usersMeta : auditMeta;
  const totalPages = Math.ceil(currentMeta.total / currentMeta.limit) || 1;

  // Status mutation helpers
  const suspendMutation = useMutation({
    mutationFn: async (id) => (await apiClient.post(`/admin/users/${id}/suspend`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (id) => (await apiClient.post(`/admin/users/${id}/activate`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });

  const banMutation = useMutation({
    mutationFn: async (id) => (await apiClient.post(`/admin/users/${id}/ban`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => (await apiClient.post(`/admin/users/${id}/role`, { role })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-audit-logs'] });
    },
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setSearchTerm('');
  };

  const handleRefresh = () => {
    if (activeTab === 'users') refetchUsers();
    else refetchAudit();
  };

  return (
    <div className="page-shell space-y-6 text-[#0f172a]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Security & Governance Console</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Audit platform activity, toggle candidate roles, and manage access clearances.</p>
        </div>
        <Button onClick={handleRefresh} variant="secondary" className="flex items-center gap-2 self-start sm:self-auto border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Console
        </Button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => handleTabChange('users')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="h-4 w-4" />
          User Accounts
        </button>
        <button
          onClick={() => handleTabChange('audit-logs')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
            activeTab === 'audit-logs'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Security Audit Trails
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Search bar */}
          <section className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-blue-600 transition placeholder:text-slate-400"
              />
            </div>
          </section>

          {/* User List Table */}
          {isLoadingUsers ? (
            <div className="space-y-3">
              <SkeletonBlock className="h-12 w-full" />
              <SkeletonBlock className="h-16 w-full" />
            </div>
          ) : usersError ? (
            <InlineAlert>Failed to query users credentials. Verify administrator permissions.</InlineAlert>
          ) : (
            <div className="border border-slate-200 bg-white rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="p-4 font-semibold uppercase">Candidate Details</th>
                    <th className="p-4 font-semibold uppercase">Role</th>
                    <th className="p-4 font-semibold uppercase">Status</th>
                    <th className="p-4 font-semibold uppercase">Joined Date</th>
                    <th className="p-4 font-semibold uppercase text-right">Administrative Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-700">{user.name}</p>
                          <p className="text-slate-500 mt-0.5 font-medium">{user.email}</p>
                        </td>
                        <td className="p-4">
                          <select
                            value={user.role}
                            onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg p-1.5 outline-none focus:border-blue-600 font-bold"
                          >
                            <option value="student">STUDENT</option>
                            <option value="teacher">TEACHER</option>
                            <option value="recruiter">RECRUITER</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                            user.status === 'suspended' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            user.status === 'banned' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                            'bg-blue-50 text-blue-600 border-blue-200'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {user.status === 'active' ? (
                            <>
                              <Button
                                onClick={() => suspendMutation.mutate(user.id)}
                                disabled={suspendMutation.isPending}
                                variant="secondary"
                                className="bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-250 h-8 text-[11px] px-2.5 font-bold"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Suspend
                              </Button>
                              <Button
                                onClick={() => banMutation.mutate(user.id)}
                                disabled={banMutation.isPending}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-250 h-8 text-[11px] px-2.5 font-bold"
                              >
                                <UserX className="h-3 w-3 mr-1" />
                                Ban
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => activateMutation.mutate(user.id)}
                              disabled={activateMutation.isPending}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-250 h-8 text-[11px] px-2.5 font-bold"
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">
                        No candidates matched the current queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Audit Logs Table */}
          {isLoadingAudit ? (
            <div className="space-y-3">
              <SkeletonBlock className="h-12 w-full" />
              <SkeletonBlock className="h-16 w-full" />
            </div>
          ) : auditError ? (
            <InlineAlert>Failed to fetch platform security logs.</InlineAlert>
          ) : (
            <div className="border border-slate-200 bg-white rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="p-4 font-semibold uppercase">Action Event</th>
                    <th className="p-4 font-semibold uppercase">Operator</th>
                    <th className="p-4 font-semibold uppercase">IP Address</th>
                    <th className="p-4 font-semibold uppercase">Log Details</th>
                    <th className="p-4 font-semibold uppercase">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {audits.length > 0 ? (
                    audits.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            log.action.startsWith('user') ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-250'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-700">{log.user?.name || 'System / Guest'}</p>
                          {log.user?.email && <p className="text-slate-500 mt-0.5 font-medium">{log.user?.email}</p>}
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{log.ip || '127.0.0.1'}</td>
                        <td className="p-4">
                          <span className="text-slate-600 font-mono text-[10px] bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 block max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
                            {JSON.stringify(log.details || {})}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 font-semibold">
                        No security audit trails found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <footer className="flex items-center justify-between border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
          <span className="text-slate-500 text-xs font-semibold">Showing Page {page} of {totalPages} ({currentMeta.total} entries)</span>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              variant="secondary"
              className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Prev
            </Button>
            <Button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              variant="secondary"
              className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

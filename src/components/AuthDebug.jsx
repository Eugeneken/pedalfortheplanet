import React from 'react'
import { useAuth } from '@/lib/AuthContext'
import { appParams } from '@/lib/app-params'

function JsonBlock({ label, data }) {
  return (
    <div className="p-3 bg-slate-50 rounded border border-slate-100">
      <div className="text-sm font-medium text-slate-700 mb-2">{label}</div>
      <pre className="text-xs text-slate-600 overflow-auto max-h-40">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default function AuthDebug() {
  const { user, isAuthenticated, isLoadingAuth, authError, appPublicSettings } = useAuth();

  // Only render in dev or when ?debug=true is present
  if (typeof window !== 'undefined') {
    const urlDebug = new URLSearchParams(window.location.search).get('debug');
    if (!import.meta.env.DEV && urlDebug !== 'true') return null;
  }

  const localStorageToken = typeof window !== 'undefined' ? (localStorage.getItem('base44_access_token') || localStorage.getItem('token')) : null;

  return (
    <div className="fixed right-4 bottom-4 w-96 z-50 shadow-lg">
      <div className="bg-white rounded-lg p-3 border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Auth Debug</div>
          <div className="text-xs text-slate-500">Dev / debug</div>
        </div>
        <div className="space-y-2">
          <JsonBlock label="user" data={user} />
          <JsonBlock label="isAuthenticated / isLoadingAuth" data={{ isAuthenticated, isLoadingAuth }} />
          <JsonBlock label="authError" data={authError} />
          <JsonBlock label="appPublicSettings" data={appPublicSettings} />
          <JsonBlock label="appParams" data={appParams} />
          <JsonBlock label="localStorage token" data={{ localStorageToken }} />
        </div>
      </div>
    </div>
  )
}

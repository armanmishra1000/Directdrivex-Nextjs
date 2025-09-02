"use client";

import { useState } from "react";
import { mockSessionManagement } from "./data";
import { SessionManagement } from "@/types/security";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function ActiveSessionsTab() {
  const [sessions, setSessions] = useState<SessionManagement>(mockSessionManagement);

  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Admin Sessions ({sessions.total_active})</h3>
        <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Admin Email</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>User Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.active_sessions.map(session => (
              <TableRow key={session.session_id}>
                <TableCell className="font-medium">{session.admin_email}</TableCell>
                <TableCell><code>{session.ip_address}</code></TableCell>
                <TableCell>{new Date(session.login_time).toLocaleString()}</TableCell>
                <TableCell>{new Date(session.last_activity).toLocaleString()}</TableCell>
                <TableCell className="max-w-xs truncate">{session.user_agent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
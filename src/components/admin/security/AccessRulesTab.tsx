"use client";

import { useState } from "react";
import { mockAccessRules } from "./data";
import { AccessRule } from "@/types/security";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { RuleEditModal } from "./RuleEditModal";

export function AccessRulesTab() {
  const [rules, setRules] = useState<AccessRule[]>(mockAccessRules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AccessRule | null>(null);

  const handleAddRule = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEditRule = (rule: AccessRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleSaveRule = (rule: AccessRule) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === rule.id ? rule : r));
    } else {
      setRules([...rules, { ...rule, id: `rule_${rules.length + 1}` }]);
    }
    setIsModalOpen(false);
  };

  const getActionVariant = (action: AccessRule['action']) => {
    switch (action) {
      case 'allow': return 'default';
      case 'deny': return 'destructive';
      case 'rate_limit': return 'secondary';
    }
  };

  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">IP Access Rules ({rules.length})</h3>
        <Button onClick={handleAddRule}><Plus className="w-4 h-4 mr-2" /> Add Rule</Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Rule Name</TableHead>
              <TableHead>IP Pattern</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map(rule => (
              <TableRow key={rule.id}>
                <TableCell>
                  <div className={`w-2.5 h-2.5 rounded-full ${rule.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                </TableCell>
                <TableCell className="font-medium">{rule.rule_name}</TableCell>
                <TableCell><code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">{rule.ip_pattern}</code></TableCell>
                <TableCell><Badge variant={getActionVariant(rule.action)}>{rule.action}</Badge></TableCell>
                <TableCell>{rule.priority}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <RuleEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        rule={editingRule}
      />
    </div>
  );
}
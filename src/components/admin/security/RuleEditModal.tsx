"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AccessRule } from "@/types/security";

interface RuleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: AccessRule) => void;
  rule: AccessRule | null;
}

export function RuleEditModal({ isOpen, onClose, onSave, rule }: RuleEditModalProps) {
  const [formData, setFormData] = useState<Partial<AccessRule>>({});

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    } else {
      setFormData({
        rule_name: '',
        ip_pattern: '',
        action: 'allow',
        priority: 10,
        is_active: true,
        description: '',
      });
    }
  }, [rule, isOpen]);

  const handleChange = (field: keyof AccessRule, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData as AccessRule);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit' : 'Add'} Access Rule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rule_name" className="text-right">Name</Label>
            <Input id="rule_name" value={formData.rule_name || ''} onChange={(e) => handleChange('rule_name', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip_pattern" className="text-right">IP Pattern</Label>
            <Input id="ip_pattern" value={formData.ip_pattern || ''} onChange={(e) => handleChange('ip_pattern', e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="action" className="text-right">Action</Label>
            <Select value={formData.action} onValueChange={(value) => handleChange('action', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allow">Allow</SelectItem>
                <SelectItem value="deny">Deny</SelectItem>
                <SelectItem value="rate_limit">Rate Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
            <Input id="priority" type="number" value={formData.priority || 10} onChange={(e) => handleChange('priority', +e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} className="col-span-3" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => handleChange('is_active', checked)} />
            <Label htmlFor="is_active">Rule is Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
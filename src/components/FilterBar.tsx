import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GROUPS, ASSIGNEES, STATUS_LABELS, PRIORITY_LABELS } from '@/data/mockData';
import type { TaskStatus, TaskPriority } from '@/data/mockData';

export interface Filters {
  search: string;
  group: string;
  assignee: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  dateFrom: string;
  dateTo: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onExport: () => void;
  onAddTask: () => void;
}

export default function FilterBar({ filters, onChange, onExport, onAddTask }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value });

  const activeCount = [
    filters.group, filters.assignee, filters.status,
    filters.priority, filters.dateFrom, filters.dateTo,
  ].filter(Boolean).length;

  const reset = () => onChange({ search: '', group: '', assignee: '', status: '', priority: '', dateFrom: '', dateTo: '' });

  return (
    <div className="border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск задач..."
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            className="pl-8 h-8 text-sm bg-background"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className={`h-8 gap-2 text-xs ${expanded ? 'border-primary text-primary' : ''}`}
        >
          <Icon name="SlidersHorizontal" size={13} />
          Фильтры
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-8 text-xs text-muted-foreground">
            <Icon name="X" size={12} />
            Сбросить
          </Button>
        )}

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={onExport} className="h-8 gap-2 text-xs">
            <Icon name="Download" size={13} />
            Экспорт
          </Button>
          <Button size="sm" onClick={onAddTask} className="h-8 gap-2 text-xs">
            <Icon name="Plus" size={13} />
            Добавить задачу
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-wrap gap-3 animate-fade-in">
          <select
            value={filters.group}
            onChange={(e) => set('group', e.target.value)}
            className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Все группы</option>
            {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <select
            value={filters.assignee}
            onChange={(e) => set('assignee', e.target.value)}
            className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Все исполнители</option>
            {ASSIGNEES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <select
            value={filters.status}
            onChange={(e) => set('status', e.target.value)}
            className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Все статусы</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => set('priority', e.target.value)}
            className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Все приоритеты</option>
            {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>С:</span>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => set('dateFrom', e.target.value)}
              className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <span>По:</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => set('dateTo', e.target.value)}
              className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}

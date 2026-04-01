import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import type { Task, TaskStatus, TaskPriority } from '@/data/mockData';
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_LABELS, GROUPS, ASSIGNEES } from '@/data/mockData';

interface TaskTableProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  groupBy: string;
}

type SortKey = keyof Task;

const PRIORITY_ORDER: Record<TaskPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export default function TaskTable({ tasks, onUpdate, onDelete, groupBy }: TaskTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('startDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...tasks].sort((a, b) => {
    let av: string | number = a[sortKey] as string | number;
    let bv: string | number = b[sortKey] as string | number;
    if (sortKey === 'priority') { av = PRIORITY_ORDER[a.priority]; bv = PRIORITY_ORDER[b.priority]; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const grouped = groupBy
    ? sorted.reduce<Record<string, Task[]>>((acc, t) => {
        const key = (t[groupBy as keyof Task] as string) || 'Без группы';
        if (!acc[key]) acc[key] = [];
        acc[key].push(t);
        return acc;
      }, {})
    : { '': sorted };

  const startEdit = (task: Task) => { setEditing(task.id); setEditData({ ...task }); };
  const saveEdit = () => {
    if (editing && editData) {
      onUpdate({ ...editData } as Task);
      setEditing(null);
    }
  };
  const cancelEdit = () => setEditing(null);

  const toggleGroup = (g: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g); else next.add(g);
      return next;
    });
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const fmtMoney = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

  const SortIcon = ({ k }: { k: SortKey }) => (
    <Icon
      name={sortKey === k ? (sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'}
      size={12}
      className={sortKey === k ? 'text-primary' : 'text-muted-foreground opacity-40'}
    />
  );

  const Th = ({ label, k, w }: { label: string; k: SortKey; w?: string }) => (
    <th className={`px-3 py-2.5 text-left text-[11px] font-medium text-muted-foreground whitespace-nowrap ${w || ''}`}>
      <button onClick={() => sort(k)} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
        {label} <SortIcon k={k} />
      </button>
    </th>
  );

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-card border-b border-border">
          <tr>
            <Th label="Задача" k="name" w="min-w-[200px]" />
            <Th label="Группа" k="group" />
            <Th label="Исполнитель" k="assignee" />
            <Th label="Начало" k="startDate" />
            <Th label="Конец" k="endDate" />
            <Th label="Статус" k="status" />
            <Th label="Приоритет" k="priority" />
            <Th label="Прогресс" k="progress" />
            <Th label="Бюджет" k="budget" />
            <Th label="Потрачено" k="spent" />
            <th className="px-3 py-2.5 w-20"></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([grp, grpTasks]) => (
            <>
              {groupBy && grp && (
                <tr key={`g-${grp}`} className="bg-muted/40">
                  <td colSpan={11} className="px-3 py-2">
                    <button
                      onClick={() => toggleGroup(grp)}
                      className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Icon name={collapsed.has(grp) ? 'ChevronRight' : 'ChevronDown'} size={13} />
                      {grp}
                      <span className="bg-border text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">
                        {grpTasks.length}
                      </span>
                    </button>
                  </td>
                </tr>
              )}
              {!collapsed.has(grp) && grpTasks.map((task) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/30 transition-colors group">
                  {editing === task.id ? (
                    <>
                      <td className="px-3 py-2">
                        <input className="w-full text-xs border border-primary rounded px-2 py-1 outline-none" value={editData.name || ''} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} />
                      </td>
                      <td className="px-3 py-2">
                        <select className="text-xs border border-border rounded px-1 py-1 bg-background" value={editData.group || ''} onChange={e => setEditData(d => ({ ...d, group: e.target.value }))}>
                          {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select className="text-xs border border-border rounded px-1 py-1 bg-background" value={editData.assignee || ''} onChange={e => setEditData(d => ({ ...d, assignee: e.target.value }))}>
                          {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input type="date" className="text-xs border border-border rounded px-1 py-1 bg-background" value={editData.startDate || ''} onChange={e => setEditData(d => ({ ...d, startDate: e.target.value }))} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="date" className="text-xs border border-border rounded px-1 py-1 bg-background" value={editData.endDate || ''} onChange={e => setEditData(d => ({ ...d, endDate: e.target.value }))} />
                      </td>
                      <td className="px-3 py-2">
                        <select className="text-xs border border-border rounded px-1 py-1 bg-background" value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as TaskStatus }))}>
                          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <select className="text-xs border border-border rounded px-1 py-1 bg-background" value={editData.priority || ''} onChange={e => setEditData(d => ({ ...d, priority: e.target.value as TaskPriority }))}>
                          {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" max="100" className="w-16 text-xs border border-border rounded px-1 py-1 bg-background" value={editData.progress ?? 0} onChange={e => setEditData(d => ({ ...d, progress: +e.target.value }))} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" className="w-24 text-xs border border-border rounded px-1 py-1 bg-background" value={editData.budget ?? 0} onChange={e => setEditData(d => ({ ...d, budget: +e.target.value }))} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" className="w-24 text-xs border border-border rounded px-1 py-1 bg-background" value={editData.spent ?? 0} onChange={e => setEditData(d => ({ ...d, spent: +e.target.value }))} />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-700 p-1"><Icon name="Check" size={14} /></button>
                          <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground p-1"><Icon name="X" size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-xs text-foreground">{task.name}</div>
                        {task.notes && <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[180px]">{task.notes}</div>}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{task.group}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{task.assignee}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground mono whitespace-nowrap">{fmt(task.startDate)}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground mono whitespace-nowrap">{fmt(task.endDate)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>
                          {STATUS_LABELS[task.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-medium ${
                          task.priority === 'critical' ? 'text-red-600' :
                          task.priority === 'high' ? 'text-amber-600' :
                          task.priority === 'medium' ? 'text-blue-600' : 'text-muted-foreground'
                        }`}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${task.progress}%`,
                                backgroundColor: task.progress === 100 ? 'hsl(162,72%,45%)' : 'hsl(215,90%,42%)'
                              }}
                            />
                          </div>
                          <span className="text-[10px] mono text-muted-foreground">{task.progress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs mono text-muted-foreground whitespace-nowrap">{fmtMoney(task.budget)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs mono whitespace-nowrap ${task.spent > task.budget ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                          {fmtMoney(task.spent)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(task)} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"><Icon name="Pencil" size={13} /></button>
                          <button onClick={() => onDelete(task.id)} className="text-muted-foreground hover:text-red-500 p-1 rounded hover:bg-red-50"><Icon name="Trash2" size={13} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Icon name="SearchX" size={32} className="mb-3 opacity-30" />
          <p className="text-sm">Задачи не найдены</p>
          <p className="text-xs mt-1 opacity-60">Измените фильтры или добавьте задачу</p>
        </div>
      )}
    </div>
  );
}

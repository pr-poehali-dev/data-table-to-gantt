import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Task, TaskStatus } from '@/data/mockData';
import { STATUS_LABELS, STATUS_COLORS, ASSIGNEES, hoursToDays } from '@/data/mockData';

interface TaskTableProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  groupBy: string;
}

type SortKey = keyof Task;

export default function TaskTable({ tasks, onUpdate, onDelete, groupBy }: TaskTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('num');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...tasks].sort((a, b) => {
    const av = a[sortKey] as string | number;
    const bv = b[sortKey] as string | number;
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
    if (editing && editData) { onUpdate({ ...editData } as Task); setEditing(null); }
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

  const SortIcon = ({ k }: { k: SortKey }) => (
    <Icon
      name={sortKey === k ? (sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'}
      size={11}
      className={sortKey === k ? 'text-primary' : 'text-muted-foreground opacity-40'}
    />
  );

  const Th = ({ label, k, w, center }: { label: string; k: SortKey; w?: string; center?: boolean }) => (
    <th className={`px-3 py-2.5 text-[11px] font-medium text-muted-foreground whitespace-nowrap ${center ? 'text-center' : 'text-left'} ${w || ''}`}>
      <button onClick={() => sort(k)} className={`flex items-center gap-1 hover:text-foreground transition-colors ${center ? 'mx-auto' : ''}`}>
        {label} <SortIcon k={k} />
      </button>
    </th>
  );

  const inputCls = "w-full text-xs border border-primary/50 rounded px-1.5 py-1 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <table className="w-full border-collapse text-sm min-w-[900px]">
        <thead className="sticky top-0 z-10 bg-card border-b-2 border-border">
          <tr>
            <th className="px-3 py-2.5 text-center text-[11px] font-medium text-muted-foreground w-10">№</th>
            <Th label="Комплект документации" k="docName" w="min-w-[180px]" />
            <Th label="Шифр" k="cipher" w="w-28" />
            <Th label="Исполнитель" k="assignee" w="w-32" />
            <Th label="Наименование работ (задания)" k="workName" w="min-w-[200px]" />
            <Th label="Старт" k="startDate" w="w-24" center />
            <Th label="Финиш" k="endDate" w="w-24" center />
            <Th label="ч/ч" k="hoursTotal" w="w-16" center />
            <Th label="дни" k="hoursTotal" w="w-14" center />
            <th className="px-3 py-2.5 text-[11px] font-medium text-muted-foreground w-24 text-center">Статус</th>
            <th className="px-3 py-2.5 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([grp, grpTasks]) => (
            <>
              {groupBy && grp && (
                <tr key={`g-${grp}`} className="bg-muted/50">
                  <td colSpan={11} className="px-3 py-1.5">
                    <button
                      onClick={() => toggleGroup(grp)}
                      className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <Icon name={collapsed.has(grp) ? 'ChevronRight' : 'ChevronDown'} size={12} />
                      {grp}
                      <span className="bg-border text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">
                        {grpTasks.length}
                      </span>
                    </button>
                  </td>
                </tr>
              )}
              {!collapsed.has(grp) && grpTasks.map((task, idx) => (
                <tr
                  key={task.id}
                  className={`border-b border-border hover:bg-muted/20 transition-colors group ${idx % 2 === 1 ? 'bg-muted/5' : ''}`}
                >
                  {editing === task.id ? (
                    <>
                      <td className="px-3 py-1.5 text-center text-xs text-muted-foreground">{task.num}</td>
                      <td className="px-3 py-1.5">
                        <input className={inputCls} value={editData.docName || ''} onChange={e => setEditData(d => ({ ...d, docName: e.target.value }))} />
                      </td>
                      <td className="px-3 py-1.5">
                        <input className={inputCls} value={editData.cipher || ''} onChange={e => setEditData(d => ({ ...d, cipher: e.target.value }))} />
                      </td>
                      <td className="px-3 py-1.5">
                        <select className={inputCls} value={editData.assignee || ''} onChange={e => setEditData(d => ({ ...d, assignee: e.target.value }))}>
                          {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-1.5">
                        <input className={inputCls} value={editData.workName || ''} onChange={e => setEditData(d => ({ ...d, workName: e.target.value }))} />
                      </td>
                      <td className="px-3 py-1.5">
                        <input type="date" className={inputCls} value={editData.startDate || ''} onChange={e => setEditData(d => ({ ...d, startDate: e.target.value }))} />
                      </td>
                      <td className="px-3 py-1.5">
                        <input type="date" className={inputCls} value={editData.endDate || ''} onChange={e => setEditData(d => ({ ...d, endDate: e.target.value }))} />
                      </td>
                      <td className="px-3 py-1.5">
                        <input type="number" min="0" className="w-14 text-xs border border-primary/50 rounded px-1.5 py-1 bg-background outline-none focus:ring-1 focus:ring-primary text-center" value={editData.hoursTotal ?? 0} onChange={e => setEditData(d => ({ ...d, hoursTotal: +e.target.value }))} />
                      </td>
                      <td className="px-3 py-1.5 text-center text-xs text-muted-foreground">
                        {hoursToDays(editData.hoursTotal ?? 0)}
                      </td>
                      <td className="px-3 py-1.5">
                        <select className={inputCls} value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as TaskStatus }))}>
                          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="flex gap-1">
                          <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-700 p-1 rounded hover:bg-emerald-50"><Icon name="Check" size={13} /></button>
                          <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"><Icon name="X" size={13} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2.5 text-center text-xs text-muted-foreground font-mono">{task.num}</td>
                      <td className="px-3 py-2.5">
                        <div className="text-xs font-medium text-foreground leading-snug">{task.docName}</div>
                        {task.notes && <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[200px]">{task.notes}</div>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs mono text-primary font-medium">{task.cipher}</span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{task.assignee}</td>
                      <td className="px-3 py-2.5 text-xs text-foreground/80 leading-snug max-w-[260px]">{task.workName}</td>
                      <td className="px-3 py-2.5 text-center text-xs mono text-muted-foreground whitespace-nowrap">{fmt(task.startDate)}</td>
                      <td className="px-3 py-2.5 text-center text-xs mono text-muted-foreground whitespace-nowrap">{fmt(task.endDate)}</td>
                      <td className="px-3 py-2.5 text-center text-xs mono font-medium text-foreground">{task.hoursTotal}</td>
                      <td className="px-3 py-2.5 text-center text-xs mono text-muted-foreground">{hoursToDays(task.hoursTotal)}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[task.status]}`}>
                          {STATUS_LABELS[task.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(task)} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"><Icon name="Pencil" size={12} /></button>
                          <button onClick={() => onDelete(task.id)} className="text-muted-foreground hover:text-red-500 p-1 rounded hover:bg-red-50"><Icon name="Trash2" size={12} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </>
          ))}
        </tbody>

        {tasks.length > 0 && (
          <tfoot className="sticky bottom-0 bg-card border-t-2 border-border">
            <tr>
              <td colSpan={7} className="px-3 py-2 text-xs font-medium text-muted-foreground">Итого: {tasks.length} позиций</td>
              <td className="px-3 py-2 text-center text-xs mono font-semibold text-foreground">
                {tasks.reduce((s, t) => s + t.hoursTotal, 0)}
              </td>
              <td className="px-3 py-2 text-center text-xs mono font-semibold text-foreground">
                {hoursToDays(tasks.reduce((s, t) => s + t.hoursTotal, 0))}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        )}
      </table>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Icon name="SearchX" size={32} className="mb-3 opacity-30" />
          <p className="text-sm">Записи не найдены</p>
          <p className="text-xs mt-1 opacity-60">Измените фильтры или добавьте запись</p>
        </div>
      )}
    </div>
  );
}

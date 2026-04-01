import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { Task, TaskStatus } from '@/data/mockData';
import { STATUS_LABELS, STATUS_COLORS, ASSIGNEES, PROJECTS, DOC_MARKS, WORK_TEMPLATES, WORK_CATEGORIES, hoursToDays } from '@/data/mockData';

interface TaskTableProps {
  tasks: Task[];
  allTasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  groupBy: string;
}

type SortKey = keyof Task;

export default function TaskTable({ tasks, allTasks, onUpdate, onDelete, groupBy }: TaskTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('num');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [expandedDeps, setExpandedDeps] = useState<string | null>(null);

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
  const saveEdit = () => { if (editing && editData) { onUpdate({ ...editData } as Task); setEditing(null); } };
  const cancelEdit = () => setEditing(null);

  const toggleGroup = (g: string) => {
    setCollapsed(prev => { const next = new Set(prev); if (next.has(g)) next.delete(g); else next.add(g); return next; });
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });

  const isBlocked = (task: Task) => task.dependsOn.some(depId => {
    const dep = allTasks.find(t => t.id === depId);
    return dep && dep.status !== 'done';
  });

  const getDepTasks = (task: Task) => task.dependsOn.map(id => allTasks.find(t => t.id === id)).filter(Boolean) as Task[];
  const getProjectColor = (projectId: string) => PROJECTS.find(p => p.id === projectId)?.color || '#888';

  const SortIcon = ({ k }: { k: SortKey }) => (
    <Icon name={sortKey === k ? (sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'} size={11}
      className={sortKey === k ? 'text-primary' : 'text-muted-foreground opacity-40'} />
  );
  const Th = ({ label, k, w, center }: { label: string; k: SortKey; w?: string; center?: boolean }) => (
    <th className={`px-2.5 py-2.5 text-[11px] font-medium text-muted-foreground whitespace-nowrap ${center ? 'text-center' : 'text-left'} ${w || ''}`}>
      <button onClick={() => sort(k)} className={`flex items-center gap-1 hover:text-foreground transition-colors ${center ? 'mx-auto' : ''}`}>
        {label}<SortIcon k={k} />
      </button>
    </th>
  );
  const inputCls = "w-full text-xs border border-primary/50 rounded px-1.5 py-1 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <table className="w-full border-collapse text-sm min-w-[1200px]">
        <thead className="sticky top-0 z-10 bg-card border-b-2 border-border">
          <tr>
            <th className="px-2.5 py-2.5 text-center text-[11px] font-medium text-muted-foreground w-8">№</th>
            <th className="px-2.5 py-2.5 text-[11px] font-medium text-muted-foreground w-4"></th>
            <Th label="Комплект документации" k="docName" w="min-w-[150px]" />
            <Th label="Шифр" k="cipher" w="w-24" />
            <Th label="Марка" k="mark" w="w-14" />
            <Th label="Исполнитель" k="assignee" w="w-28" />
            <Th label="Наименование работы" k="workName" w="min-w-[170px]" />
            <th className="px-2.5 py-2.5 text-[11px] font-medium text-muted-foreground w-32 text-left">Задание от</th>
            <Th label="Старт" k="startDate" w="w-20" center />
            <Th label="Финиш" k="endDate" w="w-20" center />
            <Th label="ч/ч" k="hoursTotal" w="w-12" center />
            <Th label="дни" k="hoursTotal" w="w-12" center />
            <th className="px-2.5 py-2.5 text-[11px] font-medium text-muted-foreground w-24 text-center">Статус</th>
            <th className="px-2.5 py-2.5 w-14"></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([grp, grpTasks]) => (
            <>
              {groupBy && grp && (
                <tr key={`g-${grp}`} className="bg-muted/50">
                  <td colSpan={14} className="px-3 py-1.5">
                    <button onClick={() => toggleGroup(grp)} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                      <Icon name={collapsed.has(grp) ? 'ChevronRight' : 'ChevronDown'} size={12} />
                      {grp}
                      <span className="bg-border text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">{grpTasks.length}</span>
                    </button>
                  </td>
                </tr>
              )}
              {!collapsed.has(grp) && grpTasks.map((task, idx) => {
                const blocked = isBlocked(task) && task.status !== 'done';
                const deps = getDepTasks(task);
                const projColor = getProjectColor(task.projectId);
                return (
                  <>
                    <tr key={task.id} className={`border-b border-border hover:bg-muted/20 transition-colors group ${idx % 2 === 1 ? 'bg-muted/5' : ''} ${blocked ? 'opacity-80' : ''}`}>
                      {editing === task.id ? (
                        <>
                          <td className="px-2.5 py-1.5 text-center text-xs text-muted-foreground mono">{task.num}</td>
                          <td className="px-1"><div className="w-1 h-6 rounded-full" style={{ backgroundColor: projColor }} /></td>
                          <td className="px-2.5 py-1.5"><input className={inputCls} value={editData.docName || ''} onChange={e => setEditData(d => ({ ...d, docName: e.target.value }))} /></td>
                          <td className="px-2.5 py-1.5"><input className={inputCls} value={editData.cipher || ''} onChange={e => setEditData(d => ({ ...d, cipher: e.target.value }))} /></td>
                          <td className="px-2.5 py-1.5">
                            <select className={inputCls} value={editData.mark || ''} onChange={e => {
                              const m = DOC_MARKS.find(dm => dm.code === e.target.value);
                              setEditData(d => ({ ...d, mark: e.target.value, markType: m?.type || 'PD', docName: m ? m.name : d.docName }));
                            }}>
                              <optgroup label="ПД">{DOC_MARKS.filter(m => m.type === 'PD').map(m => <option key={m.code} value={m.code}>{m.code}</option>)}</optgroup>
                              <optgroup label="РД">{DOC_MARKS.filter(m => m.type === 'RD').map(m => <option key={m.code} value={m.code}>{m.code}</option>)}</optgroup>
                            </select>
                          </td>
                          <td className="px-2.5 py-1.5">
                            <select className={inputCls} value={editData.assignee || ''} onChange={e => setEditData(d => ({ ...d, assignee: e.target.value }))}>
                              {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                          </td>
                          <td className="px-2.5 py-1.5">
                            <select className={inputCls} value={editData.workName || ''} onChange={e => {
                              const wt = WORK_TEMPLATES.find(w => w.name === e.target.value);
                              setEditData(d => ({ ...d, workName: e.target.value, workCategory: wt?.category || d.workCategory, hoursTotal: wt ? wt.defaultHours : d.hoursTotal }));
                            }}>
                              {WORK_CATEGORIES.map(cat => (
                                <optgroup key={cat} label={cat}>
                                  {WORK_TEMPLATES.filter(w => w.category === cat).map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                                </optgroup>
                              ))}
                            </select>
                          </td>
                          <td className="px-2.5 py-1.5">
                            <input className={inputCls} placeholder="От кого задание..." value={editData.assignmentNote || ''} onChange={e => setEditData(d => ({ ...d, assignmentNote: e.target.value }))} />
                          </td>
                          <td className="px-2.5 py-1.5"><input type="date" className={inputCls} value={editData.startDate || ''} onChange={e => setEditData(d => ({ ...d, startDate: e.target.value }))} /></td>
                          <td className="px-2.5 py-1.5"><input type="date" className={inputCls} value={editData.endDate || ''} onChange={e => setEditData(d => ({ ...d, endDate: e.target.value }))} /></td>
                          <td className="px-2.5 py-1.5"><input type="number" min="1" className="w-12 text-xs border border-primary/50 rounded px-1 py-1 bg-background outline-none text-center" value={editData.hoursTotal ?? 0} onChange={e => setEditData(d => ({ ...d, hoursTotal: +e.target.value }))} /></td>
                          <td className="px-2.5 py-1.5 text-center text-xs mono text-muted-foreground">{hoursToDays(editData.hoursTotal ?? 0)}</td>
                          <td className="px-2.5 py-1.5">
                            <select className={inputCls} value={editData.status || ''} onChange={e => setEditData(d => ({ ...d, status: e.target.value as TaskStatus }))}>
                              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                          </td>
                          <td className="px-2.5 py-1.5">
                            <div className="flex gap-1">
                              <button onClick={saveEdit} className="text-emerald-600 hover:text-emerald-700 p-1 rounded hover:bg-emerald-50"><Icon name="Check" size={13} /></button>
                              <button onClick={cancelEdit} className="text-muted-foreground p-1 rounded hover:bg-muted"><Icon name="X" size={13} /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2.5 py-2.5 text-center text-xs text-muted-foreground mono">{task.num}</td>
                          <td className="px-1 py-2.5"><div className="w-1 h-5 rounded-full" style={{ backgroundColor: projColor }} title={PROJECTS.find(p => p.id === task.projectId)?.name} /></td>
                          <td className="px-2.5 py-2.5">
                            <div className="text-xs font-medium text-foreground leading-snug">{task.docName}</div>
                            {task.notes && <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[150px]">{task.notes}</div>}
                          </td>
                          <td className="px-2.5 py-2.5"><span className="text-xs mono text-primary font-medium">{task.cipher}</span></td>
                          <td className="px-2.5 py-2.5">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${task.markType === 'PD' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>{task.mark}</span>
                          </td>
                          <td className="px-2.5 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{task.assignee}</td>
                          <td className="px-2.5 py-2.5 text-xs text-foreground/80 max-w-[190px]">
                            <div className="truncate">{task.workName}</div>
                            <div className="text-[10px] text-muted-foreground">{task.workCategory}</div>
                          </td>
                          <td className="px-2.5 py-2.5">
                            {task.assignmentFrom ? (
                              <div>
                                <div className="text-[10px] font-medium text-foreground">{task.assignmentFrom}</div>
                                <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{task.assignmentNote}</div>
                              </div>
                            ) : <span className="text-muted-foreground/30 text-[10px]">—</span>}
                          </td>
                          <td className="px-2.5 py-2.5 text-center text-xs mono text-muted-foreground whitespace-nowrap">{fmt(task.startDate)}</td>
                          <td className="px-2.5 py-2.5 text-center text-xs mono text-muted-foreground whitespace-nowrap">{fmt(task.endDate)}</td>
                          <td className="px-2.5 py-2.5 text-center text-xs mono font-medium text-foreground">{task.hoursTotal}</td>
                          <td className="px-2.5 py-2.5 text-center text-xs mono text-muted-foreground">{hoursToDays(task.hoursTotal)}</td>
                          <td className="px-2.5 py-2.5 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[task.status]}`}>{STATUS_LABELS[task.status]}</span>
                              {deps.length > 0 && (
                                <button onClick={() => setExpandedDeps(expandedDeps === task.id ? null : task.id)}
                                  className={`flex items-center gap-0.5 text-[9px] ${blocked ? 'text-purple-600 font-medium' : 'text-muted-foreground'} hover:text-foreground`}>
                                  <Icon name="Link2" size={9} />{deps.length} зав.
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-2.5 py-2.5">
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(task)} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"><Icon name="Pencil" size={12} /></button>
                              <button onClick={() => onDelete(task.id)} className="text-muted-foreground hover:text-red-500 p-1 rounded hover:bg-red-50"><Icon name="Trash2" size={12} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                    {expandedDeps === task.id && deps.length > 0 && (
                      <tr key={`dep-${task.id}`} className="bg-purple-50/50">
                        <td colSpan={14} className="px-10 py-2 border-b border-border">
                          <div className="flex items-start gap-2">
                            <Icon name="CornerDownRight" size={12} className="text-purple-500 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-medium text-purple-700 mb-1.5">Зависит от:</p>
                              <div className="flex flex-wrap gap-2">
                                {deps.map(dep => (
                                  <div key={dep.id} className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border ${dep.status === 'done' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                    <Icon name={dep.status === 'done' ? 'CheckCircle2' : 'Clock'} size={10} />
                                    <span className="mono font-medium">{dep.cipher}</span>
                                    <span>— {dep.assignee}</span>
                                    <span className="opacity-60">{STATUS_LABELS[dep.status]}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </>
          ))}
        </tbody>
        {tasks.length > 0 && (
          <tfoot className="sticky bottom-0 bg-card border-t-2 border-border">
            <tr>
              <td colSpan={10} className="px-3 py-2 text-xs font-medium text-muted-foreground">Итого: {tasks.length} позиций</td>
              <td className="px-2.5 py-2 text-center text-xs mono font-semibold text-foreground">{tasks.reduce((s, t) => s + t.hoursTotal, 0)}</td>
              <td className="px-2.5 py-2 text-center text-xs mono font-semibold text-foreground">{hoursToDays(tasks.reduce((s, t) => s + t.hoursTotal, 0))}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        )}
      </table>
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Icon name="SearchX" size={32} className="mb-3 opacity-30" />
          <p className="text-sm">Записи не найдены</p>
        </div>
      )}
    </div>
  );
}

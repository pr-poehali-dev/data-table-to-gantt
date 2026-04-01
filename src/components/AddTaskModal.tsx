import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Task, TaskStatus } from '@/data/mockData';
import { ASSIGNEES, PROJECTS, DOC_MARKS, WORK_TEMPLATES, WORK_CATEGORIES, STATUS_LABELS, hoursToDays } from '@/data/mockData';

interface AddTaskModalProps {
  tasksCount: number;
  activeProjectId: string | 'all';
  allTasks: Task[];
  onAdd: (tasks: Task[]) => void;
  onClose: () => void;
}

const EMPTY: Partial<Task> = {
  projectId: 'p1',
  num: 1,
  docName: '',
  cipher: '',
  mark: 'АР',
  markType: 'PD',
  assignee: ASSIGNEES[0],
  workName: WORK_TEMPLATES[0].name,
  workCategory: WORK_TEMPLATES[0].category,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  hoursTotal: 8,
  status: 'planned',
  dependsOn: [],
  assignmentFrom: '',
  assignmentNote: '',
  notes: '',
};

export default function AddTaskModal({ tasksCount, activeProjectId, allTasks, onAdd, onClose }: AddTaskModalProps) {
  const [tab, setTab] = useState<'manual' | 'excel'>('manual');
  const [data, setData] = useState<Partial<Task>>({
    ...EMPTY,
    projectId: activeProjectId !== 'all' ? activeProjectId : 'p1',
    num: tasksCount + 1,
  });
  const [excelRows, setExcelRows] = useState<Partial<Task>[]>([]);
  const [excelError, setExcelError] = useState('');
  const [depSearch, setDepSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Task, val: string | number | string[]) => setData(d => ({ ...d, [key]: val }));

  const handleAdd = () => {
    if (!data.docName) return;
    onAdd([{ ...data, id: `task-${Date.now()}` } as Task]);
    onClose();
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcelError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target?.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        if (rows.length < 2) { setExcelError('Файл пустой или не содержит данных'); return; }

        // Пропускаем заголовок (строка 0), читаем со строки 1
        // Ожидаемые колонки: № | Комплект | Шифр | Марка | Исполнитель | Работа | Старт | Финиш | ч/ч | Статус
        const parsed: Partial<Task>[] = rows.slice(1).filter(r => r[1]).map((r, idx) => {
          const markCode = String(r[3] || 'АР').trim();
          const markDef = DOC_MARKS.find(m => m.code === markCode);
          const startRaw = r[6] ? new Date(r[6]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
          const endRaw   = r[7] ? new Date(r[7]).toISOString().split('T')[0] : new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
          const wt = WORK_TEMPLATES.find(w => w.name === String(r[5] || '').trim());
          return {
            id: `task-excel-${Date.now()}-${idx}`,
            projectId: activeProjectId !== 'all' ? activeProjectId : 'p1',
            num: tasksCount + idx + 1,
            docName: String(r[1] || markDef?.name || '').trim(),
            cipher: String(r[2] || '').trim(),
            mark: markCode,
            markType: markDef?.type || 'PD',
            assignee: String(r[4] || ASSIGNEES[0]).trim(),
            workName: String(r[5] || WORK_TEMPLATES[0].name).trim(),
            workCategory: wt?.category || 'Проектирование',
            startDate: startRaw,
            endDate: endRaw,
            hoursTotal: +r[8] || 8,
            status: (r[9] as TaskStatus) || 'planned',
            dependsOn: [],
          };
        });
        setExcelRows(parsed);
      } catch {
        setExcelError('Ошибка чтения файла. Проверьте формат.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExcelAdd = () => {
    if (excelRows.length === 0) return;
    onAdd(excelRows as Task[]);
    onClose();
  };

  const projectTasks = allTasks.filter(t => t.projectId === data.projectId);

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-medium text-muted-foreground mb-1">{children}</label>
  );
  const inputCls = "w-full h-8 text-xs border border-border rounded px-2.5 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl mx-4 animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div>
            <h2 className="text-sm font-medium text-foreground">Новая запись</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Позиция № {data.num}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-muted rounded p-0.5">
              <button onClick={() => setTab('manual')} className={`text-xs px-3 py-1 rounded transition-all ${tab === 'manual' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                Вручную
              </button>
              <button onClick={() => setTab('excel')} className={`text-xs px-3 py-1 rounded transition-all flex items-center gap-1.5 ${tab === 'excel' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                <Icon name="FileSpreadsheet" size={12} />
                Из Excel
              </button>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {tab === 'manual' ? (
            <div className="p-5 space-y-4">
              {/* Проект */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Проект</Label>
                  <select className={inputCls} value={data.projectId} onChange={e => set('projectId', e.target.value)}>
                    {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Статус</Label>
                  <select className={inputCls} value={data.status} onChange={e => set('status', e.target.value as TaskStatus)}>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              {/* Марка + документ */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Марка (по №87)</Label>
                  <select className={inputCls} value={data.mark} onChange={e => {
                    const m = DOC_MARKS.find(dm => dm.code === e.target.value);
                    set('mark', e.target.value);
                    set('markType', m?.type || 'PD');
                    if (m) set('docName', m.name);
                  }}>
                    <optgroup label="Проектная документация (ПД)">
                      {DOC_MARKS.filter(m => m.type === 'PD').map(m => <option key={m.code} value={m.code}>{m.code} — {m.name}</option>)}
                    </optgroup>
                    <optgroup label="Рабочая документация (РД)">
                      {DOC_MARKS.filter(m => m.type === 'RD').map(m => <option key={m.code} value={m.code}>{m.code} — {m.name}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label>Наименование комплекта документации</Label>
                  <input className={inputCls} placeholder="Уточните при необходимости..." value={data.docName || ''} onChange={e => set('docName', e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Шифр</Label>
                <input className={inputCls} placeholder="Например: П1-АР-001" value={data.cipher || ''} onChange={e => set('cipher', e.target.value)} />
              </div>

              {/* Вид работы */}
              <div>
                <Label>Наименование работы (задания)</Label>
                <select className={inputCls} value={data.workName} onChange={e => {
                  const wt = WORK_TEMPLATES.find(w => w.name === e.target.value);
                  set('workName', e.target.value);
                  if (wt) { set('workCategory', wt.category); set('hoursTotal', wt.defaultHours); }
                }}>
                  {WORK_CATEGORIES.map(cat => (
                    <optgroup key={cat} label={cat}>
                      {WORK_TEMPLATES.filter(w => w.category === cat).map(w => (
                        <option key={w.id} value={w.name}>{w.name} ({w.defaultHours} ч)</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Исполнитель + задание */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Исполнитель</Label>
                  <select className={inputCls} value={data.assignee} onChange={e => set('assignee', e.target.value)}>
                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Задание от (исполнитель)</Label>
                  <select className={inputCls} value={data.assignmentFrom || ''} onChange={e => set('assignmentFrom', e.target.value)}>
                    <option value="">— не указано —</option>
                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              {data.assignmentFrom && (
                <div>
                  <Label>Направление / описание задания</Label>
                  <input className={inputCls} placeholder="Например: ИД для марки КЖ — нагрузки и планировки" value={data.assignmentNote || ''} onChange={e => set('assignmentNote', e.target.value)} />
                </div>
              )}

              {/* Даты и трудозатраты */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label>Старт</Label>
                  <input type="date" className={inputCls} value={data.startDate} onChange={e => set('startDate', e.target.value)} />
                </div>
                <div>
                  <Label>Финиш</Label>
                  <input type="date" className={inputCls} value={data.endDate} onChange={e => set('endDate', e.target.value)} />
                </div>
                <div>
                  <Label>Трудозатраты ч/ч</Label>
                  <input type="number" min="1" className={inputCls} value={data.hoursTotal ?? 8} onChange={e => set('hoursTotal', +e.target.value)} />
                </div>
                <div>
                  <Label>Трудозатраты дни</Label>
                  <div className="h-8 flex items-center px-2.5 text-xs border border-border rounded bg-muted/50 text-muted-foreground mono">
                    {hoursToDays(data.hoursTotal ?? 0)}
                  </div>
                </div>
              </div>

              {/* Зависимости */}
              <div>
                <Label>Зависит от (задачи-предшественники)</Label>
                <input
                  className={inputCls + ' mb-2'}
                  placeholder="Поиск по шифру или названию..."
                  value={depSearch}
                  onChange={e => setDepSearch(e.target.value)}
                />
                <div className="max-h-28 overflow-y-auto scrollbar-thin border border-border rounded divide-y divide-border">
                  {projectTasks.filter(t => t.id !== data.id && (
                    !depSearch || t.cipher.toLowerCase().includes(depSearch.toLowerCase()) || t.docName.toLowerCase().includes(depSearch.toLowerCase())
                  )).map(t => (
                    <label key={t.id} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-muted/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(data.dependsOn || []).includes(t.id)}
                        onChange={e => {
                          const cur = data.dependsOn || [];
                          set('dependsOn', e.target.checked ? [...cur, t.id] : cur.filter(x => x !== t.id));
                        }}
                        className="accent-primary"
                      />
                      <span className="text-xs mono text-primary w-20 flex-shrink-0">{t.cipher}</span>
                      <span className="text-xs text-foreground truncate">{t.docName}</span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{t.assignee}</span>
                    </label>
                  ))}
                  {projectTasks.length === 0 && <p className="text-xs text-muted-foreground px-3 py-2">Нет задач в этом проекте</p>}
                </div>
                {(data.dependsOn || []).length > 0 && (
                  <p className="text-[10px] text-primary mt-1">Выбрано: {(data.dependsOn || []).length} предшественников</p>
                )}
              </div>

              <div>
                <Label>Примечание</Label>
                <textarea className="w-full text-xs border border-border rounded px-2.5 py-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
                  rows={2} placeholder="Дополнительная информация..."
                  value={data.notes || ''} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
                <p className="text-xs font-medium text-foreground mb-2">Формат файла Excel</p>
                <div className="overflow-x-auto">
                  <table className="text-[10px] border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        {['A: №', 'B: Комплект', 'C: Шифр', 'D: Марка', 'E: Исполнитель', 'F: Вид работы', 'G: Старт', 'H: Финиш', 'I: ч/ч', 'J: Статус'].map(h => (
                          <th key={h} className="px-2 py-1 border border-border text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {['1', 'Архитектурные решения', 'П1-АР', 'АР', 'Петрова М.', 'Разработка проектной документации', '01.02.2024', '01.03.2024', '120', 'planned'].map((v, i) => (
                          <td key={i} className="px-2 py-1 border border-border text-muted-foreground whitespace-nowrap">{v}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Строка 1 — заголовки (пропускаются). Статус: planned / in_progress / done / delayed</p>
              </div>

              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Icon name="Upload" size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Выберите файл Excel</p>
                <p className="text-xs text-muted-foreground mt-1">.xlsx, .xls, .csv</p>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelImport} />
              </div>

              {excelError && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2.5">
                  <Icon name="AlertCircle" size={13} />
                  {excelError}
                </div>
              )}

              {excelRows.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-foreground">Найдено строк: <span className="text-primary">{excelRows.length}</span></p>
                    <button onClick={() => { setExcelRows([]); if (fileRef.current) fileRef.current.value = ''; }} className="text-xs text-muted-foreground hover:text-foreground">
                      Очистить
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto scrollbar-thin border border-border rounded divide-y divide-border">
                    {excelRows.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2 text-xs">
                        <span className="mono text-primary w-20 flex-shrink-0">{r.cipher || '—'}</span>
                        <span className="text-foreground truncate flex-1">{r.docName}</span>
                        <span className="text-muted-foreground flex-shrink-0">{r.assignee}</span>
                        <span className="mono text-muted-foreground flex-shrink-0">{r.hoursTotal} ч/ч</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border flex-shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">Отмена</Button>
          {tab === 'manual' ? (
            <Button size="sm" onClick={handleAdd} disabled={!data.docName} className="text-xs gap-2">
              <Icon name="Plus" size={13} />Добавить запись
            </Button>
          ) : (
            <Button size="sm" onClick={handleExcelAdd} disabled={excelRows.length === 0} className="text-xs gap-2">
              <Icon name="FileSpreadsheet" size={13} />Импортировать {excelRows.length > 0 ? `(${excelRows.length})` : ''}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

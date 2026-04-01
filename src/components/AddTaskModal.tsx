import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Task, TaskStatus } from '@/data/mockData';
import { ASSIGNEES, STATUS_LABELS, hoursToDays, initialTasks } from '@/data/mockData';

interface AddTaskModalProps {
  tasksCount: number;
  onAdd: (task: Task) => void;
  onClose: () => void;
}

export default function AddTaskModal({ tasksCount, onAdd, onClose }: AddTaskModalProps) {
  const [data, setData] = useState<Partial<Task>>({
    num: tasksCount + 1,
    docName: '',
    cipher: '',
    assignee: ASSIGNEES[0],
    workName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    hoursTotal: 8,
    status: 'planned',
    notes: '',
  });

  const set = (key: keyof Task, val: string | number) => setData(d => ({ ...d, [key]: val }));

  const handleAdd = () => {
    if (!data.docName) return;
    onAdd({ ...data, id: `task-${Date.now()}` } as Task);
    onClose();
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-medium text-muted-foreground mb-1">{children}</label>
  );

  const inputCls = "w-full h-8 text-xs border border-border rounded px-2.5 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-medium text-foreground">Новая запись</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Позиция № {data.num}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label>Наименование комплекта документации *</Label>
              <input
                className={inputCls}
                placeholder="Например: Рабочая документация"
                value={data.docName || ''}
                onChange={e => set('docName', e.target.value)}
              />
            </div>
            <div>
              <Label>Шифр</Label>
              <input
                className={inputCls}
                placeholder="РД-001"
                value={data.cipher || ''}
                onChange={e => set('cipher', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Наименование работ (задания)</Label>
            <input
              className={inputCls}
              placeholder="Описание выполняемых работ..."
              value={data.workName || ''}
              onChange={e => set('workName', e.target.value)}
            />
          </div>

          <div>
            <Label>Исполнитель</Label>
            <select className={inputCls} value={data.assignee} onChange={e => set('assignee', e.target.value)}>
              {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Старт</Label>
              <input type="date" className={inputCls} value={data.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div>
              <Label>Финиш</Label>
              <input type="date" className={inputCls} value={data.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Трудозатраты ч/ч</Label>
              <input
                type="number"
                min="1"
                className={inputCls}
                value={data.hoursTotal ?? 8}
                onChange={e => set('hoursTotal', +e.target.value)}
              />
            </div>
            <div>
              <Label>Трудозатраты дни</Label>
              <div className="h-8 flex items-center px-2.5 text-xs border border-border rounded bg-muted/50 text-muted-foreground mono">
                {hoursToDays(data.hoursTotal ?? 0)}
              </div>
            </div>
            <div>
              <Label>Статус</Label>
              <select className={inputCls} value={data.status} onChange={e => set('status', e.target.value as TaskStatus)}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label>Примечание</Label>
            <textarea
              className="w-full text-xs border border-border rounded px-2.5 py-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
              rows={2}
              placeholder="Дополнительная информация..."
              value={data.notes || ''}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">Отмена</Button>
          <Button size="sm" onClick={handleAdd} disabled={!data.docName} className="text-xs gap-2">
            <Icon name="Plus" size={13} />
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
}

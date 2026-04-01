import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Task, TaskStatus, TaskPriority } from '@/data/mockData';
import { GROUPS, ASSIGNEES, STATUS_LABELS, PRIORITY_LABELS } from '@/data/mockData';

interface AddTaskModalProps {
  onAdd: (task: Task) => void;
  onClose: () => void;
}

export default function AddTaskModal({ onAdd, onClose }: AddTaskModalProps) {
  const [data, setData] = useState<Partial<Task>>({
    name: '',
    group: GROUPS[0],
    assignee: ASSIGNEES[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'planned',
    priority: 'medium',
    progress: 0,
    budget: 0,
    spent: 0,
    notes: '',
  });

  const set = (key: keyof Task, val: string | number) => setData(d => ({ ...d, [key]: val }));

  const handleAdd = () => {
    if (!data.name) return;
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
          <h2 className="text-sm font-medium text-foreground">Новая задача</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Label>Название задачи *</Label>
            <input className={inputCls} placeholder="Введите название..." value={data.name || ''} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Группа</Label>
              <select className={inputCls} value={data.group} onChange={e => set('group', e.target.value)}>
                {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <Label>Исполнитель</Label>
              <select className={inputCls} value={data.assignee} onChange={e => set('assignee', e.target.value)}>
                {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Дата начала</Label>
              <input type="date" className={inputCls} value={data.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div>
              <Label>Дата окончания</Label>
              <input type="date" className={inputCls} value={data.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Статус</Label>
              <select className={inputCls} value={data.status} onChange={e => set('status', e.target.value as TaskStatus)}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <Label>Приоритет</Label>
              <select className={inputCls} value={data.priority} onChange={e => set('priority', e.target.value as TaskPriority)}>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Прогресс (%)</Label>
              <input type="number" min="0" max="100" className={inputCls} value={data.progress ?? 0} onChange={e => set('progress', +e.target.value)} />
            </div>
            <div>
              <Label>Бюджет (₽)</Label>
              <input type="number" className={inputCls} value={data.budget ?? 0} onChange={e => set('budget', +e.target.value)} />
            </div>
            <div>
              <Label>Потрачено (₽)</Label>
              <input type="number" className={inputCls} value={data.spent ?? 0} onChange={e => set('spent', +e.target.value)} />
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
          <Button size="sm" onClick={handleAdd} disabled={!data.name} className="text-xs gap-2">
            <Icon name="Plus" size={13} />
            Добавить задачу
          </Button>
        </div>
      </div>
    </div>
  );
}

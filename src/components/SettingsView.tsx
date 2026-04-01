import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Settings {
  projectName: string;
  currency: string;
  weekStart: string;
  notifications: boolean;
  notifyDelay: boolean;
  notifyBudget: boolean;
  budgetThreshold: number;
  defaultView: string;
  groupBy: string;
}

interface SettingsViewProps {
  settings: Settings;
  onSave: (s: Settings) => void;
}

export default function SettingsView({ settings, onSave }: SettingsViewProps) {
  const [local, setLocal] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Settings, value: string | boolean | number) => {
    setLocal(s => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-lg p-5 mb-4">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
        <Icon name={icon} size={15} className="text-primary" />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {desc && <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-9 h-5 rounded-full transition-all duration-200 relative ${value ? 'bg-primary' : 'bg-muted'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-4' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="flex-1 overflow-auto scrollbar-thin p-6">
      <div className="max-w-xl">
        <div className="mb-6">
          <h2 className="text-base font-medium text-foreground">Настройки</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Параметры проекта и отображения</p>
        </div>

        <Section title="Проект" icon="Folder">
          <Field label="Название проекта" desc="Отображается в заголовке">
            <input
              className="h-8 text-xs border border-border rounded px-2.5 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary w-48"
              value={local.projectName}
              onChange={e => set('projectName', e.target.value)}
            />
          </Field>
          <Field label="Валюта" desc="Используется для отображения бюджетов">
            <select
              className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={local.currency}
              onChange={e => set('currency', e.target.value)}
            >
              <option value="RUB">₽ Российский рубль</option>
              <option value="USD">$ Доллар США</option>
              <option value="EUR">€ Евро</option>
            </select>
          </Field>
          <Field label="Начало недели">
            <select
              className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={local.weekStart}
              onChange={e => set('weekStart', e.target.value)}
            >
              <option value="monday">Понедельник</option>
              <option value="sunday">Воскресенье</option>
            </select>
          </Field>
        </Section>

        <Section title="Отображение" icon="LayoutDashboard">
          <Field label="Вид по умолчанию">
            <select
              className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={local.defaultView}
              onChange={e => set('defaultView', e.target.value)}
            >
              <option value="table">Таблица</option>
              <option value="gantt">График Ганта</option>
            </select>
          </Field>
          <Field label="Группировка по умолчанию">
            <select
              className="h-8 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={local.groupBy}
              onChange={e => set('groupBy', e.target.value)}
            >
              <option value="">Без группировки</option>
              <option value="group">По группе</option>
              <option value="assignee">По исполнителю</option>
              <option value="status">По статусу</option>
              <option value="priority">По приоритету</option>
            </select>
          </Field>
        </Section>

        <Section title="Уведомления" icon="Bell">
          <Field label="Уведомления" desc="Показывать системные уведомления">
            <Toggle value={local.notifications} onChange={v => set('notifications', v)} />
          </Field>
          <Field label="Задержки" desc="Уведомлять о просроченных задачах">
            <Toggle value={local.notifyDelay} onChange={v => set('notifyDelay', v)} />
          </Field>
          <Field label="Превышение бюджета" desc="Уведомлять при превышении бюджета">
            <Toggle value={local.notifyBudget} onChange={v => set('notifyBudget', v)} />
          </Field>
          {local.notifyBudget && (
            <Field label="Порог предупреждения" desc="% использования бюджета для уведомления">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50" max="100"
                  className="h-8 w-16 text-xs border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
                  value={local.budgetThreshold}
                  onChange={e => set('budgetThreshold', +e.target.value)}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </Field>
          )}
        </Section>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} size="sm" className="gap-2">
            {saved ? <Icon name="Check" size={13} /> : <Icon name="Save" size={13} />}
            {saved ? 'Сохранено' : 'Сохранить настройки'}
          </Button>
          {saved && <span className="text-xs text-emerald-600 animate-fade-in">Изменения применены</span>}
        </div>
      </div>
    </div>
  );
}

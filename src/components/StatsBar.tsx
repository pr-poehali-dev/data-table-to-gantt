import Icon from '@/components/ui/icon';
import type { Task } from '@/data/mockData';
import { hoursToDays } from '@/data/mockData';

interface StatsBarProps {
  tasks: Task[];
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const delayed = tasks.filter(t => t.status === 'delayed').length;
  const totalHours = tasks.reduce((s, t) => s + t.hoursTotal, 0);
  const totalDays = hoursToDays(totalHours);

  const stats = [
    { label: 'Позиций', value: total, icon: 'FileText', color: 'text-foreground' },
    { label: 'Выполнено', value: done, icon: 'CheckCircle2', color: 'text-emerald-600' },
    { label: 'В работе', value: inProgress, icon: 'Loader2', color: 'text-blue-600' },
    { label: 'Задержки', value: delayed, icon: 'AlertCircle', color: 'text-red-500' },
    { label: 'Трудозатраты ч/ч', value: totalHours.toLocaleString('ru-RU'), icon: 'Clock', color: 'text-foreground' },
    { label: 'Трудозатраты дни', value: totalDays.toLocaleString('ru-RU'), icon: 'CalendarDays', color: 'text-foreground' },
  ];

  return (
    <div className="flex items-center gap-0 border-b border-border bg-card overflow-x-auto scrollbar-thin">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex items-center gap-2.5 px-5 py-3 ${i < stats.length - 1 ? 'border-r border-border' : ''} whitespace-nowrap flex-shrink-0`}
        >
          <Icon name={s.icon} size={14} className={s.color} />
          <div>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
            <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}

      {total > 0 && (
        <>
          <div className="flex-1" />
          <div className="px-5 py-3 flex-shrink-0 border-l border-border">
            <p className="text-[10px] text-muted-foreground mb-1">Готовность</p>
            <div className="flex items-center gap-2">
              <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${total > 0 ? Math.round((done / total) * 100) : 0}%` }}
                />
              </div>
              <span className="text-xs font-medium mono text-foreground">
                {total > 0 ? Math.round((done / total) * 100) : 0}%
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

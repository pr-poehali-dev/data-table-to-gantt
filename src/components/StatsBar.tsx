import Icon from '@/components/ui/icon';
import type { Task } from '@/data/mockData';

interface StatsBarProps {
  tasks: Task[];
}

export default function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const delayed = tasks.filter(t => t.status === 'delayed').length;
  const totalBudget = tasks.reduce((s, t) => s + t.budget, 0);
  const totalSpent = tasks.reduce((s, t) => s + t.spent, 0);
  const avgProgress = total > 0 ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / total) : 0;

  const fmt = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + ' млн';
    if (n >= 1000) return Math.round(n / 1000) + ' тыс';
    return n.toString();
  };

  const stats = [
    { label: 'Всего задач', value: total, icon: 'ListTodo', color: 'text-foreground' },
    { label: 'Выполнено', value: done, icon: 'CheckCircle2', color: 'text-emerald-600' },
    { label: 'В работе', value: inProgress, icon: 'Loader2', color: 'text-blue-600' },
    { label: 'Задержки', value: delayed, icon: 'AlertCircle', color: 'text-red-500' },
    { label: 'Прогресс', value: `${avgProgress}%`, icon: 'TrendingUp', color: 'text-blue-600' },
    { label: 'Бюджет', value: fmt(totalBudget) + ' ₽', icon: 'Wallet', color: 'text-foreground' },
    { label: 'Потрачено', value: fmt(totalSpent) + ' ₽', icon: 'Receipt', color: totalSpent > totalBudget ? 'text-red-600' : 'text-muted-foreground' },
  ];

  return (
    <div className="flex items-center gap-0 border-b border-border bg-card overflow-x-auto scrollbar-thin">
      {stats.map((s, i) => (
        <div key={s.label} className={`flex items-center gap-2.5 px-5 py-3 ${i < stats.length - 1 ? 'border-r border-border' : ''} whitespace-nowrap flex-shrink-0`}>
          <Icon name={s.icon} size={14} className={s.color} />
          <div>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
            <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}

      <div className="flex-1" />

      <div className="px-5 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground mono">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% бюджета
          </span>
        </div>
      </div>
    </div>
  );
}

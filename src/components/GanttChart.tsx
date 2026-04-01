import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import type { Task } from '@/data/mockData';
import { STATUS_LABELS, GANTT_COLORS } from '@/data/mockData';

interface GanttChartProps {
  tasks: Task[];
}

type ZoomLevel = 'week' | 'month' | 'quarter';

const ZOOM_CONFIGS: Record<ZoomLevel, { label: string; days: number; colW: number }> = {
  week: { label: 'Недели', days: 7, colW: 100 },
  month: { label: 'Месяцы', days: 30, colW: 80 },
  quarter: { label: 'Кварталы', days: 90, colW: 120 },
};

const GROUP_COLORS: Record<string, string> = {};
const KNOWN_GROUPS = ['Разработка', 'Дизайн', 'Маркетинг', 'Аналитика', 'Инфраструктура'];
KNOWN_GROUPS.forEach((g, i) => { GROUP_COLORS[g] = GANTT_COLORS[i % GANTT_COLORS.length]; });

function getColor(group: string) {
  if (!GROUP_COLORS[group]) GROUP_COLORS[group] = GANTT_COLORS[Object.keys(GROUP_COLORS).length % GANTT_COLORS.length];
  return GROUP_COLORS[group];
}

export default function GanttChart({ tasks }: GanttChartProps) {
  const [zoom, setZoom] = useState<ZoomLevel>('month');
  const [tooltip, setTooltip] = useState<{ task: Task; x: number; y: number } | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cfg = ZOOM_CONFIGS[zoom];

  const allDates = tasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]);
  const minDate = allDates.length ? new Date(Math.min(...allDates.map(d => d.getTime()))) : new Date();
  const maxDate = allDates.length ? new Date(Math.max(...allDates.map(d => d.getTime()))) : new Date();

  minDate.setDate(minDate.getDate() - cfg.days);
  maxDate.setDate(maxDate.getDate() + cfg.days);

  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / 86400000);
  const PX_PER_DAY = cfg.colW / cfg.days;

  const today = new Date();
  const todayOffset = Math.floor((today.getTime() - minDate.getTime()) / 86400000) * PX_PER_DAY;

  const getOffset = (d: string) => Math.floor((new Date(d).getTime() - minDate.getTime()) / 86400000) * PX_PER_DAY;
  const getWidth = (start: string, end: string) => Math.max(8, (new Date(end).getTime() - new Date(start).getTime()) / 86400000 * PX_PER_DAY);

  const months: { label: string; left: number; width: number }[] = [];
  let cur = new Date(minDate);
  while (cur < maxDate) {
    const left = Math.floor((cur.getTime() - minDate.getTime()) / 86400000) * PX_PER_DAY;
    const next = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    const width = Math.floor((Math.min(next, maxDate).getTime() - cur.getTime()) / 86400000) * PX_PER_DAY;
    months.push({ label: cur.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' }), left, width });
    cur = next;
  }

  const totalWidth = totalDays * PX_PER_DAY;
  const ROW_H = 36;
  const LABEL_W = 200;

  const toggleCompare = (id: string) => {
    setCompare(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  useEffect(() => {
    if (scrollRef.current && todayOffset > 0) {
      scrollRef.current.scrollLeft = Math.max(0, todayOffset - 200);
    }
  }, [tasks.length]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-1 bg-muted rounded p-0.5">
          {(Object.keys(ZOOM_CONFIGS) as ZoomLevel[]).map(z => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className={`text-xs px-3 py-1 rounded transition-all ${zoom === z ? 'bg-card shadow-sm text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {ZOOM_CONFIGS[z].label}
            </button>
          ))}
        </div>

        {compare.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="GitCompare" size={13} />
            Сравнение: <span className="font-medium text-foreground">{compare.length} задач</span>
            <button onClick={() => setCompare([])} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={12} />
            </button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          {KNOWN_GROUPS.map((g, i) => (
            <div key={g} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: GANTT_COLORS[i] }} />
              {g}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[200px] min-w-[200px] border-r border-border flex flex-col">
          <div className="h-10 border-b border-border px-3 flex items-center">
            <span className="text-xs font-medium text-muted-foreground">Задача</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`h-[36px] flex items-center px-3 border-b border-border/50 gap-2 cursor-pointer transition-colors ${compare.includes(task.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                onClick={() => toggleCompare(task.id)}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getColor(task.group) }} />
                <span className="text-xs truncate text-foreground">{task.name}</span>
                {compare.includes(task.id) && <Icon name="Check" size={10} className="text-primary ml-auto flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto scrollbar-thin">
          <div style={{ width: totalWidth, minWidth: '100%' }}>
            <div className="h-10 border-b border-border sticky top-0 bg-card z-10" style={{ width: Math.max(totalWidth, 600) }}>
              {months.map((m, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full flex items-center border-r border-border/40"
                  style={{ left: m.left, width: m.width }}
                >
                  <span className="text-[10px] text-muted-foreground px-2 font-medium uppercase tracking-wide">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="relative" style={{ width: Math.max(totalWidth, 600) }}>
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className={`relative border-b border-border/50 transition-colors ${compare.includes(task.id) ? 'bg-primary/5' : idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'}`}
                  style={{ height: ROW_H }}
                >
                  {months.map((m, i) => (
                    <div key={i} className="absolute top-0 h-full border-r border-border/20" style={{ left: m.left + m.width - 1 }} />
                  ))}

                  {todayOffset > 0 && (
                    <div className="absolute top-0 h-full w-px bg-blue-500/30 z-0" style={{ left: todayOffset }} />
                  )}

                  <div
                    className="absolute top-2 rounded cursor-pointer transition-all hover:brightness-110 group/bar"
                    style={{
                      left: getOffset(task.startDate),
                      width: getWidth(task.startDate, task.endDate),
                      height: 20,
                      backgroundColor: getColor(task.group),
                      opacity: task.status === 'cancelled' ? 0.35 : 1,
                    }}
                    onMouseEnter={(e) => setTooltip({ task, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                    onMouseMove={(e) => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                  >
                    <div
                      className="h-full rounded-l"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                      }}
                    />
                    {getWidth(task.startDate, task.endDate) > 60 && (
                      <span className="absolute inset-0 flex items-center px-2 text-white text-[10px] font-medium truncate">
                        {task.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {todayOffset > 0 && (
                <div
                  className="absolute top-0 h-full w-px bg-blue-500/50 z-10 pointer-events-none"
                  style={{ left: todayOffset }}
                >
                  <div className="absolute -top-0 left-1 text-[9px] text-blue-600 font-medium whitespace-nowrap bg-card px-1 rounded">
                    Сегодня
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg p-3 pointer-events-none animate-fade-in"
          style={{ left: tooltip.x + 12, top: tooltip.y - 80, minWidth: 200 }}
        >
          <p className="text-sm font-medium text-foreground mb-1">{tooltip.task.name}</p>
          <div className="space-y-1">
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Группа:</span><span className="text-foreground">{tooltip.task.group}</span>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Статус:</span><span className="text-foreground">{STATUS_LABELS[tooltip.task.status]}</span>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Прогресс:</span><span className="text-foreground">{tooltip.task.progress}%</span>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{new Date(tooltip.task.startDate).toLocaleDateString('ru-RU')} → {new Date(tooltip.task.endDate).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

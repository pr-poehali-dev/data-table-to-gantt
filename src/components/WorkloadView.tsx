import Icon from '@/components/ui/icon';
import type { Task } from '@/data/mockData';
import { PROJECTS, ASSIGNEES, STATUS_LABELS, STATUS_COLORS, hoursToDays } from '@/data/mockData';

interface WorkloadViewProps {
  allTasks: Task[];
}

export default function WorkloadView({ allTasks }: WorkloadViewProps) {
  // Для каждого исполнителя — задачи по проектам
  const matrix = ASSIGNEES.map(assignee => {
    const byProject = PROJECTS.map(project => {
      const tasks = allTasks.filter(t => t.assignee === assignee && t.projectId === project.id);
      const hours = tasks.reduce((s, t) => s + t.hoursTotal, 0);
      // Пересечения по датам
      const activeTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled');
      return { project, tasks, hours, activeTasks };
    });
    const totalHours = byProject.reduce((s, p) => s + p.hours, 0);
    const projectCount = byProject.filter(p => p.tasks.length > 0).length;
    // Найти пересечения дат между проектами
    const overlaps: { p1: string; p2: string; tasks1: Task[]; tasks2: Task[] }[] = [];
    for (let i = 0; i < byProject.length; i++) {
      for (let j = i + 1; j < byProject.length; j++) {
        const at1 = byProject[i].activeTasks;
        const at2 = byProject[j].activeTasks;
        if (at1.length === 0 || at2.length === 0) continue;
        const hasOverlap = at1.some(t1 => at2.some(t2 =>
          t1.startDate <= t2.endDate && t1.endDate >= t2.startDate
        ));
        if (hasOverlap) overlaps.push({ p1: byProject[i].project.name, p2: byProject[j].project.name, tasks1: at1, tasks2: at2 });
      }
    }
    return { assignee, byProject, totalHours, projectCount, overlaps };
  }).filter(a => a.totalHours > 0);

  return (
    <div className="flex-1 overflow-auto scrollbar-thin p-6">
      <div className="mb-6">
        <h2 className="text-base font-medium text-foreground">Загрузка исполнителей</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Пересечения задач по проектам — потенциальные конфликты ресурсов</p>
      </div>

      <div className="space-y-4">
        {matrix.map(({ assignee, byProject, totalHours, projectCount, overlaps }) => (
          <div key={assignee} className={`bg-card border rounded-lg overflow-hidden ${overlaps.length > 0 ? 'border-amber-300' : 'border-border'}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {assignee.split(' ')[0][0]}{assignee.split(' ')[1]?.[0] || ''}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{assignee}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {projectCount} {projectCount === 1 ? 'проект' : projectCount < 5 ? 'проекта' : 'проектов'} · {totalHours} ч/ч · {hoursToDays(totalHours)} дней
                  </p>
                </div>
              </div>
              {overlaps.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  <Icon name="AlertTriangle" size={12} />
                  {overlaps.length} пересечени{overlaps.length === 1 ? 'е' : 'я'} дат
                </div>
              )}
            </div>

            <div className="p-4">
              {/* Полосы по проектам */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {byProject.map(({ project, tasks, hours }) => (
                  tasks.length > 0 && (
                    <div key={project.id} className="rounded p-2.5" style={{ backgroundColor: project.color + '15', border: `1px solid ${project.color}40` }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
                        <span className="text-[10px] font-medium" style={{ color: project.color }}>{project.code}</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground">{hours} ч/ч</p>
                      <p className="text-[10px] text-muted-foreground">{tasks.length} задач</p>
                    </div>
                  )
                ))}
              </div>

              {/* Предупреждения о пересечениях */}
              {overlaps.map((ov, idx) => (
                <div key={idx} className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded p-2.5">
                  <Icon name="ArrowLeftRight" size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-amber-800">
                      Параллельная работа: {ov.p1} и {ov.p2}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[...ov.tasks1, ...ov.tasks2].map(t => (
                        <span key={t.id} className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded mono">{t.cipher}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Список активных задач */}
              <div className="mt-3 space-y-1">
                {byProject.flatMap(({ project, tasks }) =>
                  tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled').map(t => (
                    <div key={t.id} className="flex items-center gap-3 text-xs py-1 border-b border-border/50 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                      <span className="mono text-muted-foreground w-20 flex-shrink-0">{t.cipher}</span>
                      <span className="text-foreground truncate flex-1">{t.docName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[t.status]}`}>{STATUS_LABELS[t.status]}</span>
                      <span className="mono text-muted-foreground flex-shrink-0">{t.hoursTotal} ч</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

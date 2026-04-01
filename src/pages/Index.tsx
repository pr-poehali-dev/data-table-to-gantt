import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import type { Tab } from '@/components/Sidebar';
import FilterBar from '@/components/FilterBar';
import type { Filters } from '@/components/FilterBar';
import TaskTable from '@/components/TaskTable';
import GanttChart from '@/components/GanttChart';
import HistoryView from '@/components/HistoryView';
import SettingsView from '@/components/SettingsView';
import StatsBar from '@/components/StatsBar';
import AddTaskModal from '@/components/AddTaskModal';
import WorkloadView from '@/components/WorkloadView';
import Icon from '@/components/ui/icon';
import { initialTasks, PROJECTS } from '@/data/mockData';
import type { Task } from '@/data/mockData';

const DEFAULT_SETTINGS = {
  projectName: 'Проектный институт',
  currency: 'RUB',
  weekStart: 'monday',
  notifications: true,
  notifyDelay: true,
  notifyBudget: false,
  budgetThreshold: 80,
  defaultView: 'table',
  groupBy: '',
};

const TAB_TITLES: Record<Tab, string> = {
  table:    'Таблица документации',
  gantt:    'Диаграмма Ганта',
  workload: 'Загрузка исполнителей',
  history:  'История изменений',
  settings: 'Настройки',
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('table');
  const [activeProjectId, setActiveProjectId] = useState<string | 'all'>('all');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<Filters>({
    search: '', assignee: '', status: '', workCategory: '', markType: '', dateFrom: '', dateTo: '',
  });
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const checkNotifications = (updated: Task[]) => {
    if (!settings.notifications) return;
    const notes: string[] = [];
    if (settings.notifyDelay) {
      const delayed = updated.filter(t => t.status === 'delayed');
      if (delayed.length > 0) notes.push(`${delayed.length} позиций с задержкой`);
    }
    const blocked = updated.filter(t => t.status === 'blocked');
    if (blocked.length > 0) notes.push(`${blocked.length} позиций заблокированы`);
    setNotifications(notes);
  };

  // Автоматически обновлять статус blocked при изменении зависимостей
  const autoBlockedTasks = (tList: Task[]) => tList.map(t => {
    if (t.status === 'done' || t.status === 'cancelled' || t.status === 'in_progress') return t;
    const isBlocked = t.dependsOn.some(depId => {
      const dep = tList.find(d => d.id === depId);
      return dep && dep.status !== 'done';
    });
    if (isBlocked && t.status !== 'blocked') return { ...t, status: 'blocked' as const };
    if (!isBlocked && t.status === 'blocked') return { ...t, status: 'planned' as const };
    return t;
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (activeProjectId !== 'all' && t.projectId !== activeProjectId) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.docName.toLowerCase().includes(q) && !t.cipher.toLowerCase().includes(q) &&
            !t.workName.toLowerCase().includes(q) && !t.assignee.toLowerCase().includes(q) &&
            !t.mark.toLowerCase().includes(q)) return false;
      }
      if (filters.assignee && t.assignee !== filters.assignee) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.workCategory && t.workCategory !== filters.workCategory) return false;
      if (filters.markType && t.markType !== filters.markType) return false;
      if (filters.dateFrom && t.endDate < filters.dateFrom) return false;
      if (filters.dateTo && t.startDate > filters.dateTo) return false;
      return true;
    });
  }, [tasks, filters, activeProjectId]);

  const handleUpdate = (updated: Task) => {
    const next = autoBlockedTasks(tasks.map(t => t.id === updated.id ? updated : t));
    setTasks(next);
    checkNotifications(next);
  };

  const handleDelete = (id: string) => {
    const next = autoBlockedTasks(tasks.filter(t => t.id !== id));
    setTasks(next);
  };

  const handleAdd = (newTasks: Task[]) => {
    const next = autoBlockedTasks([...tasks, ...newTasks]);
    setTasks(next);
    checkNotifications(next);
  };

  const handleExport = () => {
    const headers = ['№', 'Проект', 'Комплект документации', 'Шифр', 'Марка', 'Тип', 'Исполнитель', 'Вид работы', 'Категория', 'Задание от', 'Направление задания', 'Старт', 'Финиш', 'Трудозатраты ч/ч', 'Трудозатраты дни', 'Статус'];
    const rows = filteredTasks.map(t => [
      t.num,
      PROJECTS.find(p => p.id === t.projectId)?.name || t.projectId,
      t.docName, t.cipher, t.mark, t.markType === 'PD' ? 'ПД' : 'РД',
      t.assignee, t.workName, t.workCategory,
      t.assignmentFrom || '', t.assignmentNote || '',
      t.startDate, t.endDate, t.hoursTotal, (t.hoursTotal / 8).toFixed(1), t.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `документация-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeProjectName = activeProjectId === 'all'
    ? 'Все проекты'
    : PROJECTS.find(p => p.id === activeProjectId)?.name || '';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeProjectId={activeProjectId}
        onProjectChange={setActiveProjectId}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-card">
          <div>
            <h1 className="text-sm font-semibold text-foreground">{settings.projectName}</h1>
            <p className="text-[11px] text-muted-foreground">
              {TAB_TITLES[activeTab]}
              {activeProjectId !== 'all' && <span className="ml-1 text-primary">· {activeProjectName}</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] px-2.5 py-1 rounded-full animate-fade-in">
                <Icon name="AlertTriangle" size={11} />
                {n}
                <button onClick={() => setNotifications(prev => prev.filter((_, j) => j !== i))} className="ml-1"><Icon name="X" size={10} /></button>
              </div>
            ))}

            {(activeTab === 'table' || activeTab === 'gantt') && (
              <select
                className="h-7 text-[11px] border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
                value={settings.groupBy}
                onChange={e => setSettings(s => ({ ...s, groupBy: e.target.value }))}
              >
                <option value="">Без группировки</option>
                <option value="assignee">По исполнителю</option>
                <option value="status">По статусу</option>
                <option value="workCategory">По виду работ</option>
                <option value="markType">ПД / РД</option>
              </select>
            )}

            <div className="text-[11px] mono text-muted-foreground">
              {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        {(activeTab === 'table' || activeTab === 'gantt') && (
          <>
            <StatsBar tasks={filteredTasks} activeProjectId={activeProjectId} />
            <FilterBar filters={filters} onChange={setFilters} onExport={handleExport} onAddTask={() => setShowAddModal(true)} />
          </>
        )}

        {activeTab === 'table' && (
          <TaskTable tasks={filteredTasks} allTasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} groupBy={settings.groupBy} />
        )}
        {activeTab === 'gantt' && <GanttChart tasks={filteredTasks} />}
        {activeTab === 'workload' && <WorkloadView allTasks={tasks} />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'settings' && <SettingsView settings={settings} onSave={setSettings} />}
      </div>

      {showAddModal && (
        <AddTaskModal
          tasksCount={tasks.length}
          activeProjectId={activeProjectId}
          allTasks={tasks}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

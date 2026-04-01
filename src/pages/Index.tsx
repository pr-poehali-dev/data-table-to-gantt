import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import FilterBar from '@/components/FilterBar';
import TaskTable from '@/components/TaskTable';
import GanttChart from '@/components/GanttChart';
import HistoryView from '@/components/HistoryView';
import SettingsView from '@/components/SettingsView';
import StatsBar from '@/components/StatsBar';
import AddTaskModal from '@/components/AddTaskModal';
import Icon from '@/components/ui/icon';
import { initialTasks } from '@/data/mockData';
import type { Task } from '@/data/mockData';
import type { Filters } from '@/components/FilterBar';

type Tab = 'table' | 'gantt' | 'history' | 'settings';

const DEFAULT_SETTINGS = {
  projectName: 'Мой проект',
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
  table: 'Таблица задач',
  gantt: 'Диаграмма Ганта',
  history: 'История изменений',
  settings: 'Настройки',
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('table');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<Filters>({
    search: '', group: '', assignee: '', status: '', priority: '', dateFrom: '', dateTo: '',
  });
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const checkNotifications = (updatedTasks: Task[]) => {
    if (!settings.notifications) return;
    const notes: string[] = [];
    if (settings.notifyDelay) {
      const delayed = updatedTasks.filter(t => t.status === 'delayed');
      if (delayed.length > 0) notes.push(`${delayed.length} задач имеют задержку`);
    }
    if (settings.notifyBudget) {
      const overBudget = updatedTasks.filter(t => t.budget > 0 && (t.spent / t.budget) * 100 >= settings.budgetThreshold);
      if (overBudget.length > 0) notes.push(`${overBudget.length} задач превысили порог бюджета`);
    }
    setNotifications(notes);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filters.search && !t.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !t.assignee.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.group && t.group !== filters.group) return false;
      if (filters.assignee && t.assignee !== filters.assignee) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.dateFrom && t.endDate < filters.dateFrom) return false;
      if (filters.dateTo && t.startDate > filters.dateTo) return false;
      return true;
    });
  }, [tasks, filters]);

  const handleUpdate = (updated: Task) => {
    const next = tasks.map(t => t.id === updated.id ? updated : t);
    setTasks(next);
    checkNotifications(next);
  };

  const handleDelete = (id: string) => {
    const next = tasks.filter(t => t.id !== id);
    setTasks(next);
  };

  const handleAdd = (task: Task) => {
    const next = [...tasks, task];
    setTasks(next);
    checkNotifications(next);
  };

  const handleExport = () => {
    const headers = ['Задача', 'Группа', 'Исполнитель', 'Начало', 'Конец', 'Статус', 'Приоритет', 'Прогресс', 'Бюджет', 'Потрачено'];
    const rows = filteredTasks.map(t => [
      t.name, t.group, t.assignee, t.startDate, t.endDate,
      t.status, t.priority, t.progress + '%', t.budget, t.spent,
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planflow-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-card">
          <div>
            <h1 className="text-sm font-semibold text-foreground">{settings.projectName}</h1>
            <p className="text-[11px] text-muted-foreground">{TAB_TITLES[activeTab]}</p>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] px-2.5 py-1 rounded-full animate-fade-in">
                    <Icon name="AlertTriangle" size={11} />
                    {n}
                    <button onClick={() => setNotifications(prev => prev.filter((_, j) => j !== i))} className="ml-1 hover:text-amber-900">
                      <Icon name="X" size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(activeTab === 'table' || activeTab === 'gantt') && (
              <div className="flex items-center gap-2">
                <select
                  className="h-7 text-[11px] border border-border rounded px-2 bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
                  value={settings.groupBy}
                  onChange={e => setSettings(s => ({ ...s, groupBy: e.target.value }))}
                >
                  <option value="">Без группировки</option>
                  <option value="group">По группе</option>
                  <option value="assignee">По исполнителю</option>
                  <option value="status">По статусу</option>
                  <option value="priority">По приоритету</option>
                </select>
              </div>
            )}

            <div className="text-[11px] mono text-muted-foreground">
              {new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        {(activeTab === 'table' || activeTab === 'gantt') && (
          <>
            <StatsBar tasks={filteredTasks} />
            <FilterBar
              filters={filters}
              onChange={setFilters}
              onExport={handleExport}
              onAddTask={() => setShowAddModal(true)}
            />
          </>
        )}

        {activeTab === 'table' && (
          <TaskTable
            tasks={filteredTasks}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            groupBy={settings.groupBy}
          />
        )}

        {activeTab === 'gantt' && (
          <GanttChart tasks={filteredTasks} />
        )}

        {activeTab === 'history' && <HistoryView />}

        {activeTab === 'settings' && (
          <SettingsView settings={settings} onSave={setSettings} />
        )}
      </div>

      {showAddModal && (
        <AddTaskModal onAdd={handleAdd} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

export type TaskStatus = 'planned' | 'in_progress' | 'done' | 'delayed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  name: string;
  group: string;
  assignee: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  budget: number;
  spent: number;
  notes?: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  planned: 'Запланировано',
  in_progress: 'В работе',
  done: 'Выполнено',
  delayed: 'Задержка',
  cancelled: 'Отменено',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  planned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
  delayed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

export const GANTT_COLORS = [
  'hsl(215, 85%, 55%)',
  'hsl(162, 72%, 45%)',
  'hsl(38, 92%, 55%)',
  'hsl(280, 65%, 58%)',
  'hsl(0, 72%, 58%)',
  'hsl(195, 75%, 50%)',
];

export const GROUPS = ['Разработка', 'Дизайн', 'Маркетинг', 'Аналитика', 'Инфраструктура'];
export const ASSIGNEES = ['Иванов А.', 'Петрова М.', 'Сидоров К.', 'Козлова Е.', 'Новиков Д.'];

export const initialTasks: Task[] = [
  { id: '1', name: 'Анализ требований', group: 'Аналитика', assignee: 'Козлова Е.', startDate: '2024-01-08', endDate: '2024-01-19', status: 'done', priority: 'high', progress: 100, budget: 120000, spent: 115000 },
  { id: '2', name: 'Дизайн интерфейса', group: 'Дизайн', assignee: 'Петрова М.', startDate: '2024-01-15', endDate: '2024-02-09', status: 'done', priority: 'high', progress: 100, budget: 200000, spent: 195000 },
  { id: '3', name: 'Разработка API', group: 'Разработка', assignee: 'Иванов А.', startDate: '2024-01-22', endDate: '2024-03-01', status: 'done', priority: 'critical', progress: 100, budget: 380000, spent: 362000 },
  { id: '4', name: 'Frontend разработка', group: 'Разработка', assignee: 'Сидоров К.', startDate: '2024-02-05', endDate: '2024-03-22', status: 'in_progress', priority: 'critical', progress: 75, budget: 420000, spent: 318000 },
  { id: '5', name: 'Рекламная кампания', group: 'Маркетинг', assignee: 'Новиков Д.', startDate: '2024-02-19', endDate: '2024-04-12', status: 'in_progress', priority: 'medium', progress: 40, budget: 550000, spent: 220000 },
  { id: '6', name: 'Настройка серверов', group: 'Инфраструктура', assignee: 'Иванов А.', startDate: '2024-03-04', endDate: '2024-03-22', status: 'planned', priority: 'high', progress: 0, budget: 150000, spent: 0 },
  { id: '7', name: 'Тестирование QA', group: 'Разработка', assignee: 'Козлова Е.', startDate: '2024-03-11', endDate: '2024-04-05', status: 'planned', priority: 'high', progress: 0, budget: 180000, spent: 0 },
  { id: '8', name: 'SEO оптимизация', group: 'Маркетинг', assignee: 'Петрова М.', startDate: '2024-03-18', endDate: '2024-04-19', status: 'delayed', priority: 'medium', progress: 15, budget: 90000, spent: 14000, notes: 'Ожидаем данные от аналитики' },
  { id: '9', name: 'Документация', group: 'Аналитика', assignee: 'Новиков Д.', startDate: '2024-03-25', endDate: '2024-04-26', status: 'planned', priority: 'low', progress: 0, budget: 60000, spent: 0 },
  { id: '10', name: 'Запуск продукта', group: 'Маркетинг', assignee: 'Новиков Д.', startDate: '2024-04-15', endDate: '2024-04-30', status: 'planned', priority: 'critical', progress: 0, budget: 300000, spent: 0 },
];

export const historyItems = [
  { id: 'h1', date: '2024-03-15 14:32', user: 'Иванов А.', action: 'Изменён статус задачи "Frontend разработка"', from: 'Запланировано', to: 'В работе' },
  { id: 'h2', date: '2024-03-14 09:15', user: 'Козлова Е.', action: 'Обновлён прогресс задачи "Разработка API"', from: '85%', to: '100%' },
  { id: 'h3', date: '2024-03-13 16:48', user: 'Петрова М.', action: 'Добавлена задача "SEO оптимизация"', from: '—', to: 'Задержка' },
  { id: 'h4', date: '2024-03-12 11:20', user: 'Новиков Д.', action: 'Изменён бюджет "Рекламная кампания"', from: '450 000 ₽', to: '550 000 ₽' },
  { id: 'h5', date: '2024-03-11 10:05', user: 'Сидоров К.', action: 'Изменён прогресс "Frontend разработка"', from: '60%', to: '75%' },
  { id: 'h6', date: '2024-03-10 15:30', user: 'Козлова Е.', action: 'Добавлена задача "Тестирование QA"', from: '—', to: 'Запланировано' },
  { id: 'h7', date: '2024-03-09 09:45', user: 'Иванов А.', action: 'Обновлены требования к серверам', from: 'Отменено', to: 'Запланировано' },
];

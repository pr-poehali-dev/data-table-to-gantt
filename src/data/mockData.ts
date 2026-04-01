export type TaskStatus = 'planned' | 'in_progress' | 'done' | 'delayed' | 'cancelled';

export interface Task {
  id: string;
  num: number;
  docName: string;
  cipher: string;
  assignee: string;
  workName: string;
  startDate: string;
  endDate: string;
  hoursTotal: number;
  status: TaskStatus;
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

export const GANTT_COLORS = [
  'hsl(215, 85%, 55%)',
  'hsl(162, 72%, 45%)',
  'hsl(38, 92%, 55%)',
  'hsl(280, 65%, 58%)',
  'hsl(0, 72%, 58%)',
  'hsl(195, 75%, 50%)',
];

export const ASSIGNEES = ['Иванов А.', 'Петрова М.', 'Сидоров К.', 'Козлова Е.', 'Новиков Д.'];

export const hoursToDays = (hours: number) => +(hours / 8).toFixed(1);

export const initialTasks: Task[] = [
  { id: '1', num: 1, docName: 'Техническое задание', cipher: 'ТЗ-001', assignee: 'Козлова Е.', workName: 'Разработка технического задания', startDate: '2024-01-08', endDate: '2024-01-19', hoursTotal: 80, status: 'done' },
  { id: '2', num: 2, docName: 'Эскизный проект', cipher: 'ЭП-001', assignee: 'Петрова М.', workName: 'Разработка эскизного проекта интерфейса', startDate: '2024-01-15', endDate: '2024-02-09', hoursTotal: 200, status: 'done' },
  { id: '3', num: 3, docName: 'Архитектурная документация', cipher: 'АД-002', assignee: 'Иванов А.', workName: 'Проектирование архитектуры системы', startDate: '2024-01-22', endDate: '2024-03-01', hoursTotal: 320, status: 'done' },
  { id: '4', num: 4, docName: 'Рабочая документация', cipher: 'РД-003', assignee: 'Сидоров К.', workName: 'Разработка фронтенд-модулей', startDate: '2024-02-05', endDate: '2024-03-22', hoursTotal: 480, status: 'in_progress', notes: 'Выполнено 75%' },
  { id: '5', num: 5, docName: 'Маркетинговый план', cipher: 'МП-001', assignee: 'Новиков Д.', workName: 'Подготовка маркетинговой документации', startDate: '2024-02-19', endDate: '2024-04-12', hoursTotal: 160, status: 'in_progress' },
  { id: '6', num: 6, docName: 'Инфраструктурный проект', cipher: 'ИП-001', assignee: 'Иванов А.', workName: 'Настройка и документирование серверной инфраструктуры', startDate: '2024-03-04', endDate: '2024-03-22', hoursTotal: 96, status: 'planned' },
  { id: '7', num: 7, docName: 'Программа и методика испытаний', cipher: 'ПМИ-001', assignee: 'Козлова Е.', workName: 'Разработка программы и методики тестирования', startDate: '2024-03-11', endDate: '2024-04-05', hoursTotal: 120, status: 'planned' },
  { id: '8', num: 8, docName: 'SEO-документация', cipher: 'СЕО-001', assignee: 'Петрова М.', workName: 'Оптимизация поисковой документации', startDate: '2024-03-18', endDate: '2024-04-19', hoursTotal: 64, status: 'delayed', notes: 'Ожидаем данные от аналитики' },
  { id: '9', num: 9, docName: 'Руководство пользователя', cipher: 'РП-001', assignee: 'Новиков Д.', workName: 'Разработка руководства пользователя', startDate: '2024-03-25', endDate: '2024-04-26', hoursTotal: 80, status: 'planned' },
  { id: '10', num: 10, docName: 'Акт о вводе в эксплуатацию', cipher: 'АВЭ-001', assignee: 'Новиков Д.', workName: 'Подготовка документов для ввода в эксплуатацию', startDate: '2024-04-15', endDate: '2024-04-30', hoursTotal: 40, status: 'planned' },
];

export const historyItems = [
  { id: 'h1', date: '2024-03-15 14:32', user: 'Иванов А.', action: 'Изменён статус "Рабочая документация" РД-003', from: 'Запланировано', to: 'В работе' },
  { id: 'h2', date: '2024-03-14 09:15', user: 'Козлова Е.', action: 'Обновлены трудозатраты "Архитектурная документация"', from: '280 ч/ч', to: '320 ч/ч' },
  { id: 'h3', date: '2024-03-13 16:48', user: 'Петрова М.', action: 'Добавлена "SEO-документация" СЕО-001', from: '—', to: 'Задержка' },
  { id: 'h4', date: '2024-03-12 11:20', user: 'Новиков Д.', action: 'Изменён исполнитель "Маркетинговый план"', from: 'Козлова Е.', to: 'Новиков Д.' },
  { id: 'h5', date: '2024-03-11 10:05', user: 'Сидоров К.', action: 'Обновлена дата финиша "Рабочая документация"', from: '2024-03-15', to: '2024-03-22' },
  { id: 'h6', date: '2024-03-10 15:30', user: 'Козлова Е.', action: 'Добавлена "Программа и методика испытаний"', from: '—', to: 'Запланировано' },
  { id: 'h7', date: '2024-03-09 09:45', user: 'Иванов А.', action: 'Восстановлена "Инфраструктурный проект" ИП-001', from: 'Отменено', to: 'Запланировано' },
];

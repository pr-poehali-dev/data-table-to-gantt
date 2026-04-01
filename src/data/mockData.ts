// ─── Статусы ───────────────────────────────────────────────────────────────
export type TaskStatus = 'planned' | 'in_progress' | 'done' | 'delayed' | 'cancelled' | 'blocked';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  planned:     'Запланировано',
  in_progress: 'В работе',
  done:        'Выполнено',
  delayed:     'Задержка',
  cancelled:   'Отменено',
  blocked:     'Заблокировано',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  planned:     'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  done:        'bg-emerald-100 text-emerald-700',
  delayed:     'bg-red-100 text-red-700',
  cancelled:   'bg-gray-100 text-gray-500',
  blocked:     'bg-purple-100 text-purple-700',
};

// ─── Марки по Постановлению №87 ────────────────────────────────────────────
export interface DocMark {
  code: string;
  name: string;
  type: 'PD' | 'RD';
}

export const DOC_MARKS: DocMark[] = [
  // Проектная документация (ПД)
  { code: 'ПЗ',    name: 'Пояснительная записка',                                    type: 'PD' },
  { code: 'СПОЗУ', name: 'Схема планировочной организации земельного участка',        type: 'PD' },
  { code: 'АР',    name: 'Архитектурные решения',                                    type: 'PD' },
  { code: 'КР',    name: 'Конструктивные и объёмно-планировочные решения',            type: 'PD' },
  { code: 'ИОС1',  name: 'Система электроснабжения',                                 type: 'PD' },
  { code: 'ИОС2',  name: 'Система водоснабжения',                                    type: 'PD' },
  { code: 'ИОС3',  name: 'Система водоотведения',                                    type: 'PD' },
  { code: 'ИОС4',  name: 'Отопление, вентиляция, кондиционирование, тепл. сети',     type: 'PD' },
  { code: 'ИОС5',  name: 'Сети связи',                                               type: 'PD' },
  { code: 'ИОС6',  name: 'Система газоснабжения',                                    type: 'PD' },
  { code: 'ИОС7',  name: 'Технологические решения',                                  type: 'PD' },
  { code: 'ОДИ',   name: 'Обеспечение доступа инвалидов',                            type: 'PD' },
  { code: 'МП',    name: 'Мероприятия по охране окружающей среды',                   type: 'PD' },
  { code: 'МПБ',   name: 'Мероприятия по обеспечению пожарной безопасности',         type: 'PD' },
  { code: 'ОЭ',    name: 'Мероприятия по обеспечению энергоэффективности',           type: 'PD' },
  { code: 'БДД',   name: 'Мероприятия по обеспечению безопасности дорожного движения', type: 'PD' },
  { code: 'СМ',    name: 'Сметная документация',                                     type: 'PD' },
  { code: 'ПОС',   name: 'Проект организации строительства',                         type: 'PD' },
  { code: 'ПБ',    name: 'Перечень мероприятий по ГО и ЧС',                         type: 'PD' },
  // Рабочая документация (РД)
  { code: 'АС',    name: 'Архитектурно-строительные решения',                        type: 'RD' },
  { code: 'АД',    name: 'Автомобильные дороги',                                     type: 'RD' },
  { code: 'КЖ',    name: 'Конструкции железобетонные',                               type: 'RD' },
  { code: 'КМ',    name: 'Конструкции металлические',                                type: 'RD' },
  { code: 'КД',    name: 'Конструкции деревянные',                                   type: 'RD' },
  { code: 'ЭО',    name: 'Электрооборудование',                                      type: 'RD' },
  { code: 'ЭМ',    name: 'Электрические машины',                                     type: 'RD' },
  { code: 'ЭС',    name: 'Электроснабжение',                                         type: 'RD' },
  { code: 'ЭН',    name: 'Наружное электроосвещение',                                type: 'RD' },
  { code: 'ВК',    name: 'Водоснабжение и канализация',                              type: 'RD' },
  { code: 'НВК',   name: 'Наружные сети водоснабжения и канализации',                type: 'RD' },
  { code: 'ОВ',    name: 'Отопление и вентиляция',                                   type: 'RD' },
  { code: 'ТМ',    name: 'Тепломеханические решения',                                type: 'RD' },
  { code: 'НТ',    name: 'Наружные тепловые сети',                                   type: 'RD' },
  { code: 'ГС',    name: 'Газоснабжение',                                            type: 'RD' },
  { code: 'СС',    name: 'Системы связи',                                            type: 'RD' },
  { code: 'СА',    name: 'Система автоматизации',                                    type: 'RD' },
  { code: 'СБ',    name: 'Система безопасности',                                     type: 'RD' },
  { code: 'ТХ',    name: 'Технологические решения',                                  type: 'RD' },
  { code: 'ГП',    name: 'Генеральный план',                                         type: 'RD' },
  { code: 'БЛ',    name: 'Благоустройство',                                          type: 'RD' },
  { code: 'ПЗУ',   name: 'Планировка земельного участка',                            type: 'RD' },
];

// ─── Типовые работы проектного института ───────────────────────────────────
export interface WorkTemplate {
  id: string;
  name: string;
  category: string;
  defaultHours: number;
}

export const WORK_TEMPLATES: WorkTemplate[] = [
  { id: 'wt01', category: 'Исходные данные',  name: 'Получение исходных данных от заказчика',       defaultHours: 8   },
  { id: 'wt02', category: 'Исходные данные',  name: 'Получение технических условий',                defaultHours: 4   },
  { id: 'wt03', category: 'Исходные данные',  name: 'Сбор и анализ исходных данных',                defaultHours: 16  },
  { id: 'wt04', category: 'Задания',          name: 'Выдача задания смежному разделу',              defaultHours: 4   },
  { id: 'wt05', category: 'Задания',          name: 'Получение задания от смежного раздела',        defaultHours: 2   },
  { id: 'wt06', category: 'Задания',          name: 'Выдача задания на изыскания',                  defaultHours: 8   },
  { id: 'wt07', category: 'Задания',          name: 'Выдача архитектурно-планировочного задания',   defaultHours: 8   },
  { id: 'wt08', category: 'Проектирование',   name: 'Разработка концепции / эскиза',                defaultHours: 40  },
  { id: 'wt09', category: 'Проектирование',   name: 'Разработка проектной документации',            defaultHours: 80  },
  { id: 'wt10', category: 'Проектирование',   name: 'Разработка рабочей документации',              defaultHours: 120 },
  { id: 'wt11', category: 'Проектирование',   name: 'Разработка расчётной части',                   defaultHours: 24  },
  { id: 'wt12', category: 'Проектирование',   name: 'Разработка спецификации оборудования',         defaultHours: 16  },
  { id: 'wt13', category: 'Проектирование',   name: 'Разработка сметной документации',              defaultHours: 40  },
  { id: 'wt14', category: 'Согласование',     name: 'Внутреннее согласование (ГИП)',                defaultHours: 4   },
  { id: 'wt15', category: 'Согласование',     name: 'Согласование с заказчиком',                    defaultHours: 8   },
  { id: 'wt16', category: 'Согласование',     name: 'Согласование со смежными разделами',           defaultHours: 8   },
  { id: 'wt17', category: 'Согласование',     name: 'Согласование с эксплуатирующей организацией',  defaultHours: 16  },
  { id: 'wt18', category: 'Экспертиза',       name: 'Прохождение государственной экспертизы',       defaultHours: 40  },
  { id: 'wt19', category: 'Экспертиза',       name: 'Устранение замечаний экспертизы',              defaultHours: 24  },
  { id: 'wt20', category: 'Экспертиза',       name: 'Подготовка ответов на запросы экспертизы',     defaultHours: 16  },
  { id: 'wt21', category: 'Передача',         name: 'Передача документации заказчику',              defaultHours: 4   },
  { id: 'wt22', category: 'Передача',         name: 'Передача документации в производство работ',   defaultHours: 4   },
  { id: 'wt23', category: 'Передача',         name: 'Комплектование и оформление тома',             defaultHours: 8   },
  { id: 'wt24', category: 'Авторский надзор', name: 'Авторский надзор за строительством',           defaultHours: 16  },
  { id: 'wt25', category: 'Авторский надзор', name: 'Рассмотрение вопросов в ходе строительства',   defaultHours: 8   },
];

export const WORK_CATEGORIES = [...new Set(WORK_TEMPLATES.map(w => w.category))];

// ─── Проекты ────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  code: string;
  color: string;
}

export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Проект 1 — ЖК Северный',    code: 'П1', color: 'hsl(215,85%,55%)' },
  { id: 'p2', name: 'Проект 2 — БЦ Олимп',        code: 'П2', color: 'hsl(162,72%,45%)' },
  { id: 'p3', name: 'Проект 3 — ТЦ Меридиан',     code: 'П3', color: 'hsl(38,92%,50%)'  },
  { id: 'p4', name: 'Проект 4 — Склад Логистик',  code: 'П4', color: 'hsl(0,72%,58%)'   },
];

export const ASSIGNEES = ['Иванов А.', 'Петрова М.', 'Сидоров К.', 'Козлова Е.', 'Новиков Д.'];

// ─── Основная структура задачи ──────────────────────────────────────────────
export interface Task {
  id: string;
  projectId: string;
  num: number;
  docName: string;
  cipher: string;
  mark: string;
  markType: 'PD' | 'RD';
  assignee: string;
  workName: string;
  workCategory: string;
  startDate: string;
  endDate: string;
  hoursTotal: number;
  status: TaskStatus;
  dependsOn: string[];
  assignmentFrom?: string;
  assignmentNote?: string;
  notes?: string;
}

export const hoursToDays = (hours: number) => +(hours / 8).toFixed(1);

export const GANTT_COLORS = [
  'hsl(215,85%,55%)',
  'hsl(162,72%,45%)',
  'hsl(38,92%,50%)',
  'hsl(0,72%,58%)',
  'hsl(280,65%,58%)',
  'hsl(195,75%,50%)',
];

// ─── Тестовые данные ────────────────────────────────────────────────────────
export const initialTasks: Task[] = [
  { id: 't1',  projectId: 'p1', num: 1, docName: 'Пояснительная записка',            cipher: 'П1-ПЗ', mark: 'ПЗ',  markType: 'PD', assignee: 'Козлова Е.',  workName: 'Получение исходных данных от заказчика',  workCategory: 'Исходные данные', startDate: '2024-01-08', endDate: '2024-01-12', hoursTotal: 8,   status: 'done',        dependsOn: [] },
  { id: 't2',  projectId: 'p1', num: 2, docName: 'Архитектурные решения',             cipher: 'П1-АР', mark: 'АР',  markType: 'PD', assignee: 'Петрова М.',  workName: 'Разработка проектной документации',       workCategory: 'Проектирование',  startDate: '2024-01-15', endDate: '2024-02-09', hoursTotal: 200, status: 'done',        dependsOn: ['t1'], assignmentFrom: 'Козлова Е.', assignmentNote: 'ИД для марки АР — планировки, фасады' },
  { id: 't3',  projectId: 'p1', num: 3, docName: 'Конструктивные решения',            cipher: 'П1-КР', mark: 'КР',  markType: 'PD', assignee: 'Иванов А.',   workName: 'Разработка расчётной части',              workCategory: 'Проектирование',  startDate: '2024-01-22', endDate: '2024-03-01', hoursTotal: 160, status: 'done',        dependsOn: ['t2'], assignmentFrom: 'Петрова М.', assignmentNote: 'Задание от АР — нагрузки, планировки' },
  { id: 't4',  projectId: 'p1', num: 4, docName: 'Конструкции железобетонные',        cipher: 'П1-КЖ', mark: 'КЖ',  markType: 'RD', assignee: 'Сидоров К.',  workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-02-05', endDate: '2024-03-22', hoursTotal: 240, status: 'in_progress', dependsOn: ['t3'], assignmentFrom: 'Иванов А.',  assignmentNote: 'Задание от КР — армирование' },
  { id: 't5',  projectId: 'p1', num: 5, docName: 'Водоснабжение и канализация',       cipher: 'П1-ВК', mark: 'ВК',  markType: 'RD', assignee: 'Новиков Д.',  workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-02-19', endDate: '2024-04-12', hoursTotal: 120, status: 'in_progress', dependsOn: ['t2'] },
  { id: 't6',  projectId: 'p1', num: 6, docName: 'Отопление и вентиляция',            cipher: 'П1-ОВ', mark: 'ОВ',  markType: 'RD', assignee: 'Новиков Д.',  workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-03-04', endDate: '2024-03-29', hoursTotal: 96,  status: 'planned',     dependsOn: ['t2'] },
  { id: 't7',  projectId: 'p1', num: 7, docName: 'Электроснабжение',                  cipher: 'П1-ЭС', mark: 'ЭС',  markType: 'RD', assignee: 'Иванов А.',   workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-03-11', endDate: '2024-04-05', hoursTotal: 80,  status: 'planned',     dependsOn: ['t2'] },
  { id: 't8',  projectId: 'p1', num: 8, docName: 'Сметная документация',              cipher: 'П1-СМ', mark: 'СМ',  markType: 'PD', assignee: 'Козлова Е.',  workName: 'Разработка сметной документации',         workCategory: 'Проектирование',  startDate: '2024-03-18', endDate: '2024-04-19', hoursTotal: 64,  status: 'blocked',     dependsOn: ['t4','t5','t6','t7'], notes: 'Ожидает все разделы' },
  { id: 't9',  projectId: 'p2', num: 1, docName: 'Пояснительная записка',            cipher: 'П2-ПЗ', mark: 'ПЗ',  markType: 'PD', assignee: 'Козлова Е.',  workName: 'Сбор и анализ исходных данных',           workCategory: 'Исходные данные', startDate: '2024-01-22', endDate: '2024-01-31', hoursTotal: 16,  status: 'done',        dependsOn: [] },
  { id: 't10', projectId: 'p2', num: 2, docName: 'Архитектурные решения',             cipher: 'П2-АР', mark: 'АР',  markType: 'PD', assignee: 'Петрова М.',  workName: 'Разработка концепции / эскиза',           workCategory: 'Проектирование',  startDate: '2024-02-01', endDate: '2024-02-28', hoursTotal: 160, status: 'in_progress', dependsOn: ['t9'] },
  { id: 't11', projectId: 'p2', num: 3, docName: 'Конструктивные решения',            cipher: 'П2-КР', mark: 'КР',  markType: 'PD', assignee: 'Иванов А.',   workName: 'Разработка проектной документации',       workCategory: 'Проектирование',  startDate: '2024-02-15', endDate: '2024-03-20', hoursTotal: 120, status: 'planned',     dependsOn: ['t10'], assignmentFrom: 'Петрова М.', assignmentNote: 'ИД от АР для КР' },
  { id: 't12', projectId: 'p2', num: 4, docName: 'Электрооборудование',               cipher: 'П2-ЭО', mark: 'ЭО',  markType: 'RD', assignee: 'Новиков Д.',  workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-03-01', endDate: '2024-04-15', hoursTotal: 100, status: 'planned',     dependsOn: ['t10'] },
  { id: 't13', projectId: 'p3', num: 1, docName: 'Архитектурные решения',             cipher: 'П3-АР', mark: 'АР',  markType: 'PD', assignee: 'Петрова М.',  workName: 'Разработка проектной документации',       workCategory: 'Проектирование',  startDate: '2024-02-12', endDate: '2024-03-15', hoursTotal: 180, status: 'in_progress', dependsOn: [] },
  { id: 't14', projectId: 'p3', num: 2, docName: 'Конструкции металлические',         cipher: 'П3-КМ', mark: 'КМ',  markType: 'RD', assignee: 'Сидоров К.',  workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-03-01', endDate: '2024-04-10', hoursTotal: 200, status: 'planned',     dependsOn: ['t13'] },
  { id: 't15', projectId: 'p3', num: 3, docName: 'Генеральный план',                  cipher: 'П3-ГП', mark: 'ГП',  markType: 'RD', assignee: 'Козлова Е.',  workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-02-19', endDate: '2024-03-22', hoursTotal: 80,  status: 'in_progress', dependsOn: [] },
  { id: 't16', projectId: 'p4', num: 1, docName: 'Технологические решения',           cipher: 'П4-ТХ', mark: 'ТХ',  markType: 'RD', assignee: 'Иванов А.',   workName: 'Получение технических условий',           workCategory: 'Исходные данные', startDate: '2024-03-01', endDate: '2024-03-08', hoursTotal: 8,   status: 'in_progress', dependsOn: [] },
  { id: 't17', projectId: 'p4', num: 2, docName: 'Архитектурно-строительные решения', cipher: 'П4-АС', mark: 'АС',  markType: 'RD', assignee: 'Сидоров К.',  workName: 'Разработка рабочей документации',         workCategory: 'Проектирование',  startDate: '2024-03-11', endDate: '2024-04-20', hoursTotal: 160, status: 'planned',     dependsOn: ['t16'] },
];

export const historyItems = [
  { id: 'h1', date: '2024-03-15 14:32', user: 'Иванов А.',  action: 'Изменён статус "П1-КЖ"',                         from: 'Запланировано', to: 'В работе'      },
  { id: 'h2', date: '2024-03-14 09:15', user: 'Козлова Е.', action: 'Выдано задание Петровой М. для АР (Проект 1)',    from: '—',             to: 'ИД — фасады'   },
  { id: 'h3', date: '2024-03-13 16:48', user: 'Петрова М.', action: 'Добавлена задача П2-АР в Проект 2',              from: '—',             to: 'В работе'      },
  { id: 'h4', date: '2024-03-12 11:20', user: 'Новиков Д.', action: 'Изменён срок финиша "П1-ОВ"',                    from: '2024-03-20',    to: '2024-03-29'    },
  { id: 'h5', date: '2024-03-11 10:05', user: 'Сидоров К.', action: 'Добавлена зависимость П3-КМ от П3-АР',           from: '—',             to: 'Блокировка'    },
  { id: 'h6', date: '2024-03-10 15:30', user: 'Козлова Е.', action: 'Статус П1-СМ изменён автоматически',             from: 'Запланировано', to: 'Заблокировано' },
  { id: 'h7', date: '2024-03-09 09:45', user: 'Иванов А.',  action: 'Создан Проект 4 — Склад Логистик',               from: '—',             to: 'Активен'       },
];

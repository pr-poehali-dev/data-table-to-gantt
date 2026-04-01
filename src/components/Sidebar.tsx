import Icon from '@/components/ui/icon';
import ProjectSwitcher from '@/components/ProjectSwitcher';

export type Tab = 'table' | 'gantt' | 'workload' | 'history' | 'settings';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  activeProjectId: string | 'all';
  onProjectChange: (id: string | 'all') => void;
}

const navItems: { id: Tab; label: string; icon: string }[] = [
  { id: 'table',    label: 'Таблица',   icon: 'Table2'           },
  { id: 'gantt',    label: 'График',    icon: 'GanttChartSquare' },
  { id: 'workload', label: 'Загрузка',  icon: 'Users'            },
  { id: 'history',  label: 'История',   icon: 'History'          },
  { id: 'settings', label: 'Настройки', icon: 'Settings2'        },
];

export default function Sidebar({ activeTab, onTabChange, activeProjectId, onProjectChange }: SidebarProps) {
  return (
    <aside className="flex flex-col w-[220px] min-h-screen bg-[hsl(220,15%,10%)] border-r border-[hsl(220,15%,16%)]">
      <div className="px-5 py-5 border-b border-[hsl(220,15%,16%)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[hsl(215,90%,42%)] flex items-center justify-center">
            <Icon name="BarChart3" size={14} className="text-white" />
          </div>
          <span className="text-white font-medium text-sm tracking-tight">PlanFlow</span>
        </div>
        <p className="text-[hsl(220,10%,45%)] text-xs mt-1.5">Проектный институт</p>
      </div>

      <ProjectSwitcher activeProjectId={activeProjectId} onChange={onProjectChange} />

      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-[hsl(220,10%,35%)] px-2 mb-1">Разделы</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150 w-full text-left ${
              activeTab === item.id
                ? 'bg-[hsl(215,90%,42%)] text-white'
                : 'text-[hsl(220,10%,60%)] hover:text-[hsl(220,10%,90%)] hover:bg-[hsl(220,15%,16%)]'
            }`}
          >
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[hsl(220,15%,16%)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[hsl(215,90%,35%)] flex items-center justify-center text-xs text-white font-medium">
            ГИП
          </div>
          <div>
            <p className="text-[hsl(220,10%,80%)] text-xs font-medium">ГИП / Руководитель</p>
            <p className="text-[hsl(220,10%,40%)] text-[10px]">Полный доступ</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

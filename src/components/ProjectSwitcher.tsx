import { PROJECTS } from '@/data/mockData';
import type { Project } from '@/data/mockData';

interface ProjectSwitcherProps {
  activeProjectId: string | 'all';
  onChange: (id: string | 'all') => void;
}

export default function ProjectSwitcher({ activeProjectId, onChange }: ProjectSwitcherProps) {
  return (
    <div className="px-3 py-3 border-b border-[hsl(220,15%,16%)]">
      <p className="text-[10px] uppercase tracking-widest text-[hsl(220,10%,35%)] px-2 mb-2">Проекты</p>
      <button
        onClick={() => onChange('all')}
        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-xs transition-all mb-0.5 ${
          activeProjectId === 'all'
            ? 'bg-[hsl(220,15%,16%)] text-white'
            : 'text-[hsl(220,10%,55%)] hover:text-[hsl(220,10%,85%)] hover:bg-[hsl(220,15%,14%)]'
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-[hsl(220,10%,40%)]" />
        <span>Все проекты</span>
      </button>
      {PROJECTS.map((p: Project) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-xs transition-all mb-0.5 ${
            activeProjectId === p.id
              ? 'bg-[hsl(220,15%,16%)] text-white'
              : 'text-[hsl(220,10%,55%)] hover:text-[hsl(220,10%,85%)] hover:bg-[hsl(220,15%,14%)]'
          }`}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          <span className="truncate">{p.name}</span>
        </button>
      ))}
    </div>
  );
}

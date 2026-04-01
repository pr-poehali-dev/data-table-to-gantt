import Icon from '@/components/ui/icon';
import { historyItems } from '@/data/mockData';

export default function HistoryView() {
  return (
    <div className="flex-1 overflow-auto scrollbar-thin p-6">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-base font-medium text-foreground">История изменений</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Все действия с задачами проекта</p>
        </div>

        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-0">
            {historyItems.map((item, idx) => (
              <div key={item.id} className="flex gap-4 pb-6 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="w-9 h-9 rounded-full border-2 border-border bg-card flex-shrink-0 flex items-center justify-center z-10">
                  <Icon name="Activity" size={13} className="text-primary" />
                </div>
                <div className="flex-1 bg-card border border-border rounded-lg p-3.5 mt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-medium">
                        {item.user.split(' ')[0][0]}
                      </div>
                      <span className="text-xs font-medium text-foreground">{item.user}</span>
                    </div>
                    <span className="text-[10px] mono text-muted-foreground whitespace-nowrap">{item.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                  {item.from !== '—' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono">{item.from}</span>
                      <Icon name="ArrowRight" size={10} className="text-muted-foreground" />
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">{item.to}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

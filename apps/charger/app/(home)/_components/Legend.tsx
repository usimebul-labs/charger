const items = [
  { tone: "bg-free", label: "대기" },
  { tone: "bg-busy", label: "충전중" },
  { tone: "bg-done", label: "완료·케이블" },
];

export const Legend = () => (
  <div className="flex flex-none flex-wrap items-center gap-2.5 px-1 pb-1 pt-2.5">
    {items.map(({ tone, label }) => (
      <div key={label} className="flex items-center gap-1">
        <span className={`h-1.5 w-1.5 rounded-[2px] ${tone}`} />
        <span className="text-[11px] text-subtle-foreground">{label}</span>
      </div>
    ))}
  </div>
);

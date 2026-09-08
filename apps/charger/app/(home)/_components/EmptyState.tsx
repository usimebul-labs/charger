export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-[15px] border border-border bg-surface px-10 py-14 text-center">
    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[14px] border border-border bg-elevated">
      <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>

    <p className="text-[15px] font-bold tracking-[-0.3px] text-foreground">
      표시할 충전기가 없습니다
    </p>
    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
      상단의 새로고침을 눌러
      <br />
      충전 현황을 다시 불러와 주세요.
    </p>
  </div>
);

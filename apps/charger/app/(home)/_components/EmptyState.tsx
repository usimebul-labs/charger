
interface EmptyStateProps {
  onReset: () => void;
}

export const EmptyState = ({ onReset }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative bg-slate-800 rounded-full w-24 h-24 flex items-center justify-center border border-slate-800">
          <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-black text-white tracking-tight">충전 가능한 스테이션이 없습니다.</h3>
      <p className="text-slate-500 text-sm mt-2 font-medium">충전 대기를 등록하시겠습니까?</p>
      <button
        onClick={onReset}
        className="mt-8 px-6 py-2.5 rounded-full border border-slate-700 text-slate-300 tracking-widest uppercase hover:bg-slate-800 transition-colors"
      >
        전체 보기
      </button>
    </div>
  );
};

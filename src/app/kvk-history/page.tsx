import KvkHistorySection from '@/components/kvk/KvkHistorySection';

export default function KvkHistoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-5 pb-8" dir="ltr">
      <h1 className="section-title mb-1">KvK History</h1>
      <p className="text-xs text-parchment-400 mb-4">
        Real Kingdom vs Kingdom match records. Search any kingdom to see its win/loss record.
      </p>
      <KvkHistorySection defaultKingdom={1781} />
    </div>
  );
}

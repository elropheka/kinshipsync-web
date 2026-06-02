import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const AuthCheckingSkeleton = () => (
  <div className="flex h-screen items-center justify-center bg-background p-6">
    <div className="w-full max-w-sm space-y-4">
      <Skeleton className="mx-auto h-10 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </div>
  </div>
);

export const PageLoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={className ?? 'flex justify-center items-center h-full min-h-[200px] p-6'}>
    <div className="w-full max-w-4xl space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  </div>
);

export const StatCardsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${count >= 4 ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i} className="rounded-xl border border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const EventsDashboardSkeleton = () => (
  <div className="container mx-auto py-4 sm:py-6 md:py-10 space-y-8 bg-background">
    <div className="rounded-xl border border-border overflow-hidden p-6 sm:p-8 space-y-4">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-10 w-36 rounded-full" />
    </div>
    <StatCardsSkeleton />
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 rounded-xl border border-border p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </Card>
      <Card className="rounded-xl border border-border p-6 space-y-3">
        <Skeleton className="h-6 w-32" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </Card>
    </div>
  </div>
);

export const EventCardsListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <Card key={i} className="rounded-xl border border-border p-4 space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-40" />
      </Card>
    ))}
  </div>
);

export const TableRowsSkeleton = ({ columns = 5, rows = 6 }: { columns?: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, row) => (
      <tr key={row} className="border-b border-border">
        {Array.from({ length: columns }).map((_, col) => (
          <td key={col} className="p-4">
            <Skeleton className="h-4 w-full max-w-[120px]" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const NotificationListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="divide-y divide-border">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-3">
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const DetailPageSkeleton = () => (
  <div className="p-6 space-y-6 max-w-4xl mx-auto">
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-4 w-1/3" />
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-40 w-full rounded-xl" />
  </div>
);

export const ProfileFormSkeleton = () => (
  <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-2xl">
    <div className="flex items-center gap-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ))}
    <Skeleton className="h-10 w-32 rounded-full" />
  </div>
);

export const AdminDashboardSkeleton = () => (
  <div className="container mx-auto py-4 sm:py-6 md:py-10 space-y-8">
    <StatCardsSkeleton count={3} />
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6 space-y-4 rounded-xl border border-border">
        <Skeleton className="h-6 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </Card>
      <Card className="p-6 space-y-4 rounded-xl border border-border">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </Card>
    </div>
  </div>
);

export const InlineTextSkeleton = ({ width = 'w-24' }: { width?: string }) => (
  <Skeleton className={`h-3 ${width} inline-block`} />
);

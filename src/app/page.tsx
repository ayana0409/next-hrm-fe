import WebcamAttendance from "@/components/layout/homepage";
interface IProp {
  searchParams: { id: string; fullName: string };
}
export default async function Home({ searchParams }: IProp) {
  const query = await searchParams;
  const filters: Record<string, any> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      filters[key] = value[0];
    } else {
      filters[key] = value;
    }
  });

  filters.current = Number(filters.current ?? 1);
  filters.pageSize = Number(filters.pageSize ?? 10);
  return (
    <div>
      <WebcamAttendance filters={filters} />
    </div>
  );
}

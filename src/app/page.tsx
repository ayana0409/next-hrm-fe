import HomeContent from "@/components/layout/home/home.content";
import HomeFooter from "@/components/layout/home/home.footer";
import HomeHeader from "@/components/layout/home/home.header";
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
      <div className="flex-1 overflow-hidden">
        <HomeHeader />
        <HomeContent>
          <WebcamAttendance filters={filters} />
        </HomeContent>
        <HomeFooter />
      </div>
    </div>
  );
}

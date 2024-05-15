import NavAside from "@/components/nav/navAside";
import NavMain from "@/components/nav/navMain";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-between">
      {/* 点击  */}
      <NavAside />
      <NavMain />
    </main>
  );
}

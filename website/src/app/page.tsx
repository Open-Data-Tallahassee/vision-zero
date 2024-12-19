// import CrashMap from "@/components/CrashMap";
import CrashMap from "@/components/CrashMap";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col w-screen min-h-screen ">
      <Header />
      <Navbar />
      <CrashMap />
    </div>
  );
}

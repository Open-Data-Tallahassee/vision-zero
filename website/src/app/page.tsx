// import CrashMap from "@/components/CrashMap";
import CrashMap from "@/components/CrashMap";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { getCachedCrashData } from "@/utils/fetchMapData";

export default async function Home() {
  console.log("Retrieving cached data..."); // Before calling getCachedCrashData
  const crashData = await getCachedCrashData();
  console.log("Data retrieved:", crashData.features?.length);

  return (
    <div className="flex flex-col w-screen min-h-screen ">
      <Header />
      <Navbar />
      <CrashMap crashData={crashData} />
    </div>
  );
}

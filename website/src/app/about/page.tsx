// import CrashMap from "@/components/CrashMap";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default async function About() {
  return (
    <div className="flex flex-col w-screen min-h-screen ">
      <Header />
      <Navbar />
      <div>
        <div className="">About this site</div>
        <span>
          Open Tallahassee is an open journalism project, powered by residents
          who just want to keep their neighbors informed & connected - without
          diving into the rabbit hole of political conspiracies or drama.
        </span>
        <span>
          Open Tallahassee started at a Tallahassee coffee shop, where its
          founding members talked about making a public map of traffic crashes,
          this map.
        </span>
      </div>
    </div>
  );
}

// import CrashMap from "@/components/CrashMap";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default async function About() {
  return (
    <div className="flex flex-col w-screen min-h-screen ">
      <Header />
      <Navbar />
      <div className="flex flex-col items-center justify-center px-10 ">
        <div className="text-4xl font-bold py-10">About this site</div>
        <div className="flex flex-col text-lg px-10 gap-6">
          <span>
            <a
              href="https://www.opentlh.com/"
              className="text-blue-500 hover:underline"
            >
              Open Tallahassee
            </a>
            &nbsp; is an open journalism project, powered by residents who just
            want to keep their neighbors informed & connected - without diving
            into the rabbit hole of political conspiracies or drama.
          </span>
          <span>
            Open Tallahassee started at a Tallahassee coffee shop, where its
            founding members talked about making a public map of traffic
            crashes, this map.
          </span>
          <span>
            Join us in making Tallahassee a safer place—one click at a time.
            Explore our crash map, share your insights, and help us continue our
            mission of keeping our community informed.
          </span>
        </div>
      </div>
    </div>
  );
}

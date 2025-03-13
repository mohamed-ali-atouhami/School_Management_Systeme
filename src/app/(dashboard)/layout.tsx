import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser()
  const role = user?.publicMetadata.role as string;
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div className="h-screen flex-shrink-0 w-[15%] md:w-[8%] lg:w-[16%] xl:w-[15%] p-4 overflow-y-auto">
        <Link href={`/${role}`} className="flex items-center justify-center lg:justify-start gap-2">
          <Image src="/LogoSchool.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block">SchoolMed</span>
        </Link>
        <Menu />
      </div>
      {/*Right Side*/}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#F7F8FA]">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

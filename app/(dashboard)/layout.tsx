import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import SignedInHeader from "@/app/components/global/SignedInHeader";
import Sidebar from "@/app/components/global/Sidebar";
import { PatientProvider } from "@/app/contexts/PatientContext";
import { SessionProvider } from "@/app/contexts/SessionContext";
import { GlobalContextProvider } from "../contexts/GlobalContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignedOut>
        <div className="flex justify-center items-center min-h-screen w-full">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
        <GlobalContextProvider>
          <PatientProvider>
            <SessionProvider>
              <div className="flex h-screen">
                <Sidebar />

                <div className="flex-grow h-screen overflow-auto bg-[#f4f7fe] p-[20px] xl:p-[33px] ">
                  <SignedInHeader />
                  {children}
                </div>
              </div>
            </SessionProvider>
          </PatientProvider>
        </GlobalContextProvider>
      </SignedIn>
    </>
  );
}

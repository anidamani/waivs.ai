import DataBox from "@/app/components/dashboardComponents/DataBox";
import PatientTable from "@/app/components/dashboardComponents/PatientTable";
import { getPatientStats } from "./data";
import { auth } from "@clerk/nextjs/server";

const statsImages = {
  "Total Patients": "/icons/patients.svg",
  "Total Appointments": "/icons/appointments.svg",
  "Pending Appointments": "/icons/pending.svg",
  "Completed Appointments": "/icons/completed.svg",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page = "1" } = await searchParams;
  const { userId } = await auth();
  const patientCount = await getPatientStats(userId!);
  const counts = {
    "Total Patients": patientCount,
    "Total Appointments": 0,
    "Pending Appointments": 0,
    "Completed Appointments": 0,
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-[25px] mt-[29px]">
        {Object.entries(statsImages).map(([key, value], index) => (
          <DataBox
            key={index}
            img={value}
            heading={key}
            count={counts[key as keyof typeof counts]}
          />
        ))}
      </div>
      <PatientTable totalPatients={patientCount} />
    </div>
  );
}

import { riders, Rider } from "@/src/lib/dashboard.lib";
import DetailRiderScreen from "@/src/components/screens/detail-rider-screen";

export default async function DetailRider({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const riderId = (await params).id;
  let rider: Rider | undefined;

  for (let i = 0; i < riders.length; i++) {
    if (riders[i].id === riderId) {
      rider = riders[i];
      break;
    }
  }

  return <DetailRiderScreen rider={rider} />;
}

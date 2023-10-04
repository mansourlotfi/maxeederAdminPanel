import { PieChart } from "@mui/x-charts/PieChart";
import useUsers from "../../../app/hooks/useUsers";
import usePartners from "../../../app/hooks/usePartners";

function UsersAndPartners() {
  const { metaData: userMetaData } = useUsers();
  const { metaData: partnerMetaData } = usePartners();
  return (
    <PieChart
      series={[
        {
          data: [
            {
              id: 0,
              value: userMetaData?.totalCount ?? 0,
              label: "همکاران",
            },
            {
              id: 1,
              value: partnerMetaData?.totalCount ?? 0,
              label: "شعب",
            },
          ],
        },
      ]}
      sx={{ direction: "rtl" }}
      width={400}
      height={200}
    />
  );
}

export default UsersAndPartners;

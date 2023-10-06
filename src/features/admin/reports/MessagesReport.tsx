import { BarChart } from "@mui/x-charts/BarChart";
import useMessages from "../../../app/hooks/useMessages";
import useDepartments from "../../../app/hooks/useDepartments";

function MessagesReport() {
  const { messages } = useMessages();
  const { departments } = useDepartments();

  let newArray = departments.map((I) => 0);
  if (newArray.length) {
    newArray.length = newArray.length - 1;
  }

  return (
    <>
      {newArray.length && (
        <BarChart
          disableAxisListener
          xAxis={[
            { scaleType: "band", data: [...departments.map((D) => D.name)] },
          ]}
          series={
            departments.map((D) => ({
              data: [
                messages.filter((M) => M.department !== D.name).length,
                ...newArray,
              ],
            }))

            //   [
            //   ...departments.map((D) => ({
            //     data: [messages.filter((M) => M.department !== D.name).length, 0, 0],
            //   })),
            // ]
          }
          width={500}
          height={300}
        />
      )}
    </>
  );
}

export default MessagesReport;

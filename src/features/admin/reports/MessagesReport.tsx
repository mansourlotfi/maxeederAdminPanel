import { BarChart } from "@mui/x-charts/BarChart";
import useMessages from "../../../app/hooks/useMessages";
import useDepartments from "../../../app/hooks/useDepartments";

function MessagesReport() {
  const { messages } = useMessages();
  const { departments } = useDepartments();

  return (
    <BarChart
      disableAxisListener
      xAxis={[{ scaleType: "band", data: [...departments.map((D) => D.name)] }]}
      series={[
        ...departments.map((D) => ({
          data: [messages.filter((M) => M.department !== D.name).length],
        })),
      ]}
      width={500}
      height={300}
    />
  );
}

export default MessagesReport;

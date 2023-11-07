import { PieChart } from "@mui/x-charts/PieChart";
import useComments from "../../../app/hooks/useComments";

function Comments() {
  const { comments } = useComments();
  return (
    <PieChart
      colors={["green", "red"]}
      series={[
        {
          data: [
            {
              id: 0,
              value: comments.filter((C) => C.isActive).length ?? 0,
              label: "نظر تایید شده",
            },
            {
              id: 1,
              value: comments.filter((C) => !C.isActive).length ?? 0,
              label: "نظر تایید نشده",
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

export default Comments;

import { Grid, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";

function AdminReports() {
  const data = [
    { value: 5, label: "ضبط" },
    { value: 10, label: "باند" },
    { value: 15, label: "میکروفون" },
    { value: 20, label: "مانیتور" },
  ];

  const size = {
    width: 400,
    height: 200,
  };

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  function PieCenterLabel({ children }: { children: React.ReactNode }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }
  return (
    <Grid container spacing={8}>
      <Grid item container justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          گزارشات
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "کاربران قعال" },
                { id: 1, value: 15, label: "کاربران غیر فعال" },
                { id: 2, value: 20, label: "series C" },
              ],
            },
          ]}
          sx={{ direction: "rtl" }}
          width={400}
          height={200}
        />
      </Grid>
      <Grid item xs={6}>
        <PieChart
          series={[{ data, innerRadius: 80 }]}
          {...size}
          sx={{ direction: "rtl" }}
        >
          <PieCenterLabel>محصولات</PieCenterLabel>
        </PieChart>
      </Grid>
      <Grid item xs={6}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 20, label: "برندهای قعال" },
                { id: 1, value: 2, label: "برندهای غیر فعال" },
              ],
            },
          ]}
          sx={{ direction: "rtl" }}
          width={400}
          height={200}
        />
      </Grid>

      <Grid item xs={6}>
        <BarChart
          xAxis={[
            { scaleType: "band", data: ["group A", "group B", "group C"] },
          ]}
          series={[
            { data: [4, 3, 5] },
            { data: [1, 6, 3] },
            { data: [2, 5, 6] },
          ]}
          width={500}
          height={300}
        />
      </Grid>
    </Grid>
  );
}

export default AdminReports;

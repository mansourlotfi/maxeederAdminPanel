import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import useProducts from "../../../app/hooks/useProducts";
import useCategories from "../../../app/hooks/useCategories";
import useBrands from "../../../app/hooks/useBrands";

function ProductReports() {
  const { metaData: productsMetaData } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const data = [
    { value: productsMetaData?.totalCount ?? 0, label: "محصولات" },
    { value: categories.length, label: "دسته بندی ها" },
    { value: brands.length, label: "برندها" },
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
    <PieChart
      series={[{ data, innerRadius: 80 }]}
      {...size}
      sx={{ direction: "rtl" }}
    >
      <PieCenterLabel>موجودی</PieCenterLabel>
    </PieChart>
  );
}

export default ProductReports;

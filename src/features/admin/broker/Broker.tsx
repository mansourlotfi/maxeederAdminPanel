import { Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useState } from "react";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import BrokerForm from "./BrokerForm";
import { removeBroker } from "./brokerSlice";
import useBrokers from "../../../app/hooks/useBrokers";

export default function AdminBrokers() {
  const { brokers, brokersLoaded, status } = useBrokers();
  const dispatch = useAppDispatch();
  const [createBrokerMode, setCreateBrokerMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleDeleteBroker(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteBroker(id)
      .then(() => dispatch(removeBroker(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelCreateBrand() {
    setCreateBrokerMode(false);
  }
  if (!brokersLoaded && status === "idle") return <>something bad happened</>;
  if (createBrokerMode) return <BrokerForm cancel={cancelCreateBrand} />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          لیست کاربران
        </Typography>
        <Button
          onClick={() => setCreateBrokerMode(true)}
          sx={{
            m: 2,
          }}
          size="small"
          variant="contained"
        >
          کاربر جدید
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">نام کامل</TableCell>
              <TableCell align="left">شماره همراه</TableCell>
              <TableCell align="left">شماره ریفرنس</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brokers.map((broker) => (
              <TableRow
                key={broker.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {broker.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{broker.fullName}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{broker.phoneNumber}</span>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <span>{broker.ref}</span>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  {/* <Button
                    onClick={() => handleSelectProduct(brand)}
                    startIcon={<Edit />}
                  /> */}
                  <LoadingButton
                    loading={loading && target === broker.id}
                    onClick={() => handleDeleteBroker(broker.id)}
                    startIcon={<Delete />}
                    color="error"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

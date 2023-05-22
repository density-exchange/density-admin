/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Stack,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { makeGetReq, makePostReq } from "../utils/axiosHelper";
// import { useDispatch } from "react-redux";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
// import { fetchUsers } from "../redux/kyc/users.slice";

const rewardFormStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "5px",
  p: 4,
};

const confirmModalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "5px",
  p: 4,
};

export default function RewardScreen() {
  // const dispatch = useDispatch();
  const session= useSessionContext();
  const [email, setEmail] = useState("");
  const [go, setGo] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [rewardFormModal, setRewardFormModal] = useState(false);
  const [rewardHistory, serRewardHistory] = useState({history: [], total: 0});
  const [rewardData, setRewardData] = useState({
    type: "",
    amount: "",
    remarks: ""
  });
  const [userData, setUserData] =  useState({});
  const getUserData = () => {
    if(!email) return;
    makeGetReq(`/v1/users/email?email=${email}`).then((res) => {
      setUserData(res);
      setGo(true);
    }).catch(err => {
      setGo(false);
      console.log(err);
    });
  };

  const toggleConfirmModal = () => setConfirmModal(!confirmModal);
  const toggleRewardFormModal = () => setRewardFormModal(!rewardFormModal);
  const historyColumns = [
    {
      field: "date",
      headerClassName: "kyc-column-header",
      headerName: "Date",
      width: 200,
    },
    // {
    //   field: "time",
    //   headerClassName: "kyc-column-header",
    //   headerName: "Time",
    //   width: 200,
    // },
    {
      field: "userName",
      headerClassName: "kyc-column-header",
      headerName: "Username",
      width: 200,
    },
    {
      field: "rewardAmt",
      headerClassName: "kyc-column-header",
      headerName: "Reward Amount",
      width: 200,
    },
    {
      field: "admin",
      headerClassName: "kyc-column-header",
      headerName: "Admin",
      width: 200,
    },
    {
      field: "comments",
      headerClassName: "kyc-column-header",
      headerName: "Comments",
      width: 200,
    },
  ];
  const [paginationModal, setPaginationModal] = useState({
    page: 0,
    pageSize: 5
  });

  const {page, pageSize} = paginationModal;

  const getRewardHistory = useCallback(() => {
    if(!session.userId) return;
    makeGetReq(`/v1/admin-logs?actionType=REWARD&pageNo=${page+1}&size=${pageSize}&adminID=${session.userId}`)
      .then(({data, total}) => {
        console.log(data); 
        const rewardHistoryData = data.map((item) => ({
          id: item?.logID,
          date: new Date(item?.createdAt).toLocaleString(),
          userName: item?.userFirstName+" "+item?.userLastName,
          rewardAmt: item?.action?.log?.RewardAmount,
          comments: item?.action?.log?.Remark,
          admin: item?.adminName

        }));
        serRewardHistory({ history: rewardHistoryData, total});
      })
      .catch(err => console.log(err));
  }, [page, pageSize, session]);

  useEffect(() => {
    getRewardHistory();    
  }, []);

  const handleGiveReward = () => {
    console.log("hello bois");
    const {amount, type, remarks} = rewardData;
    if(!amount || !type || !remarks) return;
    const body = {
      userID: userData?.id,
      rewardAmount: Number(amount),
      remark: remarks
    };
    makePostReq("/v1/reward/admin-reward", body).then(() => {
      setConfirmModal(false);
      setRewardFormModal(false);
      getRewardHistory();
    }).catch(err => console.log(err));
    
  };

  return (
    <>
      <Box m={2}>
        <Typography variant="h2">Reward</Typography>
        <Box display="flex" className="reward_user_card">
          <Box className="enterEmailSection">
            <Box mt={2} display="flex" gap="0.5rem">
              <TextField
                label="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
              <Button
                onClick={getUserData}
                sx={{ height: "51px" }}
                variant="outlined"
              >
                <Typography variant="h4">Go</Typography>
              </Button>
            </Box>
            <Box mt={3} className="rewardButton">
              {go && (
                <Button
                  onClick={toggleRewardFormModal}
                  fullWidth
                  variant="contained"
                >
                  Click here to give reward
                </Button>
              )}
            </Box>
          </Box>

          <Box mt={2} className="userInfoCard">
            {go && (
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box display="flex" sx={{alignItems: "center"}}>
                      <Typography variant="h4">Name:</Typography>
                      <Typography variant="p" ml={3}>{userData?.firstName+" "+userData?.lastName}</Typography>
                    </Box>
                    <Box display="flex" sx={{alignItems: "center"}}>
                      <Typography variant="h4">Email:</Typography>
                      <Typography variant="p" ml={3}>{userData?.email}</Typography>

                    </Box>
                    <Box display="flex" sx={{alignItems: "center"}}>
                      <Typography variant="h4">Phone:</Typography>
                      <Typography variant="p" ml={3}>{userData?.mobileNumber}</Typography>

                    </Box>
                    <Box>
                      <Button variant="contained">Transaction History</Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        <Typography variant="h2" mt={3}>
          Reward History
        </Typography>
        <Box sx={{ pt: 2, height: "400px", width: "100%" }}>
          <DataGrid
            sx={{
              ".MuiDataGrid-columnHeaderCheckbox": {
                display: "none",
              },
              "& .MuiDataGrid-cellCheckbox": {
                display: "none",
              },
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              border: 2,
            }}
            rows={rewardHistory?.history}
            columns={historyColumns}
            rowCount={rewardHistory?.total}
            paginationMode="server"
            paginationModel={paginationModal}
            onPaginationModelChange={(event) => {
              setPaginationModal({ page: event.page, pageSize: event.pageSize });
            }}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <Modal open={rewardFormModal} onClose={toggleRewardFormModal}>
        <Box sx={rewardFormStyles}>
          <Stack spacing={2}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select the reward type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={rewardData.type}
                  label="Select the reward type"
                  onChange={(e) => setRewardData({...rewardData, type: e.target.value}) }
                >
                  <MenuItem value={"Special"}>Special</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField label="Enter the reward amount" onChange={(e) => setRewardData({...rewardData, amount: e.target.value}) } />
            <TextField label="Enter the comments" onChange={(e) => setRewardData({...rewardData, remarks: e.target.value}) } />
            <Box display="flex" justifyContent="center">
              <Button onClick={toggleConfirmModal} variant="contained">
                Confirm
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Modal open={confirmModal} onClose={toggleConfirmModal}>
        <Box sx={confirmModalStyles}>
          <Box display="flex" justifyContent="center" marginBottom={2}>
            <Typography variant="h2">Are you sure?</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box width="40%">
              <Button fullWidth variant="contained" color="error" onClick={() => setConfirmModal(false)}>
                No
              </Button>
            </Box>
            <Box width="40%">
              <Button fullWidth variant="contained" color="success" onClick={handleGiveReward}>
                Yes
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

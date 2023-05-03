/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
// import axiosInstance from "../utils/axiosHelper";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../redux/kyc/users.slice";
import { makeGetReq, makePatchReq, makePostReq } from "../utils/axiosHelper";

const ViewButton = styled(Button)(({ theme }) => ({
  backgroundColor: "lightblue",
  borderRadius: "4px",
  border: "1px solid blue",
}));
const ApproveButton = styled(Button)(({ theme }) => ({
  backgroundColor: "lightgreen",
  borderRadius: "4px",
  border: "1px solid green",
}));
const RejectButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ff7f7f",
  borderRadius: "4px",
  border: "1px solid red",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

export default function DepositRecords() {
  const dispatch = useDispatch();

  const [fiatTraxns, setFiatTraxns] = useState([]);
  const [transactionHistoryModal, setTransactionHistoryModal] = useState(false);
  const toggleViewTransactionModal = () =>
    setTransactionHistoryModal(!transactionHistoryModal);

  const depositLogs = [
    {
      field: "timestamp",
      headerClassName: "kyc-column-header",
      headerName: "Timestamp",
      width: 200,
    },
    {
      field: "action",
      headerClassName: "kyc-column-header",
      headerName: "Action",
      width: 200,
    },
    {
      field: "admin",
      headerClassName: "kyc-column-header",
      headerName: "Admin",
      width: 200,
    },
  ];

  const columns = [
    // {
    //   field: "date",
    //   headerName: "Date",
    //   headerClassName: "kyc-column-header",
    //   width: 100,
    // },
    {
      field: "timestamp",
      headerName: "Timestamp",
      headerClassName: "kyc-column-header",
      width: 200,
    },
    {
      field: "userName",
      headerName: "Username",
      headerClassName: "kyc-column-header",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      cellClassName: "kyc-row-style",
      headerClassName: "kyc-column-header",
      width: 200,
    },
    {
      field: "bankAccNo",
      cellClassName: "kyc-row-style",
      headerName: "Bank Account No",
      headerClassName: "kyc-column-header",
      width: 150,
    },
    {
      field: "depositAmount",
      headerName: "Deposit Amount",
      cellClassName: "kyc-row-style",
      headerClassName: "kyc-column-header",
      width: 150,
    },
    {
      field: "refNo",
      headerName: "Reference Number",
      cellClassName: "kyc-row-style",
      headerClassName: "kyc-column-header",
      width: 150,
    },
    {
      field: "depositStatus",
      headerName: "Deposit Status",
      cellClassName: "kyc-row-style",
      headerClassName: "kyc-column-header",
      widht: 200,
    },
    {
      field: "viewDetails",
      headerName: "View Details",
      headerClassName: "kyc-column-header",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <ViewButton onClick={toggleViewTransactionModal}>
              Transaction History
            </ViewButton>
          </>
        );
      },
    },
    {
      field: "approve",
      headerName: "Approve",
      headerClassName: "kyc-column-header",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <ApproveButton
              onClick={() => {
                changeTransaction(params.row.id, "accept");
              }}
            >
              Approve
            </ApproveButton>
          </>
        );
      },
    },
    {
      field: "reject",
      headerName: "Reject",
      headerClassName: "kyc-column-header",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <RejectButton
              onClick={() => {
                changeTransaction(params.row.id, "reject");
              }}
            >
              Reject
            </RejectButton>
          </>
        );
      },
    },
  ];
  const rows = [
    {
      id: 1,
      date: "24/01/2021",
      time: "23:12",
      userName: "jon.snow",
      email: "jon.snow@gmail.com",
      bankAccNo: "XXXXXXXX34",
      depositAmount: "₹450",
      refNo: 888888888,
      paymentMethod: "Card",
      depositStatus: "pending",
    },
    {
      id: 2,
      date: "24/01/2021",
      time: "23:12",
      userName: "jon.snow",
      email: "jon.snow@gmail.com",
      bankAccNo: "XXXXXXXX34",
      depositAmount: "₹450",
      refNo: 888888888,
      paymentMethod: "Card",
      depositStatus: "pending",
    },
    {
      id: 3,
      date: "24/01/2021",
      time: "23:12",
      userName: "jon.snow",
      email: "jon.snow@gmail.com",
      bankAccNo: "XXXXXXXX34",
      depositAmount: "₹450",
      refNo: 888888888,
      paymentMethod: "Card",
      depositStatus: "pending",
    },
    {
      id: 4,
      date: "24/01/2021",
      time: "23:12",
      userName: "jon.snow",
      email: "jon.snow@gmail.com",
      bankAccNo: "XXXXXXXX34",
      depositAmount: "₹450",
      refNo: 888888888,
      paymentMethod: "Card",
      depositStatus: "pending",
    },
    {
      id: 5,
      date: "24/01/2021",
      time: "23:12",
      userName: "jon.snow",
      email: "jon.snow@gmail.com",
      bankAccNo: "XXXXXXXX34",
      depositAmount: "₹450",
      refNo: 888888888,
      paymentMethod: "Card",
      depositStatus: "pending",
    },
  ];
  const transactionRows = [
    {
      id: 1,
      date: "24/01/2022",
      time: "1:33:18PM",
      amount: "-0.8774",
      transactionType: "USDT BUY",
      status: "verified",
      referenceId: "1f78669f-27b0-4430-8303",
    },
    {
      id: 2,
      date: "15/03/2022",
      time: "12:33:18PM",
      amount: "-0.8774",
      transactionType: "USDT SELL",
      status: "verified",
      referenceId: "1f78669f-27b0-4430-8303",
    },
    {
      id: 3,
      date: "14/11/2022",
      time: "4:18:18PM",
      amount: "-0.8774",
      transactionType: "INR DEPOSIT",
      status: "verified",
      referenceId: "1f78669f-27b0-4430-8303",
    },
    {
      id: 4,
      date: "14/08/2022",
      time: "09:18:18PM",
      amount: "-0.8774",
      transactionType: "USDT BUY",
      status: "verified",
      referenceId: "1f78669f-27b0-4430-8303",
    },
  ];
  const transactionColumns = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "time",
      headerName: "Time",
      width: 100,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 200,
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "referenceId",
      headerName: "Reference ID",
      width: 300,
    },
  ];
  // const users = useSelector((state) => state.users.users);

  const getuser = async () => {
    const data = await makeGetReq(
      "/v1/users/faa77344-2620-44e3-bc5e-bf39a379def4/kyc"
    );
    console.log(data);
  };

  const getListOfFiatTraxn = async () => {
    const { data } = await makeGetReq("v1/fiat/query-fiat-transaction");
    console.log(data);

    const rows = data.map((traxn) => ({
      id: traxn.id,
      // userName: traxn.userFirstName + " " + traxn.userLastName,
      userName:
        traxn.userFirstName && traxn.userLastName
          ? traxn.userFirstName + " " + traxn.userLastName
          : "---",
      depositAmount: traxn.amount,
      refNo: traxn.txnRefID,
      depositStatus: traxn.fiatTransactionStatus,
      bankAccNo: traxn.userBankAccount,
      email: traxn.userEmail,
      timestamp: new Date(traxn.createdAt),
      // FiatTxnID: traxn.txnID,
      // RefID: traxn.txnRefID,
    }));

    setFiatTraxns(rows);
  };

  const changeTransaction = async (userID) => {
    const { data } = await makeGetReq(`v1/users/kyc?userID=${userID}`);
    console.log(data);
  };

  const processTraxn = async (userID, action) => {
    const res = await makePostReq(
      `v1/fiat/transaction/${userID}/procesTransaction`,
      {
        ApproveAction: action,
      }
    );
  };

  useEffect(() => {
    getListOfFiatTraxn();
    // dispatch(fetchUsers());
    // getAllAdmins();
    // revokeRole();
    // addRole();
    // getAllPermissions();
    // makePermission();
    // assignRole();
    // getAdminPermissions();
    // getRolesPermissions();
    // getPermissions();
    // getAllRoles();
    // getuser();
    // getAllUsers();
  }, []);
  return (
    <>
      <Box sx={{ height: 500, width: "100%", p: 1 }}>
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
          }}
          rows={fiatTraxns}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          isRowSelectable={() => false}
        />
      </Box>
      <Box display="flex" justifyContent="center">
        <Box sx={{ height: 500, width: "50%", p: 1 }}>
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
            }}
            rows={[]}
            columns={depositLogs}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            isRowSelectable={() => false}
          />
        </Box>
      </Box>

      <Modal
        open={transactionHistoryModal}
        onClose={toggleViewTransactionModal}
      >
        <Box sx={style}>
          <DataGrid
            sx={{
              ".MuiDataGrid-columnHeaderCheckbox": {
                display: "none",
              },
              "& .MuiDataGrid-cellCheckbox": {
                display: "none",
              },
            }}
            rows={[]}
            columns={depositLogs}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}
            checkboxSelection
            disableRowSelectionOnClick
            isRowSelectable={() => false}
          />
        </Box>
      </Modal>
    </>
  );
}

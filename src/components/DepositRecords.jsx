/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, IconButton, Modal, TextField, Typography, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
// import axiosInstance from "../utils/axiosHelper";
// import { useDispatch } from 'react-redux';
// import { fetchUsers } from '../redux/kyc/users.slice';
import { makeGetReq, makePatchReq, makePostReq } from '../utils/axiosHelper';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CopyButton from './Common/CopyButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewButton = styled(Button)(({ theme }) => ({
	borderRadius: '10px',
	color: theme.palette.info.main,
	border: '2px solid',
	borderColor: theme.palette.info.main,
	'&:hover': {
		border: '2px solid',
		borderColor: theme.palette.info.dark,
		color: theme.palette.info.dark,
	},
}));

const ApproveButton = styled(Button)(({ theme }) => ({
	borderRadius: '4px',
	color: '#fff',
	backgroundColor: theme.palette.success.main,
	'&:hover': {
		backgroundColor: theme.palette.success.dark,
	},
}));
const RejectButton = styled(Button)(({ theme }) => ({
	borderRadius: '4px',
	color: '#fff',
	backgroundColor: theme.palette.error.main,
	'&:hover': {
		backgroundColor: theme.palette.error.dark,
	},
}));

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '95%',
	height: '90%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 1,
};
const csvModalStyle = {
	position: 'absolute',
	top: '40%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '30%',
	height: '80%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 4,
};

const remarkModalStyles = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '60vw',
	height: '35vh',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 2,
};

const messageModalStyles = {
	position: 'absolute',
	top: '15%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '20%',
	height: '20%',
	bgcolor: '#101010',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 4,
};
const messageModalStylesMobile = {
	position: 'absolute',
	top: '15%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40%',
	height: '20%',
	bgcolor: '#101010',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 1,
};

const mobileDepositColumns = [
	{
		field: 'deposit-rec',
		headerName: 'Deposit Records',
		width: '100vw',
	},
];

export default function DepositRecords() {
	// const { userId: adminID } = useSessionContext();
	const [fiatTraxnUserID, setFiatTraxnUserID] = useState(null);
	const [enteredRefId, setEnteredRefId] = useState('');
	const [message, setMessage] = useState('');
	const [actionType, setActionType] = useState('');
	const [deposit, setDeposit] = useState(null);

	const [totalData, setTotalData] = useState(null);
	const [pageID, setPageID] = useState(null);
	const [nextPageID, setNextPageID] = useState(null);

	const [totalLogData, setTotalLogData] = useState(null);
	const [logPageID, setLogPageID] = useState(null);
	const [logNextPageID, setLogNextPageID] = useState(null);

	const [traxnHistoryAccordionRows, setTraxnHistoryAccordionRows] = useState([]);
	const [totalTraxnHistory, setTotalTraxnHistory] = useState(null);
	const [traxnHistoryPageID, setTraxnHistoryID] = useState(null);
	const [traxnHistoryNextPageID, setTraxnHistoryNextPageID] = useState(null);

	const isMobile = useMediaQuery('(min-width:768px)');
	const [csvFormData, setCsvFormData] = useState({
		traxnId: '',
		userId: '',
		status: '',
		// startTime: dayjs(new Date().toLocaleDateString())
		//   .toDate()
		//   .toLocaleDateString(),
		// endTime: dayjs(new Date().toLocaleDateString())
		//   .toDate()
		//   .toLocaleDateString(),
	});

	const [selectedRefNo, setSelectedRefNo] = useState('');
	const [queryCsvModal, setQueryCsvModal] = useState(false);
	const toggleQueryCsvModal = () => setQueryCsvModal(!queryCsvModal);

	const [messageModal, setMessageModal] = useState(false);
	const toggleMessageModal = () => setMessageModal(!messageModal);

	const [fiatTraxnHistoryRows, setFiatTraxnHistoryRows] = useState([]);
	const [AccordionRows, setAccordionRows] = useState([]);
	const [logAccordionRows, setLogAccordionRows] = useState([]);

	const [paginationModal, setPaginationModal] = useState({
		page: 0,
		pageSize: 5,
	});

	const [mobilePaginationModal, setMobilePaginationModal] = useState({
		page: 0,
		pageSize: 10,
	});
	const [mobileLogPaginationModal, setMobileLogPaginationModal] = useState({
		page: 0,
		pageSize: 10,
	});
	const [mobileFiatTraxnByIdModal, setMobileFiatTraxnByIdModal] = useState({
		page: 0,
		pageSize: 8,
	});
	const [totalRows, setTotalRows] = useState(0);
	const [depositRows, setDepositRows] = useState([]);
	const [depositPaginationModal, setDepositPaginationModal] = useState({
		page: 0,
		pageSize: 5,
	});

	const [totalDepositLogRows, setTotalDepositLogRows] = useState(0);

	const [fiatTraxns, setFiatTraxns] = useState([]);
	const [fiatTraxnsMobile, setFiatTraxnsMobile] = useState([]);
	const [transactionHistoryModal, setTransactionHistoryModal] = useState(false);
	const toggleViewTransactionModal = () => setTransactionHistoryModal(!transactionHistoryModal);

	const [remark, setRemark] = useState('');
	const [remarkModal, setRemarkModal] = useState(false);
	const toggleRemarkModal = () => setRemarkModal(!remarkModal);

	const depositLogs = [
		{
			field: 'timestamp',
			headerClassName: 'kyc-column-header',
			headerName: 'Timestamp',
			width: 150,
		},
		{
			field: 'action',
			headerClassName: 'kyc-column-header',
			headerName: 'Action',
			width: 150,
		},
		{
			field: 'admin',
			headerClassName: 'kyc-column-header',
			headerName: 'Admin',
			width: 200,
		},
		{
			field: 'remarks',
			headerClassName: 'kyc-column-header',
			headerName: 'Remark',
			width: 500,
		},
		{
			field: 'amount',
			headerClassName: 'kyc-column-header',
			headerName: 'Amount',
			width: 180,
		},
		{
			field: 'user',
			headerClassName: 'kyc-column-header',
			headerName: 'User',
			width: 200,
		},
		{
			field: 'phone',
			headerClassName: 'kyc-column-header',
			headerName: 'Phone',
			width: 200,
		},
	];

	const columns = [
		{
			field: 'date',
			headerName: 'Date',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			width: 100,
		},
		{
			field: 'time',
			headerName: 'Time',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			width: 100,
		},
		{
			field: 'userName',
			headerName: 'Username',
			headerClassName: 'kyc-column-header',
			width: 100,
		},
		{
			field: 'email',
			headerName: 'Email',
			headerClassName: 'kyc-column-header',
			width: 150,
		},
		{
			field: 'phone',
			headerName: 'Phone',
			headerClassName: 'kyc-column-header',
			width: 150,
		},
		{
			field: 'bankAccNo',
			cellClassName: 'kyc-row-style',
			headerName: 'Bank Account No',
			headerClassName: 'kyc-column-header',
			width: 150,
			renderCell: (params) => {
				return (
					<Box sx={{ display: "flex", alignItems: "center", justifyItems: "center" }}>
        		<Typography variant="Regular_14" sx={{ width: "100%", textOverflow: "ellipsis", overflow: "hidden" }}>
						{`****${params.row?.bankAccNo?.slice(-4)}`}</Typography>
        		<CopyButton copyText={params.row?.bankAccNo}/>
      		</Box>
				)
			}
		},
		{
			field: 'depositAmount',
			headerName: 'Deposit Amount',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			width: 100,
		},
		{
			field: 'redactedRefID',
			headerName: 'Reference Number',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			width: 100,
		},
		{
			field: 'depositStatus',
			headerName: 'Deposit Status',
			headerClassName: 'kyc-column-header',
			widht: 200,
		},
		{
			field: 'viewDetails',
			headerName: 'View Details',
			headerClassName: 'kyc-column-header',
			width: 150,
			renderCell: (params) => {
				return (
					<>
						<ViewButton
							onClick={async () => {
								toggleViewTransactionModal();
								await getFiatTraxnById(params.row.UserID);
							}}
						>
							Trxn History
						</ViewButton>
					</>
				);
			},
		},
		{
			field: 'approve',
			headerName: 'Approve',
			headerClassName: 'kyc-column-header',
			width: 100,
			renderCell: (params) => {
				return (
					<>
						<ApproveButton
							onClick={() => {
								setSelectedRefNo(params.row.RefID);
								setActionType('Approve');
								setDeposit({
									UserID: params.row.UserID,
									action: 'approve',
									RefID: params.row.RefID,
									FiatTxnID: params.row.FiatTxnID,
									Amount: params.row.depositAmount + '',
									ActionType: params.row.TraxnType,
								});
								toggleRemarkModal();
							}}
						>
							Approve
						</ApproveButton>
					</>
				);
			},
		},
		{
			field: 'reject',
			headerName: 'Reject',
			headerClassName: 'kyc-column-header',
			width: 100,
			renderCell: (params) => {
				return (
					<>
						<RejectButton
							onClick={() => {
								setActionType('Reject');
								setSelectedRefNo(params.row.RefID);
								setDeposit({
									UserID: params.row.UserID,
									action: 'reject',
									RefID: params.row.RefID,
									FiatTxnID: params.row.FiatTxnID,
									Amount: params.row.depositAmount + '',
									ActionType: params.row.TraxnType,
								});
								toggleRemarkModal();
							}}
						>
							Reject
						</RejectButton>
					</>
				);
			},
		},
	];
	const transactionColumns = [
		{
			field: 'date',
			headerClassName: 'kyc-column-header',
			headerName: 'Date',
			width: 200,
		},
		{
			field: 'time',
			headerClassName: 'kyc-column-header',
			headerName: 'Time',
			width: 100,
		},
		// {
		// 	field: 'RefID',
		// 	headerClassName: 'kyc-column-header',
		// 	headerName: 'Reference Number',
		// 	width: 300,
		// },
		{
			field: 'depositAmount',
			headerClassName: 'kyc-column-header',
			headerName: 'Amount',
			width: 200,
		},
		{
			field: 'depositStatus',
			headerClassName: 'kyc-column-header',
			headerName: 'Status',
			width: 100,
		},
	];

	const mobileDepositRows = [
		{
			id: 1,
			'deposit-rec': 'one',
		},
		{
			id: 2,
			'deposit-rec': 'two',
		},
	];

	const changePagination = (event) => {
		setPaginationModal({ page: event.page, pageSize: event.pageSize });
	};

	const changePaginationLogs = (event) => {
		setDepositPaginationModal({ page: event.page, pageSize: event.pageSize });
	};

	const fetchAllFiatTxnMobile = useCallback(async () => {
		const { data, total, pageID, nextPageID } = await makeGetReq(
			`v1/fiat/query-fiat-transaction?type=INR_DEPOSIT&size=${mobilePaginationModal.pageSize}&start=${
				mobilePaginationModal.page * mobilePaginationModal.pageSize
			}&status=STARTED`
		);
		const rows = data?.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			depositAmount: traxn.amount,
			depositStatus: traxn.fiatTransactionStatus,
			bankAccNo: traxn.userBankAccount,
			phone: traxn.userPhone,
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			FiatTxnID: traxn.txnID,
			RefID: traxn.txnRefID,
			redactedRefID: redactString(traxn.txnRefID),
			UserID: traxn.userID,
			TraxnType: traxn.fiatTransactionType,
		}));
		setFiatTraxnsMobile(rows);
		setTotalData(total);
		setPageID(pageID);
		setNextPageID(nextPageID);
	}, [mobilePaginationModal.page, mobilePaginationModal.pageSize]);

	const fetchAllFiatTxn = useCallback(async () => {
		const { data, total } = await makeGetReq(
			`v1/fiat/query-fiat-transaction?type=INR_DEPOSIT&size=${paginationModal.pageSize}&start=${
				paginationModal.page * paginationModal.pageSize
			}&status=STARTED`
		);

		// console.log(data);
		const rows = data?.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			depositAmount: traxn.amount,
			depositStatus: traxn.fiatTransactionStatus,
			bankAccNo: traxn.userBankAccount,
			phone: traxn.userPhone,
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			FiatTxnID: traxn.txnID,
			RefID: traxn.txnRefID,
			redactedRefID: redactString(traxn.txnRefID),
			UserID: traxn.userID,
			TraxnType: traxn.fiatTransactionType,
		}));

		const accRows = rows?.map((traxn) => ({
			id: traxn.id,
			'deposit-rec': (
				<Accordion>
					<AccordionSummary>
						<h1>{traxn.email}</h1>
					</AccordionSummary>
				</Accordion>
			),
		}));

		setAccordionRows(accRows);
		setFiatTraxns(rows);
		setTotalRows(total);
	}, [paginationModal.page, paginationModal.pageSize]);

	const fetchAllLogs = useCallback(async () => {
		const { data, total } = await makeGetReq(
			`v1/admin-logs?actionType=FIAT&size=${depositPaginationModal.pageSize}&pageNo=${depositPaginationModal.page + 1}`
		);
		// console.log(data);
		const rows = data.map((log) => ({
			id: log.logID,
			admin: log.adminName,
			timestamp: new Date(log.createdAt).toLocaleDateString(),
			action: log.action.log.ApproveAction == 1 ? 'Approve' : 'Reject',
			user: log.userFirstName && log.userLastName ? log.userFirstName + ' ' + log.userLastName : '---',
			phone: log.phone,
			remarks: log.action.log.Remarks?.join(' '),
			amount: log.action.log.Amount,
		}));
		// console.log(rows);
		setDepositRows(rows);
		setTotalDepositLogRows(total);
	}, [depositPaginationModal.page, depositPaginationModal.pageSize]);

	const fetchAllLogsMobile = useCallback(async () => {
		const { data, total, pageNo, nextPageNo } = await makeGetReq(
			`v1/admin-logs?actionType=FIAT&size=${mobileLogPaginationModal.pageSize}&pageNo=${
				mobileLogPaginationModal.page + 1
			}`
		);
		const rows = data.map((log) => ({
			id: log.logID,
			admin: log.adminName === '' ? '---' : log.adminName,
			timestamp: new Date(log.createdAt).toLocaleDateString(),
			action: log.action.log.ApproveAction == 1 ? 'Approve' : 'Reject',
			user: log.userFirstName && log.userLastName ? log.userFirstName + ' ' + log.userLastName : '---',
			phone: log.phone,
			remarks: log.action.log.Remarks?.join(' '),
			amount: log.action.log.Amount,
		}));
		setLogAccordionRows(rows);
		setTotalLogData(total);
		setLogPageID(pageNo);
		setLogNextPageID(nextPageNo);
	}, [mobileLogPaginationModal.page, mobileLogPaginationModal.pageSize]);

	const getFiatTraxnById = async (userId) => {
		if(!userId) return;

		const { data } = await makeGetReq(`v1/fiat/query-fiat-transaction?userID=${userId}&type=INR_DEPOSIT`);
		const rows = data.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			depositAmount: traxn.amount,
			depositStatus: traxn.fiatTransactionStatus,
			RefID: traxn.txnRefID,
		}));
		setFiatTraxnHistoryRows(rows);
	};

	const getFiatTraxnByIdMobile = useCallback(async () => {
		if(!fiatTraxnUserID) return;

		const { data, total, pageID, nextPageID } = await makeGetReq(
			`v1/fiat/query-fiat-transaction?userID=${fiatTraxnUserID}&type=INR_DEPOSIT&size=${
				mobileFiatTraxnByIdModal.pageSize
			}&start=${mobileFiatTraxnByIdModal.page * mobileFiatTraxnByIdModal.pageSize}`
		);
		const rows = data.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			depositAmount: traxn.amount,
			depositStatus: traxn.fiatTransactionStatus,
			RefID: traxn.txnRefID,
		}));
		setTraxnHistoryAccordionRows(rows);
		setTotalTraxnHistory(total);
		setTraxnHistoryID(pageID);
		setTraxnHistoryNextPageID(nextPageID);
	}, [mobileFiatTraxnByIdModal.page, mobileFiatTraxnByIdModal.pageSize, fiatTraxnUserID]);

	const processTraxn = async (UserID, action, RefID, FiatTxnID, Amount, Remark, ActionType) => {
		try {
			const res = await makePostReq(`v1/fiat/transaction/${UserID}/processTransaction`, {
				ApproveAction: action,
				RefID,
				FiatTxnID,
				UserID,
				Amount,
				Remark,
				ActionType,
			});
			toggleMessageModal();
			toggleRemarkModal();
			setRemark('');
			setMessage(`Transaction completed with an action ${action}`);
			await fetchAllFiatTxn();
			await fetchAllFiatTxnMobile();
		} catch (err) {
			toggleMessageModal();
			toggleRemarkModal();
			setRemark('');
			setMessage(err.response.data.ErrorMessage);
			await fetchAllFiatTxn();
			await fetchAllFiatTxnMobile();
		}
	};

	const redactString = (refNo) => {
		let str = '';
		for (let i = 0; i < refNo.length - 3; ++i) {
			str += '*';
		}
		return str + refNo.slice(-3);
	};

	console.log(fiatTraxns);

	useEffect(() => {
		fetchAllFiatTxnMobile();
	}, [fetchAllFiatTxnMobile]);

	useEffect(() => {
		fetchAllLogsMobile();
	}, [fetchAllLogsMobile]);

	useEffect(() => {
		fetchAllLogs();
		fetchAllFiatTxn();
	}, [fetchAllFiatTxn, fetchAllLogs]);

	useEffect(() => {
		getFiatTraxnByIdMobile();
	}, [getFiatTraxnByIdMobile]);

	return (
		<Box sx={{ backgroundColor: '#EFF6FF' }}>
			<Box padding="10px" display="flex">
				<Box width="100%" display="flex" justifyContent="center">
					<Typography textAlign="center" variant={isMobile ? 'h2' : 'h2'}>
						Deposit Records
					</Typography>
				</Box>
				<Box sx={{ position: 'absolute', right: '10px', marginTop: '10px' }}>
					<Button onClick={toggleQueryCsvModal} variant="contained">
						Download deposit records
					</Button>
				</Box>
			</Box>

			{isMobile ? (
				<>
					<Box sx={{ height: "420px", width: '100%', p: 1 }}>
						<DataGrid
							sx={{
								'.MuiDataGrid-columnHeaderCheckbox': {
									display: 'none',
								},
								'& .MuiDataGrid-cellCheckbox': {
									display: 'none',
								},
								'&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
									outline: 'none !important',
								},
								backgroundColor: '#FFF',
								fontSize: '15px',
								borderRadius: '20px',
								padding: '10px',
								boxShadow: 5,
							}}
							rows={isMobile ? fiatTraxns : AccordionRows}
							columns={isMobile ? columns : mobileDepositColumns}
							paginationModel={paginationModal}
							rowCount={totalRows}
							pageSizeOptions={[5, 10]}
							paginationMode="server"
							onPaginationModelChange={changePagination}
							checkboxSelection
							disableRowSelectionOnClick
							isRowSelectable={() => false}
						/>
					</Box>
					<Box display="flex" justifyContent="center">
						<Typography variant="h2">Deposit Logs</Typography>
					</Box>
					<Box display="flex" justifyContent="center">
						<Box sx={{ height: "420px", width: '100%', p: 1 }}>
							<DataGrid
								sx={{
									'.MuiDataGrid-columnHeaderCheckbox': {
										display: 'none',
									},
									'& .MuiDataGrid-cellCheckbox': {
										display: 'none',
									},
									'&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
										outline: 'none !important',
									},
									backgroundColor: '#fff',
								}}
								rows={depositRows}
								columns={depositLogs}
								paginationModel={depositPaginationModal}
								rowCount={totalDepositLogRows}
								paginationMode="server"
								pageSizeOptions={[5, 10]}
								onPaginationModelChange={changePaginationLogs}
								checkboxSelection
								disableRowSelectionOnClick
								isRowSelectable={() => false}
							/>
						</Box>
					</Box>
				</>
			) : (
				<>
					<Box sx={{ m: 1 }}>
						{fiatTraxnsMobile?.map((traxn) => (
							<Accordion sx={{ border: '1px solid black' }} key={traxn.id}>
								<AccordionSummary>
									<Typography variant="h4">{traxn.email}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography variant="h4">Date: {traxn.date}</Typography>
									<Typography variant="h4">Time: {traxn.time}</Typography>
									<Typography variant="h4">Username: {traxn.userName}</Typography>
									<Typography variant="h4">Deposit Amount: {traxn.depositAmount}</Typography>
									<Typography variant="h4">Deposit Status: {traxn.depositStatus}</Typography>
									<Typography variant="h4">Bank Account No: {traxn.phone}</Typography>
									<Typography variant="h4">Bank Account No: {traxn.bankAccNo}</Typography>
									<Typography variant="h4">Reference Number: {traxn.redactedRefID}</Typography>
									<Box mt={1}>
										<Button
											onClick={async () => {
												toggleViewTransactionModal();
												setFiatTraxnUserID(traxn.UserID);
												await getFiatTraxnByIdMobile(traxn.UserID);
											}}
											variant="contained"
											fullWidth
										>
											View Transaction history
										</Button>
									</Box>
									<Box mt={1} display="flex" justifyContent="space-between">
										<Box width="45%">
											<ApproveButton
												fullWidth
												onClick={() => {
													setSelectedRefNo(traxn.RefID);
													setActionType('Approve');
													setDeposit({
														UserID: traxn.UserID,
														action: 'approve',
														RefID: traxn.RefID,
														FiatTxnID: traxn.FiatTxnID,
														Amount: traxn.depositAmount + '',
														ActionType: traxn.TraxnType,
													});
													toggleRemarkModal();
												}}
											>
												Approve
											</ApproveButton>
										</Box>
										<Box width="45%">
											<RejectButton
												fullWidth
												onClick={() => {
													setSelectedRefNo(traxn.RefID);
													setActionType('Reject');
													setDeposit({
														UserID: traxn.UserID,
														action: 'reject',
														RefID: traxn.RefID,
														FiatTxnID: traxn.FiatTxnID,
														Amount: traxn.depositAmount + '',
														ActionType: traxn.TraxnType,
													});
													toggleRemarkModal();
												}}
											>
												Reject
											</RejectButton>
										</Box>
									</Box>
								</AccordionDetails>
							</Accordion>
						))}
					</Box>

					<Box display="flex" justifyContent="center">
						<Box display="flex">
							<IconButton
								onClick={() => {
									if (pageID > 0)
										setMobilePaginationModal({
											...mobilePaginationModal,
											page: mobilePaginationModal.page - 1,
										});
								}}
							>
								<Box border="1px solid black" borderRadius={1}>
									<ArrowBackIcon fontSize="large" />
								</Box>
							</IconButton>
							<IconButton
								onClick={() => {
									if (pageID >= 0 && nextPageID < totalData)
										setMobilePaginationModal({
											...mobilePaginationModal,
											page: mobilePaginationModal.page + 1,
										});
								}}
							>
								<Box border="1px solid black" borderRadius={1}>
									<ArrowForwardIcon fontSize="large" />
								</Box>
							</IconButton>
						</Box>
					</Box>

					<Box display="flex" justifyContent="center">
						<Typography variant={isMobile ? 'h1' : 'h2'}>Logs</Typography>
					</Box>

					<Box sx={{ m: 1 }}>
						{logAccordionRows?.map((log) => (
							<Accordion sx={{ border: '1px solid black' }} key={log.id}>
								<AccordionSummary>
									<Typography variant="h4">{log.admin}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography variant="h4">Timestamp: {log.timestamp}</Typography>
									<Typography variant="h4">Admin: {log.admin}</Typography>
									<Typography variant="h4">Action: {log.action}</Typography>
									<Typography variant="h4">User: {log.user}</Typography>
									<Typography variant="h4">Amount: {log.amount}</Typography>
									<Typography variant="h4">Phone: {log.phone}</Typography>
									<Typography variant="h4">Remarks: {log.remarks}</Typography>
								</AccordionDetails>
							</Accordion>
						))}
					</Box>
					<Box display="flex" justifyContent="center">
						<Box display="flex">
							<IconButton
								onClick={() => {
									if (logPageID > 1)
										setMobileLogPaginationModal({
											...mobileLogPaginationModal,
											page: mobileLogPaginationModal.page - 1,
										});
								}}
							>
								<Box border="1px solid black" borderRadius={1}>
									<ArrowBackIcon fontSize="large" />
								</Box>
							</IconButton>
							<IconButton
								onClick={() => {
									if (logNextPageID !== -1)
										setMobileLogPaginationModal({
											...mobileLogPaginationModal,
											page: mobileLogPaginationModal.page + 1,
										});
								}}
							>
								<Box border="1px solid black" borderRadius={1}>
									<ArrowForwardIcon fontSize="large" />
								</Box>
							</IconButton>
						</Box>
					</Box>
				</>
			)}

			<Modal open={transactionHistoryModal} onClose={toggleViewTransactionModal}>
				<Box sx={style}>
					{isMobile ? (
						<DataGrid
							sx={{
								'.MuiDataGrid-columnHeaderCheckbox': {
									display: 'none',
								},
								'& .MuiDataGrid-cellCheckbox': {
									display: 'none',
								},
								backgroundColor: '#fff',
							}}
							rows={fiatTraxnHistoryRows}
							columns={transactionColumns}
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
					) : (
						<>
							<Box>
								{traxnHistoryAccordionRows.map((traxn) => (
									<Accordion sx={{ border: '1px solid black' }} key={traxn.id}>
										<AccordionSummary>
											<Typography variant="h4">
												Date: {traxn.date} Time: {traxn.time}
											</Typography>
										</AccordionSummary>
										<AccordionDetails>
											<Typography variant="h4">UserName: {traxn.userName}</Typography>
											<Typography variant="h4">Email: {traxn.email}</Typography>
											<Typography variant="h4">Date: {traxn.date}</Typography>
											<Typography variant="h4">Time: {traxn.time}</Typography>
											<Typography variant="h4">Amount: {traxn.depositAmount}</Typography>
											<Typography variant="h4">Status: {traxn.depositStatus}</Typography>
											<Typography variant="h4">Reference No.: {traxn.RefID}</Typography>
										</AccordionDetails>
									</Accordion>
								))}
							</Box>
							<Box display="flex" justifyContent="center">
								<Box display="flex">
									<IconButton
										onClick={() => {
											if (traxnHistoryPageID > 0)
												setMobileFiatTraxnByIdModal({
													...mobileFiatTraxnByIdModal,
													page: mobileFiatTraxnByIdModal.page - 1,
												});
										}}
									>
										<Box border="1px solid black" borderRadius={1}>
											<ArrowBackIcon fontSize="large" />
										</Box>
									</IconButton>
									<IconButton
										onClick={() => {
											if (traxnHistoryPageID >= 0 && traxnHistoryNextPageID < totalTraxnHistory)
												setMobileFiatTraxnByIdModal({
													...mobileFiatTraxnByIdModal,
													page: mobileFiatTraxnByIdModal.page + 1,
												});
										}}
									>
										<Box border="1px solid black" borderRadius={1}>
											<ArrowForwardIcon fontSize="large" />
										</Box>
									</IconButton>
								</Box>
							</Box>
						</>
					)}
				</Box>
			</Modal>

			<Modal
				open={messageModal}
				onClose={() => {
					toggleMessageModal();
					setEnteredRefId('');
				}}
			>
				<Box sx={isMobile ? messageModalStyles : messageModalStylesMobile}>
					<Typography variant="h3" color="#ebff25">
						{message}
					</Typography>
				</Box>
			</Modal>

			<Modal open={queryCsvModal} onClose={toggleQueryCsvModal}>
				<Box sx={csvModalStyle}>
					<TextField fullWidth label="Enter traxn id" />
					<TextField sx={{ mt: 2 }} fullWidth label="Enter User id" />
					<TextField sx={{ mt: 2 }} fullWidth label="status" />
					{/* <TextField sx={{ mt: 2 }} fullWidth label="startTime" /> */}
					<Box>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DemoContainer components={['DatePicker']}>
								<DatePicker
									label="Enter start time"
									value={csvFormData.startTime}
									onChange={(newDate) => setCsvFormData({ ...csvFormData, startTime: newDate })}
								/>
							</DemoContainer>
						</LocalizationProvider>
					</Box>
					<Box>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DemoContainer components={['DatePicker']}>
								<DatePicker
									label="Enter end time"
									value={csvFormData.startTime}
									onChange={(newDate) => setCsvFormData({ ...csvFormData, startTime: newDate })}
								/>
							</DemoContainer>
						</LocalizationProvider>
					</Box>
					<TextField sx={{ mt: 2 }} fullWidth label="size" />
					<Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
						<Button variant="contained">Download</Button>
					</Box>
				</Box>
			</Modal>

			<Modal
				open={remarkModal}
				onClose={() => {
					setRemark('');
					setEnteredRefId('');
					toggleRemarkModal();
				}}
			>
				<Box sx={remarkModalStyles}>
					<Box display="flex" flexDirection="column">
						<TextField required label="Enter Remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
						{actionType === 'Approve' ? (
							<TextField
								sx={{ mt: 2 }}
								required
								label="Enter Reference number"
								value={enteredRefId}
								onChange={(e) => setEnteredRefId(e.target.value)}
							/>
						) : (
							''
						)}

						<Button
							disabled={selectedRefNo !== enteredRefId && actionType === 'Approve'}
							variant="contained"
							sx={{ mt: 2 }}
							onClick={async () => {
								await processTraxn(
									deposit.UserID,
									deposit.action,
									deposit.RefID,
									deposit.FiatTxnID,
									deposit.Amount,
									[remark],
									deposit.ActionType
								);
								await fetchAllLogs();
								await fetchAllLogsMobile();
							}}
						>
							{actionType}
						</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
}

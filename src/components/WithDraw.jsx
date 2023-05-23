import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	IconButton,
	Modal,
	Paper,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	useMediaQuery,
	Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CopyButton from './Common/CopyButton';
import React, { useCallback, useEffect, useState } from 'react';
import { makeGetReq, makePostReq } from '../utils/axiosHelper';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ShowButton = styled(Button)(({ theme }) => ({
	backgroundColor: 'lightblue',
	borderRadius: '4px',
	border: '1px solid blue',
}));

const DownloadButton = styled(Button)(({ theme }) => ({
	backgroundColor: '#FFFF00',
	borderRadius: '4px',
	border: '1px solid #757500',
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	'& .MuiToggleButtonGroup-grouped': {
		margin: theme.spacing(0.5),
		border: 0,
		'&.Mui-disabled': {
			border: 0,
		},
		'&:not(:first-of-type)': {
			borderRadius: theme.shape.borderRadius,
		},
		'&:first-of-type': {
			borderRadius: theme.shape.borderRadius,
		},
	},
}));

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
	width: '90%',
	height: '70%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 4,
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
	width: '60%',
	height: '35%',
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 2,
};

export default function WithDraw() {
	const { userId: adminID } = useSessionContext();

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
	const [fiatTraxnUserID, setFiatTraxnUserID] = useState(null);
	const [selectedRefNo, setSelectedRefNo] = useState('');
	const [txnRefId, setTxnRefId] = useState('');
	const [queryCsvModal, setQueryCsvModal] = useState(false);
	const toggleQueryCsvModal = () => setQueryCsvModal(!queryCsvModal);

	const [template, setTemplate] = useState('');

	const [message, setMessage] = useState('');
	const [actionType, setActionType] = useState('');
	const [deposit, setDeposit] = useState(null);

	const [messageModal, setMessageModal] = useState(false);
	const toggleMessageModal = () => setMessageModal(!messageModal);

	const [fiatTraxnHistoryRows, setFiatTraxnHistoryRows] = useState([]);

	//Accordion states for fiat trasanctions
	const [mobilePaginationModal, setMobilePaginationModal] = useState({
		page: 0,
		pageSize: 10,
	});
	const [fiatTraxnsMobile, setFiatTraxnsMobile] = useState([]);
	const [totalData, setTotalData] = useState(null);
	const [pageID, setPageID] = useState(null);
	const [nextPageID, setNextPageID] = useState(null);

	//Accordion states for fiat logs
	const [mobileLogPaginationModal, setMobileLogPaginationModal] = useState({
		page: 0,
		pageSize: 10,
	});
	const [logAccordionRows, setLogAccordionRows] = useState([]);
	const [totalLogData, setTotalLogData] = useState(null);
	const [logPageID, setLogPageID] = useState(null);
	const [logNextPageID, setLogNextPageID] = useState(null);

	//Accordion states for fiat traxn by ID
	const [mobileFiatTraxnByIdModal, setMobileFiatTraxnByIdModal] = useState({
		page: 0,
		pageSize: 8,
	});
	const [traxnHistoryAccordionRows, setTraxnHistoryAccordionRows] = useState([]);
	const [totalTraxnHistory, setTotalTraxnHistory] = useState(null);
	const [traxnHistoryPageID, setTraxnHistoryID] = useState(null);
	const [traxnHistoryNextPageID, setTraxnHistoryNextPageID] = useState(null);

	const [paginationModal, setPaginationModal] = useState({
		page: 0,
		pageSize: 5,
	});
	const [totalRows, setTotalRows] = useState(0);
	const [depositRows, setDepositRows] = useState([]);
	const [depositPaginationModal, setDepositPaginationModal] = useState({
		page: 0,
		pageSize: 5,
	});

	const [totalDepositLogRows, setTotalDepositLogRows] = useState(0);

	const [fiatTraxns, setFiatTraxns] = useState([]);
	const [transactionHistoryModal, setTransactionHistoryModal] = useState(false);
	const toggleViewTransactionModal = () => setTransactionHistoryModal(!transactionHistoryModal);

	const handleAlignment = async (event, newAlignment) => {
		setTemplate(newAlignment);
		// setPaginationModal(paginationModal => ({ page: 1, pageSize : paginationModal.pageSize}))
	};

	const [isEditAllowed, setIsEditAllowed] = useState(false);

	const [remark, setRemark] = useState('');
	const [remarkModal, setRemarkModal] = useState(false);
	const toggleRemarkModal = () => setRemarkModal(!remarkModal);

	const depositLogs = [
		{
			field: 'timestamp',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			headerName: 'Timestamp',
			width: 150,
		},
		{
			field: 'action',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			headerName: 'Action',
			width: 150,
		},
		{
			field: 'admin',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			headerName: 'Admin',
			width: 200,
		},
		{
			field: 'remarks',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			headerName: 'Remark',
			width: 500,
		},
		{
			field: 'amount',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			headerName: 'Amount',
			width: 180,
		},
		{
			field: 'user',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			headerName: 'User',
			width: 200,
		},
		{
			field: 'phone',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			headerName: 'Phone',
			width: 200,
		},
	];

	const withdrawColumns = [
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
			width: 120,
			renderCell: (params) => {
				return (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
						<Typography variant="Regular_14" sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
							{`${params.row?.userName?.slice(0, 8)}...`}
						</Typography>
						<CopyButton copyText={params.row?.userName} />
					</Box>
				);
			},
		},
		{
			field: 'email',
			headerName: 'Email',
			headerClassName: 'kyc-column-header',
			width: 150,
			renderCell: (params) => {
				return (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
						<Typography variant="Regular_14" sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
							{`${params.row?.email?.slice(0, 13)}...`}
						</Typography>
						<CopyButton copyText={params.row?.email} />
					</Box>
				);
			},
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
			width: 100,
			renderCell: (params) => {
				return (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
						<Typography variant="Regular_14" sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
							{`****${params.row?.bankAccNo?.slice(-4)}`}
						</Typography>
						<CopyButton copyText={params.row?.bankAccNo} />
					</Box>
				);
			},
		},
		{
			field: 'ifsc',
			headerName: 'IFSC',
			headerClassName: 'kyc-column-header',
			width: 100,
			renderCell: (params) => {
				return (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
						<Typography variant="Regular_14" sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
							{`****${params.row?.ifsc?.slice(-4)}`}
						</Typography>
						<CopyButton copyText={params.row?.ifsc} />
					</Box>
				);
			},
		},
		{
			field: 'withdrawAmount',
			headerName: 'Withdraw Amount',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			width: 100,
		},
		{
			field: 'RefID',
			headerName: 'Reference Number',
			cellClassName: 'kyc-row-style',
			headerClassName: 'kyc-column-header',
			width: 200,
		},
		{
			field: 'withdrawStatus',
			headerName: 'Withdraw Status',
			headerClassName: 'kyc-column-header',
			width: 150,
			renderCell: (params) => {
				return <Typography sx={{ fontSize: '15px', color: '#fcbe42', fontWeight: '500' }}>Processing</Typography>;
			},
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
			field: 'FiatTxnID',
			headerName: 'Transaction ID',
			headerClassName: 'kyc-column-header',
			width: 120,
			renderCell: (params) => {
				return (
					<Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
						<Typography variant="Regular_14" sx={{ width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }}>
							{`***${params.row?.FiatTxnID?.slice(-5)}`}
						</Typography>
						<CopyButton copyText={params.row?.FiatTxnID} />
					</Box>
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
									FiatTxnID: params.row.FiatTxnID,
									Amount: params.row.withdrawAmount + '',
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
							disabled={params.row.depositStatus == 'SUCCESS'}
							onClick={() => {
								setActionType('Reject');
								setSelectedRefNo(params.row.RefID);
								setDeposit({
									UserID: params.row.UserID,
									action: 'reject',
									FiatTxnID: params.row.FiatTxnID,
									Amount: params.row.withdrawAmount + '',
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

	const filteredWithdrawColumns = withdrawColumns.filter(
		(column) => column.field !== 'approve' && column.field !== 'reject'
	);

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
		{
			field: 'RefID',
			headerClassName: 'kyc-column-header',
			headerName: 'Reference ID',
			width: 300,
		},
		{
			field: 'withdrawlAmount',
			headerClassName: 'kyc-column-header',
			headerName: 'Amount',
			width: 200,
		},
		{
			field: 'withdrawlStatus',
			headerClassName: 'kyc-column-header',
			headerName: 'Status',
			width: 100,
		},
	];

	const changePagination = (event) => {
		setPaginationModal({ page: event.page, pageSize: event.pageSize });
	};

	const changePaginationLogs = (event) => {
		setDepositPaginationModal({ page: event.page, pageSize: event.pageSize });
	};

	// const fetchUserRole = useCallback(async () => {
	// 	if (!adminID) return;
	// 	const role = await makeGetReq(`v1/admin/${adminID}`);
	// 	setIsEditAllowed(role.IsSuperAdmin);
	// }, [adminID]);

	const fetchUserRole = useCallback(() => {
		makeGetReq(`v1/admin/${adminID}`)
			.then((role) => {
				if (!isEditAllowed) setIsEditAllowed(role.IsSuperAdmin);
			})
			.catch((error) => {
				// Handle the error here
			});
	});

	const fetchUserAction = useCallback(() => {
		makeGetReq(`v1/check-action?id=${adminID}&action=RewardUpdater`)
			.then((action) => {
				if (!isEditAllowed) setIsEditAllowed(action.isActionAllowed);
			})
			.catch((error) => {
				// Handle the error here
			});
	});

	const fetchAllFiatTxn = useCallback(async () => {
		const { data, total } = await makeGetReq(
			`v1/fiat/query-fiat-transaction?type=INR_WITHDRAWAL&size=${paginationModal.pageSize}&start=${
				paginationModal.page * paginationModal.pageSize
			}&status=PROCESSING`
		);
		const rows = data.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			withdrawAmount: Math.abs(traxn.amount),
			phone: traxn.userPhone,
			withdrawStatus: traxn.fiatTransactionStatus,
			bankAccNo: traxn.userBankAccount,
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			FiatTxnID: traxn.txnID,
			RefID: traxn.txnRefID !== '' ? traxn.txnRefID : '--',
			redactedRefID: redactString(traxn.txnRefID),
			UserID: traxn.userID,
			TraxnType: traxn.fiatTransactionType,
			ifsc: traxn?.IFSC,
		}));

		setFiatTraxns(rows);
		setTotalRows(total);
	}, [paginationModal.page, paginationModal.pageSize]);

	const fetchAllFiatTxnMobile = useCallback(async () => {
		const { data, total, pageID, nextPageID } = await makeGetReq(
			`v1/fiat/query-fiat-transaction?type=INR_WITHDRAWAL&size=${mobilePaginationModal.pageSize}&start=${
				mobilePaginationModal.page * mobilePaginationModal.pageSize
			}&status=PROCESSING`
		);
		const rows = data?.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			withdrawAmount: Math.abs(traxn.amount),
			withdrawStatus: traxn.fiatTransactionStatus,
			bankAccNo: traxn.userBankAccount,
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			FiatTxnID: traxn.txnID,
			RefID: traxn.txnRefID !== '' ? traxn.txnRefID : '--',
			redactedRefID: redactString(traxn.txnRefID),
			UserID: traxn.userID,
			TraxnType: traxn.fiatTransactionType,
		}));
		setFiatTraxnsMobile(rows);
		setTotalData(total);
		setPageID(pageID);
		setNextPageID(nextPageID);
	}, [mobilePaginationModal.page, mobilePaginationModal.pageSize]);

	const fetchAllLogs = useCallback(async () => {
		const { data, total } = await makeGetReq(
			`v1/admin-logs?actionType=FIAT&size=${depositPaginationModal.pageSize}&pageNo=${depositPaginationModal.page + 1}`
		);
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
		setDepositRows(rows);
		setTotalDepositLogRows(total);
	}, [depositPaginationModal.page, depositPaginationModal.pageSize]);

	const fetchAllLogsMobile = useCallback(async () => {
		const { data, total, pageNo, nextPageNo } = await makeGetReq(
			`v1/admin-logs?actionType=FIAT&size=${mobileLogPaginationModal.pageSize}&pageNo=${
				mobileLogPaginationModal.page + 1
			}`
		);
		const rows = data?.map((log) => ({
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

	const getFiatTraxnByIdMobile = useCallback(async () => {
		if (!fiatTraxnUserID) return;
		const { data, total, pageID, nextPageID } = await makeGetReq(
			`v1/fiat/query-fiat-transaction?userID=${fiatTraxnUserID}&type=INR_WITHDRAWAL&size=${
				mobileFiatTraxnByIdModal.pageSize
			}&start=${mobileFiatTraxnByIdModal.page * mobileFiatTraxnByIdModal.pageSize}`
		);
		const rows = data.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			withdrawlAmount: Math.abs(traxn.amount),
			withdrawlStatus: traxn.fiatTransactionStatus,
			RefID: traxn.txnRefID !== '' ? traxn.txnRefID : '--',
		}));
		setTraxnHistoryAccordionRows(rows);
		setTotalTraxnHistory(total);
		setTraxnHistoryID(pageID);
		setTraxnHistoryNextPageID(nextPageID);
	}, [mobileFiatTraxnByIdModal.page, mobileFiatTraxnByIdModal.pageSize, fiatTraxnUserID]);

	const getFiatTraxnById = async (userId) => {
		if (!userId) return;
		const { data } = await makeGetReq(`v1/fiat/query-fiat-transaction?userID=${userId}&type=INR_WITHDRAWAL`);
		const rows = data.map((traxn) => ({
			id: traxn.id,
			userName: traxn.userFirstName && traxn.userLastName ? traxn.userFirstName + ' ' + traxn.userLastName : '---',
			email: traxn.userEmail,
			date: new Date(traxn.createdAt).toLocaleDateString(),
			time: new Date(traxn.createdAt).toLocaleTimeString(),
			withdrawlAmount: Math.abs(traxn.amount),
			RefID: traxn.txnRefID ? traxn.txnRefID : '--',
			withdrawlStatus: traxn?.fiatTransactionStatus,
		}));
		setFiatTraxnHistoryRows(rows);
	};

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
			setTxnRefId('');
			setMessage(`Transaction completed with an action ${action}`);
			await fetchAllFiatTxn();
			await fetchAllFiatTxnMobile();
		} catch (err) {
			toggleMessageModal();
			toggleRemarkModal();
			setRemark('');
			setTxnRefId('');
			setMessage('Request failed. Check Ref. ID');

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

	useEffect(() => {
		fetchUserRole();
		fetchUserAction();
	}, [fetchUserRole]);

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
		<Box sx={{ backgroundColor: '#EFF6FF', padding: '10px' }}>
			<Box display="flex">
				<Box width="100%" display="flex" justifyContent="center">
					<Typography textAlign="center" variant="h2">
						Withdraw Records
					</Typography>
				</Box>
				<Box sx={{ position: 'absolute', right: '10px', marginTop: '10px' }}>
					<Button onClick={toggleQueryCsvModal} variant="contained">
						Download withdraw records
					</Button>
				</Box>
			</Box>

			<Box display="flex">
				<Box mt={1} width="100%" display="flex" justifyContent="center">
					<Paper
						elevation={0}
						sx={{
							display: 'flex',
							border: (theme) => `1px solid ${theme.palette.divider}`,
							flexWrap: 'wrap',
							width: 'fit-content',
							marginBottom: '10px',
						}}
					>
						<StyledToggleButtonGroup color="info" size="small" value={template} exclusive onChange={handleAlignment}>
							<ToggleButton value="">
								<Typography variant="h4">Default</Typography>
							</ToggleButton>
							<ToggleButton value="failed">
								<Typography variant="h4">Equitas</Typography>
							</ToggleButton>
							<ToggleButton value="in_progress">
								<Typography variant="h4">IDFC</Typography>
							</ToggleButton>
						</StyledToggleButtonGroup>
					</Paper>
				</Box>
			</Box>

			{isMobile ? (
				<>
					<Box sx={{ height: '400px', width: '100%' }}>
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
							rows={fiatTraxns}
							columns={isEditAllowed ? withdrawColumns : filteredWithdrawColumns}
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
						<Typography variant="h2">Withdraw Logs</Typography>
					</Box>
					<Box display="flex" justifyContent="center">
						<Box sx={{ height: '400px', width: '100%' }}>
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
									<Typography variant="h4">Withdraw Amount: {traxn.withdrawAmount}</Typography>
									<Typography variant="h4">Withdraw Status: {traxn.withdrawStatus}</Typography>
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
								height: '400px',
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
											<Typography variant="h4">Amount: {traxn.withdrawlAmount}</Typography>
											<Typography variant="h4">Status: {traxn.withdrawlStatus}</Typography>
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
					setTxnRefId('');
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
					setTxnRefId('');
					toggleRemarkModal();
				}}
			>
				<Box sx={remarkModalStyles}>
					<Box display="flex" flexDirection="column">
						<TextField required label="Enter remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
						<TextField
							sx={{ mt: 2 }}
							required
							label="Enter traxn Ref ID"
							value={txnRefId}
							onChange={(e) => setTxnRefId(e.target.value)}
						/>
						<Button
							disabled={selectedRefNo !== txnRefId}
							variant="contained"
							sx={{ mt: 2 }}
							onClick={async () => {
								await processTraxn(
									deposit.UserID,
									deposit.action,
									txnRefId,
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

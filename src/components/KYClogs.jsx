/* eslint-disable  */

import React, { useCallback, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { makeGetReq } from '../utils/axiosHelper';
import { styled } from '@mui/material/styles';
import {
	Button,
	useMediaQuery,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Typography,
	IconButton,
} from '@mui/material';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ShowButton = styled(Button)(({ theme }) => ({
	backgroundColor: 'lightblue',
	borderRadius: '4px',
	border: '1px solid blue',
}));

const KYClogs = () => {
	const isMobile = useMediaQuery('(min-width:768px)');
	const session = useSessionContext();
	const navigate = useNavigate();
	const kycLogsColumns = [
		{
			field: 'createdOn',
			headerClassName: 'kyc-column-header',
			headerName: 'Created On',
			valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY'),
			width: 150,
		},
		{
			field: 'firstName',
			headerClassName: 'kyc-column-header',
			headerName: 'First name',
			width: 150,
		},
		{
			field: 'lastName',
			headerClassName: 'kyc-column-header',
			headerName: 'Last name',
			width: 150,
		},
		{
			field: 'email',
			headerClassName: 'kyc-column-header',
			headerName: 'Email',
			width: 200,
		},
		{
			field: 'phone',
			headerClassName: 'kyc-column-header',
			headerName: 'Phone',
			width: 150,
		},
		{
			field: 'kycStatus',
			headerClassName: 'kyc-column-header',
			headerName: 'Kyc Status',
			width: 150,
		},
		// {
		// 	field: 'view',
		// 	headerClassName: 'kyc-column-header',
		// 	headerName: 'Show KYC Data',
		// 	width: 150,
		// 	renderCell: (params) => {
		// 		return (
		// 			<>
		// 				<ShowButton
		// 					onClick={() => {
		// 						// console.log("params.id", params.id);
		// 						navigate(`/kycData/${params.id}`, {
		// 							state: {
		// 								email: params?.row?.email,
		// 								phone: params?.row?.phone,
		// 							},
		// 						});
		// 					}}
		// 				>
		// 					View
		// 				</ShowButton>
		// 			</>
		// 		);
		// 	},
		// },
		{
			field: 'admin',
			headerClassName: 'kyc-column-header',
			headerName: 'Admin',
			width: 150,
		},
		{
			field: 'remarks',
			headerClassName: 'kyc-column-header',
			headerName: 'Remarks',
			width: 150,
		},
	];
	const [paginationModal, setPaginationModal] = useState({
		page: 0,
		pageSize: 5,
	});

	const [totalRows, setTotalRows] = useState(0);
	const [logs, setLogs] = useState([]);

	//Accordion logs
	const [mobilePaginationModal, setMobilePaginationModal] = useState({
		page: 0,
		pageSize: 10,
	});
	const [totalLogRows, setTotalLogRows] = useState(null);
	const [mobileLogs, setMobileLogs] = useState([]);
	const [logPageID, setLogPageID] = useState(null);
	const [logNextPageID, setLogNextPageID] = useState(null);

	const { page, pageSize } = paginationModal;
	const fetchLogs = useCallback(async () => {
		// console.log(session);
		if (!session.userId) return;
		const response = await makeGetReq(
			`/v1/admin-logs?actionType=KYC&pageNo=${page + 1}&size=${pageSize}&adminID=${session.userId}`
		);
		// setLogs(response.data);
		const logsRows = response?.data?.map((log) => {
			console.log("date", log?.createdAt , new Date(log?.createdAt)?.toLocaleString());
			return ({id: log?.logID,
			createdOn: new Date(log?.createdAt),
			kycStatus: log?.action?.log?.Status,
			admin: log?.adminName,
			email: log?.email,
			phone: log?.phone,
			firstName: log?.userFirstName ? logs?.userFirstName : '--',
			lastName: log?.userLastName ? logs?.userLasttName : '--',
			remarks: log?.action?.log?.Remark?.at(0).length > 0 ? log?.action?.log?.Remark?.at(0) : '--',})
		});
		setLogs(logsRows);
		setTotalRows(response?.total);
	}, [page, pageSize, session.userId]);

	const fetchMobileLogs = useCallback(async () => {
		if (!session.userId) return;
		const response = await makeGetReq(
			`v1/admin-logs?actionType=KYC&pageNo=${mobilePaginationModal.page + 1}&size=${
				mobilePaginationModal.pageSize
			}&adminID=${session.userId}`
		);
		const logsRows = response?.data?.map((log) => ({
			id: log?.logID,
			createdOn: new Date(log.createdAt)?.toLocaleString(),
			kycStatus: log?.action?.log?.Status,
			admin: log?.adminName,
			email: log?.email,
			phone: log?.phone,
			firstName: log?.userFirstName ? logs?.userFirstName : '--',
			lastName: log?.userLastName ? logs?.userLasttName : '--',
			remarks: log?.action?.log?.Remark?.at(0).length > 0 ? log?.action?.log?.Remark?.at(0) : '--',
		}));
		setMobileLogs(logsRows);
		setTotalLogRows(response?.total);
		setLogPageID(response?.pageNo);
		setLogNextPageID(response?.nextPageNo);
	}, [mobilePaginationModal.page, mobilePaginationModal.pageSize, session.userId]);

	useEffect(() => {
		fetchLogs();
	}, [fetchLogs]);

	useEffect(() => {
		fetchMobileLogs();
	}, [fetchMobileLogs]);

	return (
		<>
			{isMobile ? (
				<DataGrid
					columns={kycLogsColumns}
					rows={[...logs]}
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
						height: "400px",
					}}
					rowCount={totalRows}
					paginationMode="server"
					paginationModel={paginationModal}
					onPaginationModelChange={(event) => {
						setPaginationModal({ page: event.page, pageSize: event.pageSize });
					}}
				/>
			) : (
				<>
					<Box>
						{mobileLogs?.map((log) => (
							<Accordion sx={{ border: '1px solid black' }} key={log.id}>
								<AccordionSummary>
									<Typography variant="h4">{log.admin}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography variant="h4">Created On: {log.createdOn}</Typography>
									<Typography variant="h4">First Name: {log.firstName}</Typography>
									<Typography variant="h4">Last Name: {log.lastName}</Typography>
									<Typography variant="h4">Email: {log.email}</Typography>
									<Typography variant="h4">Phone: {log.phone}</Typography>
									<Typography variant="h4">KYC Status: {log.kycStatus}</Typography>
									<Typography variant="h4">Admin: {log.admin}</Typography>
									<Typography variant="h4">Remarks: {log.remarks}</Typography>
									<Box mt={1}>
										<Button
											onClick={() => {
												navigate(`/kycData/${log.id}`, {
													state: {
														email: log?.email,
														phone: log?.phone,
													},
												});
											}}
											variant="contained"
											fullWidth
										>
											show KYC Data
										</Button>
									</Box>
								</AccordionDetails>
							</Accordion>
						))}
					</Box>
					<Box display="flex" justifyContent="center">
						<Box display="flex">
							<IconButton
								onClick={() => {
									if (logPageID > 1)
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
									if (logNextPageID !== -1)
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
				</>
			)}
		</>
	);
};

export default KYClogs;

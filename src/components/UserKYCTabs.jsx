/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Typography, Button, Tabs, Tab, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import { makeGetReq } from '../utils/axiosHelper';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function BasicTabs() {
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const { userID } = useParams();
	const [userKycData, setUserKycData] = useState({});
	const [isAadharSelfieOpen, setIsAadharSelfieOpen] = useState(false);
	const handleAadharSelfieDialog = () => setIsAadharSelfieOpen(!isAadharSelfieOpen);
	const [isSelfieOpen, setIsSelfieOpen] = useState(false);
	const handleSelfieDialog = () => setIsSelfieOpen(!isSelfieOpen);
	const isNotMobile = useMediaQuery('(min-width:768px)');

	useEffect(() => {
		makeGetReq(`v1/users/${userID}/kyc?userID=${userID}`).then(({ data }) => {
			setUserKycData(data);
		});
	}, []);

	const getFieldData = (data) => {
		if (data) {
			return data;
		}
		return '--';
	};

	const getStepStatus = (item) => {
		let val = userKycData?.steps && userKycData?.steps[item]?.status;
		if (!val) return <></>;
		switch (val) {
			case 'SUCCESS':
				return (
					<Box sx={{ backgroundColor: '#2E7D32' }}>
						<Typography sx={{ color: '#fff', fontWeight: '500', fontSize: '28px' }}>APPROVED</Typography>
					</Box>
				);
			case 'FAILED':
				return (
					<Box sx={{ backgroundColor: '#d32f2f' }}>
						<Typography sx={{ color: '#d32f2f', fontWeight: '500', fontSize: '28px' }}>FAILED</Typography>
					</Box>
				);
			default:
				return (
					<Box sx={{ backgroundColor: '#fff44f' }}>
						<Typography sx={{ color: '#fff44f', fontWeight: '500', fontSize: '28px' }}>PENDING</Typography>
					</Box>
				);
		}
	};

	return (
		<Box width={isNotMobile ? '60%' : '100%'}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Aadhar Details" {...a11yProps(0)} />
					<Tab label="PAN Details" {...a11yProps(1)} />
					<Tab label="Selfie Details" {...a11yProps(2)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0} width="80%">
				<Card>
					<Box sx={{ textAlign: 'center' }}>{userKycData && getStepStatus('PROOF_OF_ADDRESS')}</Box>
					<CardContent>
						<Box display="flex" justifyContent="space-around" alignItems="center">
							<Box sx={{ maxWidth: '60%', backgroundColor: '#fff', padding: '3vw', height: '80%' }}>
								<Box padding={1}>
									<Typography>Name</Typography>
									<Typography variant="h4">{getFieldData(userKycData?.documentDetail?.POAData?.name)}</Typography>
								</Box>
								<Box padding={1}>
									<Typography>Gender</Typography>
									<Typography variant="h4">
										{userKycData?.documentDetail?.POAData?.gender
											? userKycData?.documentDetail?.POAData?.gender === 'M'
												? 'Male'
												: 'Female'
											: '--'}
									</Typography>
								</Box>
								<Box padding={1}>
									<Typography>Date of Birth</Typography>
									<Typography variant="h4">{getFieldData(userKycData?.documentDetail?.POAData?.DOB)}</Typography>
								</Box>
								<Box padding={1}>
									<Typography>Aadhar Number</Typography>
									<Typography variant="h4">{getFieldData(userKycData?.documentDetail?.POAData?.IDNumber)}</Typography>
								</Box>
								<Box padding={1}>
									<Typography>Address</Typography>
									<Typography variant="h4">
										{userKycData?.documentDetail?.POAData?.address
											? userKycData?.documentDetail?.POAData?.address?.house +
											  ', ' +
											  userKycData?.documentDetail?.POAData?.address?.landmark +
											  ', ' +
											  userKycData?.documentDetail?.POAData?.address?.landmark
											: '--'}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
								{userKycData?.documentDetail?.POAData?.documentImageURL && (
									<img
										width="100%"
										className="small"
										src={userKycData?.documentDetail?.POAData?.documentImageURL}
										alt="aadhar selfie"
									/>
								)}

								<Button
									onClick={handleAadharSelfieDialog}
									color="info"
									variant="contained"
									size="small"
									sx={{ padding: '10px 0px', marginTop: '10px' }}
								>
									<Typography variant="h5">Click to enlarge image</Typography>
								</Button>
							</Box>

							{isAadharSelfieOpen && userKycData?.documentDetail?.POAData?.documentImageURL && (
								<dialog
									className="dialog"
									style={{ position: 'absolute', zIndex: 1000 }}
									open
									onClick={handleAadharSelfieDialog}
								>
									<img
										className="image"
										src={userKycData?.documentDetail?.POAData?.documentImageURL}
										alt="aadhar dialog selfie"
										onClick={handleAadharSelfieDialog}
									/>
								</dialog>
							)}
						</Box>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={value} index={1}>
				<Card>
					<Box sx={{ textAlign: 'center' }}>{userKycData && getStepStatus('PROOF_OF_IDENTITY')}</Box>
					<CardContent>
						<Box display="flex" justifyContent="center" marginBottom={2}>
							<Typography variant="h3">PAN Details</Typography>
						</Box>
						<Box display="flex" justifyContent="center" alignItems="center">
							<Box>
								<Box display="flex" gap={1}>
									<Typography color="grey" variant="h5">
										Name:
									</Typography>
									<Typography variant="h5">{getFieldData(userKycData?.documentDetail?.POIData?.nameOnCard)}</Typography>
								</Box>
								<Box display="flex" gap={1}>
									<Typography color="grey" variant="h5">
										Pan No.:
									</Typography>
									<Typography variant="h5">{getFieldData(userKycData?.documentDetail?.POIData?.IDNumber)}</Typography>
								</Box>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value={value} index={2}>
				<Card>
					<Box sx={{ textAlign: 'center' }}>{userKycData && getStepStatus('FACE_MATCH')}</Box>
					<CardContent>
						<Box display="flex" justifyContent="space-around" alignItems="center">
							<Box sx={{ maxWidth: '60%', backgroundColor: '#fff', padding: '3vw', height: '80%' }}>
								<Box padding={1}>
									<Typography>Selfie Match:</Typography>
									<Typography variant="h4">
										{getFieldData(userKycData?.documentDetail?.FaceMatchData?.matchPercentWithPOAImage)}
									</Typography>
								</Box>
							</Box>

							<Box sx={{ width: '40%', display: 'flex', flexDirection: 'column' }}>
								{userKycData?.documentDetail?.FaceCaptureData?.documentImageURL && (
									<img
										width="100%"
										className="small"
										src={userKycData?.documentDetail?.FaceCaptureData?.documentImageURL}
										alt="aadhar selfie"
									/>
								)}

								<Button
									onClick={handleAadharSelfieDialog}
									color="info"
									variant="contained"
									size="small"
									sx={{ padding: '10px 0px', marginTop: '10px' }}
								>
									<Typography variant="h5">Click to enlarge image</Typography>
								</Button>
							</Box>

							{isSelfieOpen && userKycData?.documentDetail?.FaceCaptureData?.documentImageURL && (
								<dialog
									className="dialog"
									style={{ position: 'absolute', zIndex: 1000 }}
									open
									onClick={handleSelfieDialog}
								>
									<img
										className="image"
										src={userKycData?.documentDetail?.FaceCaptureData?.documentImageURL}
										alt="aadhar dialog selfie"
										onClick={handleSelfieDialog}
									/>
								</dialog>
							)}
						</Box>
					</CardContent>
				</Card>
			</TabPanel>
		</Box>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	value: PropTypes.value,
	index: PropTypes.number,
};

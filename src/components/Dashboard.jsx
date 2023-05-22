import { Card, Box, CardContent, useMediaQuery, TextField, Modal, Button } from '@mui/material';
// import { logoutApp } from "../services/Supertokens/SuperTokensHelper";
// import axiosInstance, { makeGetReq } from "../utils/axiosHelper";
import React, { useEffect, useState } from 'react';
// import useSWR from "swr";
import { shades } from '../utils/theme';
// import axios from "axios";
import { BrowserView } from 'react-device-detect';
import { makeGetReq, makePostReq } from '../utils/axiosHelper';
import InfoModal from './InfoModal';
import DashboardCards from './DashboardCards';
import { getCurrentUserInfo } from '../redux/currentUser/currentUser.slice';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { useDispatch } from 'react-redux';

const changeAppVerModalStyles = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 4,
};

export default function Dashboard() {
	const isMobile = useMediaQuery('(min-width:768px)');
	const [appVersion, setAppVersion] = useState('');
	const [osType, setOsType] = useState('');
	const [changeAppVerModal, setChangeAppVerModal] = useState(false);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const toggleInfoModal = () => setShowInfoModal(!showInfoModal);
	const toggleChangeAppVerModal = () => setChangeAppVerModal(!changeAppVerModal);
	const [showAppVersion, setShowAppVersion] = useState('');
	const [showInfoMessage, setShowInfoMessage] = useState('');
	// const [appVer, setAppVer] = useState();

	const dispatch = useDispatch();

	const { userId: adminID } = useSessionContext();

	const getAppVer = async () => {
		const data = await makeGetReq('v1/mobile/version?osType=ANDROID');
		setShowAppVersion(data?.version);
	};

	const changeAppVersion = async () => {
		makePostReq('v1/mobile/version', {
			osType,
			version: appVersion,
		})
			.then((res) => {
				setShowInfoMessage(res.data.message);
				toggleInfoModal();
				toggleChangeAppVerModal();
				getAppVer();
			})
			.catch((err) => {
				setShowInfoMessage(err.response.data.ErrorMessage);
				toggleInfoModal();
				toggleChangeAppVerModal();
			});
	};

	const getCurrentUser = async () => {
		const currentUser = await makeGetReq(`/v1/admin/${adminID}`);
		console.log('ladsfjakl', currentUser);
		dispatch(getCurrentUserInfo(currentUser));
	};

	useEffect(() => {
		getAppVer();
		getCurrentUser();
	}, []);

	return (
		<Box sx={{ backgroundColor: '#EFF6FF', padding: '20px' }}>
			<BrowserView>
				<Box>
					<Box display="flex" justifyContent="flex-end">
						<Button variant="contained" onClick={toggleChangeAppVerModal}>
							Change App Version
						</Button>
					</Box>

					<Box
						display="flex"
						flexDirection={isMobile ? 'row' : 'column'}
						justifyContent={isMobile ? 'center' : 'space-around'}
						alignItems="center"
					>
						<DashboardCards title="App Version" content={showAppVersion} backgroundColor="#D1E9FC" />
						{/* <DashboardCards title="Total Sign Up Users" content="197" backgroundColor="#FFF7CD" />
						<DashboardCards title="Total Success KYC" content="85" backgroundColor="#FFE7D9" />
						<DashboardCards title="Total Pending KYC" content="46" backgroundColor="#FFF7CD" /> */}
					</Box>
					<Box
						display="flex"
						flexDirection={isMobile ? 'row' : 'column'}
						justifyContent="space-around"
						alignItems="center"
					>
						{/* <DashboardCards title="Total Failed KYC" content="46" backgroundColor="#D1E9FC" />
						<DashboardCards title="Total Deposit Request" content="46" backgroundColor="#FFE7D9" />
						<DashboardCards title="Total Withdraw Request" content="46" backgroundColor="#D1E9FC" /> */}
					</Box>
				</Box>
			</BrowserView>

			<Modal open={changeAppVerModal} onClose={toggleChangeAppVerModal}>
				<Box sx={changeAppVerModalStyles}>
					<TextField
						fullWidth
						label="Enter app version"
						value={appVersion}
						onChange={(e) => setAppVersion(e.target.value)}
					/>
					<TextField
						sx={{ mt: 1 }}
						fullWidth
						label="Enter os type"
						value={osType}
						onChange={(e) => setOsType(e.target.value)}
					/>
					<Box mt={1} display="flex" justifyContent="flex-end">
						<Button onClick={changeAppVersion} variant="contained">
							Change
						</Button>
					</Box>
				</Box>
			</Modal>

			<InfoModal modal={showInfoModal} toggleModal={toggleInfoModal} message={showInfoMessage} />
		</Box>
	);
}

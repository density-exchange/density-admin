/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	FormControl,
	Modal,
	TextField,
	RadioGroup,
	FormLabel,
	FormControlLabel,
	Radio,
	Typography,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { makeDeleteReq, makeGetReq, makePatchReq, makePostReq } from '../utils/axiosHelper';
import { addAllAdmins } from '../redux/allAdmins/allAdmins.slice';
import ConfirmationModal from './ConfirmationModal';
import InfoModal from './InfoModal';

const RoleTile = styled(Typography)(({ theme }) => ({
	textAlign: 'center',
	color: theme.palette.success.dark,
	fontWeight: 800,
}));

const RevokeButtonRoleTile = styled(Box)(({ theme }) => ({
	textAlign: 'center',
	backgroundColor: 'lightgreen',
}));

const EditButton = styled(Button)(({ theme }) => ({
	borderRadius: '4px',
	color: '#fff',
	backgroundColor: theme.palette.info.main,
	'&:hover': {
		backgroundColor: theme.palette.info.dark,
	},
}));

const DeleteButton = styled(Button)(({ theme }) => ({
	borderRadius: '4px',
	color: '#fff',
	backgroundColor: theme.palette.error.main,
	'&:hover': {
		backgroundColor: theme.palette.error.dark,
	},
}));

const Roles = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: '5px',
	flexWrap: 'wrap',
}));

const addAdminModalStyles = {
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
const confirmModalStyles = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 300,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	borderRadius: '5px',
	boxShadow: 24,
	p: 4,
};

const RevokeRoleButton = styled(Box)(({ theme }) => ({
	textAlign: 'center',
	border: '1px solid green',
	backgroundColor: 'lightgreen',
	borderRadius: '4px',
}));

export default function AdminUsersTable() {
	const isMobile = useMediaQuery('(min-width:768px)');
	const dispatch = useDispatch();
	const admins = useSelector((state) => state.admins.admins);
	const [selectedRoleForRevoke, setSelectedRoleForRevoke] = useState([]);
	const [selectedAdminId, setSelectedAdminId] = useState('');
	const [createPermission, setCreatePermission] = useState('');
	const [permissionsToRole, setPermissionsToRole] = useState([]);
	const [rolesToAdmin, setRolesToAdmin] = useState([]);
	const [createdPermissions, setCreatedPermissions] = useState([]);
	const [createdRoles, setCreatedRoles] = useState([]);
	const [adminrole, setAdminRole] = useState('');
	const [infoMessage, setInfoMessage] = useState('');
	const [selectedAdmin, setSelectedAdmin] = useState({});
	const [adminName, setAdminName] = useState('');
	const [adminEmail, setAdminEmail] = useState('');
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);
	const [addRoleModal, setAddRoleModal] = useState(false);
	const [addAdminModal, setAddAdminModal] = useState(false);
	const [addPermissionModal, setAddPermissionModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [assignRoleModal, setAssignRoleModal] = useState(false);
	const [infoModal, setInfoModal] = useState(false);
	const [editRoleModal, setEditRoleModal] = useState(false);
	const toggleAddAdminModal = () => setAddAdminModal(!addAdminModal);
	const toggleConfirmModal = () => setConfirmModal(!confirmModal);
	const toggleAddPermissionModal = () => setAddPermissionModal(!addPermissionModal);
	const toggleAddRoleModal = () => setAddRoleModal(!addRoleModal);
	const toggleInfoModal = () => setInfoModal(!infoModal);
	const toggleAssignRoleModal = () => setAssignRoleModal(!assignRoleModal);
	const toggleEditRoleModal = () => setEditRoleModal(!editRoleModal);

	const currentUser = useSelector((state) => state.currentUser.currentUserInfo);
	console.log('alsdfjl', currentUser.IsSuperAdmin);

	const SuperAdminColumns = [
		{
			field: 'name',
			headerName: 'Name',
			width: 150,
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 300,
		},
		{
			field: 'superAdmin',
			headerName: 'SuperAdmin',
			width: 100,
		},
		{
			field: 'role',
			headerName: 'Roles',
			width: 200,
			renderCell: (params) => {
				return (
					<>
						<Roles>
							{params.value.map((role, idx) => (
								<RoleTile key={idx}>{role.Role}</RoleTile>
							))}
						</Roles>
					</>
				);
			},
		},
		{
			field: 'addRole',
			headerName: 'Assign Role',
			width: 200,
			renderCell: (params) => {
				return (
					<EditButton
						onClick={() => {
							toggleAssignRoleModal();
							setSelectedAdminId(params.row.id);
						}}
					>
						Assign Role
					</EditButton>
				);
			},
		},
		{
			field: 'editAdmin',
			headerName: 'Edit',
			width: 200,
			renderCell: (params) => {
				return (
					<>
						<EditButton
							onClick={() => {
								setSelectedAdmin(params.row);
								toggleEditRoleModal();
							}}
						>
							edit
						</EditButton>
					</>
				);
			},
		},
		{
			field: 'deleteAdmin',
			headerName: 'Delete',
			width: 100,
			renderCell: (params) => {
				return (
					<>
						<DeleteButton
							onClick={async () => {
								await deleteAdmin(params.row.id);
								window.location.reload();
							}}
						>
							delete
						</DeleteButton>
					</>
				);
			},
		},
	];

	const adminColumns = [
		{
			field: 'name',
			headerName: 'Name',
			width: 150,
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 300,
		},
		{
			field: 'superAdmin',
			headerName: 'SuperAdmin',
			width: 100,
		},
		{
			field: 'role',
			headerName: 'Roles',
			width: 200,
			renderCell: (params) => {
				return (
					<>
						<Roles>
							{params.value.map((role, idx) => (
								<RoleTile key={idx}>{role.Role}</RoleTile>
							))}
						</Roles>
					</>
				);
			},
		},
	];

	const createAnAdmin = async (adminName, adminEmail, isSuperAdmin) => {
		const admin = await makePostReq('v1/admin', {
			name: adminName,
			email: adminEmail,
			willSuperAdmin: Boolean(isSuperAdmin),
		});
	};

	const deleteAdmin = async (adminID) => {
		const res = await makeDeleteReq(`v1/admin/${adminID}`);
	};

	const getAllAdmins = async () => {
		const admins = await makeGetReq('v1/admins');
		dispatch(addAllAdmins(admins));
	};

	const getRolesPermissions = async (roleId) => {
		const data = await makeGetReq(`v1/role/${roleId}`);
		return data;
	};

	const getPermissions = async () => {
		const data = await makeGetReq('v1/permissions');
		setCreatedPermissions(data);
	};

	const getRoles = async () => {
		const data = await makeGetReq('v1/roles');
		setCreatedRoles(data);
	};

	const assignRole = async (adminId, roles) => {
		const data = await makePatchReq('v1/role/assign', {
			adminID: adminId,
			roles,
		});
		// console.log(data);
	};

	const makePermissionPostReq = async () => {
		makePostReq('v1/permission', {
			permission: createPermission,
		})
			.then((res) => {
				setInfoMessage(`${res.data.Permission} permission created`);
				getPermissions();
				toggleInfoModal();
			})
			.catch((err) => {
				setInfoMessage(err.response.data.ErrorMessage);
				toggleInfoModal();
			});
	};

	const revokeRole = async (adminID, roles) => {
		const data = await makePatchReq('v1/role/revoke', {
			adminID,
			roles,
		});
	};

	const adminRows = admins.map((admin) => ({
		id: admin.ID,
		name: admin.Name,
		email: admin.Email,
		superAdmin: admin.IsSuperAdmin,
		role: admin.Roles,
	}));
	const getStyles = (paramID, containerArray) =>  {
		console.log("role Id", paramID);
		const isSelected = containerArray.indexOf(paramID) === -1;
		if(isSelected) return {};
		return {
			fontWeight: "500",
			backgroundColor: "#0288D1",
			color: "#fff"
		};
	}
	console.log("permissions", permissionsToRole);
	useEffect(() => {
		getAllAdmins();
		// getRolesPermissions();
		getRoles();
		getPermissions();
	}, []);

	const addRole = async () => {
		makePostReq('v1/role', {
			permissions: permissionsToRole,
			role: adminrole,
		})
			.then((res) => {
				setInfoMessage(`${res.data.Role} role created`);
				getRoles();
				toggleInfoModal();
			})
			.catch((err) => {
				setInfoMessage(err.response.data.ErrorMessage);
				toggleInfoModal();
			});
	};

	return (
		<Box sx={{ backgroundColor: '#EFF6FF' }}>
			<Box sx={{ padding: '10px' }}>
				<Box display="flex" justifyContent="center" gap={8} mb={1}>
					<Button onClick={toggleAddAdminModal} variant="contained">
						Create an admin
					</Button>
					{/* <Button onClick={toggleAddPermissionModal} variant="contained">
						Create a permission
					</Button> */}
					<Button variant="contained" onClick={toggleAddRoleModal}>
						Create a role
					</Button>
				</Box>
				{isMobile ? (
					<Box height={650}>
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
							rows={adminRows}
							columns={currentUser.IsSuperAdmin ? SuperAdminColumns : adminColumns}
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
						/>
					</Box>
				) : (
					<>
						{adminRows?.map((admin) => (
							<Accordion sx={{ border: '1px solid black' }} key={admin.id}>
								<AccordionSummary>
									<Typography variant="h4">{admin.name}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Typography variant="h4">Name: {admin.name}</Typography>
									<Typography variant="h4">Email: {admin.email}</Typography>
									<Typography variant="h4">SuperAdmin: {admin.superAdmin ? 'Yes' : 'No'}</Typography>
									<Box mt={1}>
										<Typography variant="h4">Roles:</Typography>
										<Roles>
											{admin.role.map((r, idx) => (
												<RoleTile key={idx}>{r.Role}</RoleTile>
											))}
										</Roles>
									</Box>
									<Box mt={1}>
										<Typography variant="h4">Edit</Typography>
										<Box display="flex" gap="2%">
											<EditButton
												onClick={() => {
													toggleAssignRoleModal();
													setSelectedAdminId(admin.id);
												}}
											>
												Assign Role
											</EditButton>
											<EditButton
												onClick={() => {
													setSelectedAdmin(admin);
													toggleEditRoleModal();
												}}
											>
												Revoke Role
											</EditButton>
											<DeleteButton
												onClick={async () => {
													await deleteAdmin(admin.id);
													window.location.reload();
												}}
											>
												delete
											</DeleteButton>
										</Box>
									</Box>
								</AccordionDetails>
							</Accordion>
						))}
					</>
				)}
			</Box>

			{/* Modals */}
			<Modal open={addAdminModal} onClose={toggleAddAdminModal}>
				<Box sx={addAdminModalStyles}>
					<Box display="flex" flexDirection="column">
						<FormControl>
							<TextField
								sx={{ mb: 1 }}
								label="Enter name"
								value={adminName}
								onChange={(e) => setAdminName(e.target.value)}
							/>
							<TextField
								sx={{ mb: 1 }}
								label="Enter email"
								value={adminEmail}
								onChange={(e) => setAdminEmail(e.target.value)}
							/>
							<FormLabel id="superadmin-radio-buttons">
								<Typography variant="h4">Is SuperAdmin</Typography>
							</FormLabel>
							<RadioGroup
								aria-labelledby="superadmin-radio-buttons"
								value={isSuperAdmin}
								onChange={(e) => setIsSuperAdmin(e.target.value)}
							>
								<FormControlLabel value={true} control={<Radio />} label="Yes" />
								<FormControlLabel value={false} control={<Radio />} label="No" />
							</RadioGroup>
						</FormControl>
						<Box display="flex" justifyContent="flex-end">
							<Button
								variant="contained"
								onClick={() => {
									createAnAdmin(adminName, adminEmail, isSuperAdmin)
										.then((res) => {
											toggleAddAdminModal();
											getAllAdmins();
										})
										.catch((err) => {
											setInfoMessage(err.response.data.ErrorMessage);
											toggleInfoModal();
										});
								}}
							>
								Add
							</Button>
						</Box>
					</Box>
				</Box>
			</Modal>

			<ConfirmationModal modal={confirmModal} toggleModal={toggleConfirmModal} callback={() => {}} />

			<InfoModal modal={infoModal} toggleModal={toggleInfoModal} message={infoMessage} />

			<Modal onClose={toggleAddPermissionModal} open={addPermissionModal}>
				<Box sx={addAdminModalStyles}>
					<Box mb={1}>
						<FormControl fullWidth>
							<InputLabel>Permission</InputLabel>
							<Select
								value={createPermission}
								label="Permission"
								onChange={(e) => {
									setCreatePermission(e.target.value);
								}}
							>
								<MenuItem value="SymbolUpdater">SymbolUpdater</MenuItem>
								<MenuItem value="KycUpdater">KycUpdater</MenuItem>
								<MenuItem value="FiatUpdater">FiatUpdater</MenuItem>
								<MenuItem value="UserUpdater">UserUpdater</MenuItem>
								<MenuItem value="KycViewer">KycViewer</MenuItem>
								<MenuItem value="BankUpdater">BankUpdater</MenuItem>
								<MenuItem value="BankViewer">BankViewer</MenuItem>
								<MenuItem value="AccountUpdater">AccountUpdater</MenuItem>
								<MenuItem value="AccountViewer">AccountViewer</MenuItem>
								<MenuItem value="OrderViewer">OrderViewer</MenuItem>
								<MenuItem value="UserActionUpdater">UserActionUpdater</MenuItem>
								<MenuItem value="UserActionViewer">UserActionViewer</MenuItem>
								<MenuItem value="AdminLogViewer">AdminLogViewer</MenuItem>
								<MenuItem value="RewardUpdater">RewardUpdater</MenuItem>
								<MenuItem value="AppVersionUpdater">AppVersionUpdater</MenuItem>
								<MenuItem value="FiatViewer">FiatViewer</MenuItem>

							</Select>
						</FormControl>
					</Box>
					<Box display="flex" justifyContent="flex-end">
						<Button onClick={makePermissionPostReq} variant="contained">
							Add permission
						</Button>
					</Box>
				</Box>
			</Modal>

			<Modal open={addRoleModal} onClose={toggleAddRoleModal}>
				<Box sx={addAdminModalStyles}>
					<Box display="flex" gap="1rem">
						<Box mb={1}>
							<TextField label="Role" value={adminrole} onChange={(e) => setAdminRole(e.target.value)} />
						</Box>
						<Box width="50%">
							<FormControl fullWidth>
								<InputLabel>Permissions</InputLabel>
								<Select multiple value={permissionsToRole} onChange={(e) => setPermissionsToRole(e.target.value)}>
									{createdPermissions?.map((perm) => (
										<MenuItem key={perm.ID} value={perm.ID} style={getStyles(perm.ID, permissionsToRole)}>
											{perm.Permission}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Box>
					<Box display="flex" justifyContent="flex-end">
						<Button
							onClick={() => {
								addRole();
								toggleAddRoleModal();
								setAdminRole('');
								setPermissionsToRole([]);
							}}
							variant="contained"
						>
							Add Role
						</Button>
					</Box>
				</Box>
			</Modal>

			<Modal open={assignRoleModal} onClose={toggleAssignRoleModal}>
				<Box sx={addAdminModalStyles}>
					<Box mb={1}>
						<FormControl fullWidth>
							<InputLabel>Roles</InputLabel>
							<Select multiple value={rolesToAdmin} onChange={(e) => setRolesToAdmin(e.target.value)}>
								{createdRoles?.map((role) => (
									<MenuItem key={role.ID} value={role.ID} style={getStyles(role.ID, rolesToAdmin)} >
										{role.Role}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box display="flex" justifyContent="flex-end">
						<Button
							onClick={async () => {
								await assignRole(selectedAdminId, rolesToAdmin);
								await getAllAdmins();
								toggleAssignRoleModal();
								setRolesToAdmin([]);
							}}
							variant="contained"
						>
							Assign
						</Button>
					</Box>
				</Box>
			</Modal>

			<Modal
				open={editRoleModal}
				onClose={() => {
					toggleEditRoleModal();
					setSelectedRoleForRevoke([]);
				}}
			>
				<Box sx={addAdminModalStyles}>
					<Roles>
						{selectedAdmin.role?.map((r, idx) => (
							<RevokeRoleButton
								sx={
									selectedRoleForRevoke.find((roleId) => roleId === r.ID)
										? { border: '2px solid red', backgroundColor: 'red' }
										: {}
								}
								key={idx}
								display="flex"
								alignItems="center"
							>
								<RevokeButtonRoleTile>{r.Role}</RevokeButtonRoleTile>
								<IconButton
									size="small"
									sx={{
										backgroundColor: 'lightgreen',
										borderRadius: '4px',
									}}
									onClick={() =>
										setSelectedRoleForRevoke((prevRoles) => {
											let role = prevRoles.find((roleId) => roleId === r.ID);
											if (!role) {
												return [...prevRoles, r.ID];
											} else {
												return prevRoles.filter((roleId) => roleId !== role);
											}
										})
									}
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							</RevokeRoleButton>
						))}
					</Roles>
					<Box mt={2} display="flex" justifyContent="flex-end">
						<Button
							onClick={async () => {
								toggleEditRoleModal();
								await revokeRole(selectedAdmin.id, selectedRoleForRevoke);
								await getAllAdmins();
							}}
							variant="contained"
						>
							Revoke Roles
						</Button>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
}

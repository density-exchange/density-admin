import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CustomModal from './CustomModal';
import { makeGetReq, makePatchReq } from '../../utils/axiosHelper';

const ConfirmationRemarkModal = ({ isOpen, close, primaryAction, secondaryAction }) => {
	const [rolesToAdmin, setRolesToAdmin] = useState([]);
	const [createdRoles, setCreatedRoles] = useState([]);
	const [createdPermissions, setCreatedPermissions] = useState([]);

	const [existingPermissions, setExistingPermissions] = useState([]);
	const [currentSelectedPerms, setCurrentSelectedPerms] = useState([]);
	const [addedPermissions, setAddedPermissions] = useState([]);
	const [deletedPermissions, setDeletedPermissions] = useState([]);

	const getRoles = async () => {
		const data = await makeGetReq('v1/roles');
		setCreatedRoles(data);
	};

	const getPermissions = async () => {
		const data = await makeGetReq('v1/permissions');
		setCreatedPermissions(data);
	};

	const getPermissionsToRole = async (roleID) => {
		const data = await makeGetReq(`v1/role/${roleID}`);
		setExistingPermissions(data.Permissions.map((permission) => permission.ID));
		setCurrentSelectedPerms(data.Permissions.map((permission) => permission.ID));
	};

	// const addPermissions = async() => {

	// }

	const getStyles = (paramID, containerArray) => {
		const isSelected = containerArray.indexOf(paramID) === -1;
		if (isSelected) return {};
		return {
			fontWeight: '500',
			backgroundColor: '#0288D1',
			color: '#fff',
		};
	};

	const handlePermissionsChange = () => {
		console.log('permissions', existingPermissions);
		console.log('newPermissions', currentSelectedPerms);
		currentSelectedPerms.map((permission) => {
			if (!existingPermissions.includes(permission)) {
				setAddedPermissions([...addedPermissions, permission]);
			}
		});

		existingPermissions.map((permission) => {
			if (!currentSelectedPerms.includes(permission)) {
				setDeletedPermissions([...deletedPermissions, permission]);
			}
		});
	};

	console.log('added', addedPermissions);
	console.log('deleted', deletedPermissions);

	useEffect(() => {
		getRoles();
		getPermissions();
	}, []);

	return (
		<>
			<CustomModal
				isOpen={isOpen}
				close={close}
				isClose={true}
				isPrimaryAction={true}
				primaryName={'Yes'}
				primaryAction={handlePermissionsChange}
				secondaryName={'No'}
				isSecondaryAction={true}
				secondaryAction={close}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: { xs: 'center', sm: 'center' },
						gap: '20px',
						my: '10px',
						p: { xs: '0px 10px', sm: '5px 20px' },
					}}
				>
					<FormControl fullWidth>
						<InputLabel>Roles</InputLabel>
						<Select
							value={rolesToAdmin}
							onChange={(e) => {
								setRolesToAdmin(e.target.value);
								getPermissionsToRole(e.target.value);
							}}
						>
							{createdRoles?.map((role) => (
								<MenuItem key={role.ID} value={role.ID} style={getStyles(role.ID, rolesToAdmin)}>
									{role.Role}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel>Permissions</InputLabel>
						<Select multiple value={currentSelectedPerms} onChange={(e) => setCurrentSelectedPerms(e.target.value)}>
							{createdPermissions?.map((perm) => (
								<MenuItem key={perm.ID} value={perm.ID} style={getStyles(perm.ID, currentSelectedPerms)}>
									{perm.Permission}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</CustomModal>
		</>
	);
};

ConfirmationRemarkModal.propTypes = {
	isOpen: PropTypes.bool,
	close: PropTypes.func,
	primaryAction: PropTypes.func,
	secondaryAction: PropTypes.func,
};
export default ConfirmationRemarkModal;

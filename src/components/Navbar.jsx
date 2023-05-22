import React, { useCallback, useEffect } from 'react';
import { AppBar, Box, Toolbar, IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { logoutApp } from '../services/Supertokens/SuperTokensHelper';
import { useDispatch } from 'react-redux';
import { toggleDrawer } from '../redux/layout/menu';
import { getCurrentUserInfo } from '../redux/currentUser/currentUser.slice';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { makeGetReq } from '../utils/axiosHelper';

export default function Navbar() {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const dispatch = useDispatch();

	const { userId: adminID } = useSessionContext();

	// console.log('lasdfljs', adminID);

	const getCurrentUser = useCallback(async () => {
		if(!adminID) return;
		const currentUser = await makeGetReq(`/v1/admin/${adminID}`);
		console.log('ladsfjakl', currentUser);
		dispatch(getCurrentUserInfo(currentUser));
	},[adminID]);

	useEffect(() => {
		getCurrentUser();
	}, [getCurrentUser]);

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static" sx={{ backgroundColor: '#4d7cc9' }}>
					<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							sx={{ mr: 2 }}
							onClick={() => dispatch(toggleDrawer())}
						>
							<MenuIcon />
						</IconButton>

						{/* <Button
              color="secondary"
              variant="contained"
              onClick={() => logoutApp()}
            >
              Logout
            </Button> */}
						<Tooltip title="Admin settings">
							<IconButton
								onClick={handleClick}
								size="small"
								sx={{ ml: 2 }}
								aria-controls={open ? 'account-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={open ? 'true' : undefined}
							>
								<Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
							</IconButton>
						</Tooltip>
						<Menu
							anchorEl={anchorEl}
							id="account-menu"
							open={open}
							onClose={handleClose}
							onClick={handleClose}
							PaperProps={{
								elevation: 0,
								sx: {
									overflow: 'visible',
									filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
									mt: 1.5,
									'& .MuiAvatar-root': {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									'&:before': {
										// eslint-disable-next-line quotes
										content: '""',
										display: 'block',
										position: 'absolute',
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: 'background.paper',
										transform: 'translateY(-50%) rotate(45deg)',
										zIndex: 0,
									},
								},
							}}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							<MenuItem
								onClick={() => {
									handleClose();
									logoutApp();
								}}
							>
								<ListItemIcon>
									<Logout fontSize="small" />
								</ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
			</Box>

			<Outlet />
		</>
	);
}

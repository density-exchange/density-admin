import React from 'react';
import { Box, Button } from '@mui/material';
import { redirectToAuth } from 'supertokens-auth-react';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';

export default function SignUp() {
	const session = useSessionContext();
	const onLogin = async () => {
		redirectToAuth();
	};
	return (
		<>
			<Box display="flex" justifyContent="center">
				<h1>Density Admin</h1>
			</Box>
			<Box height="100vh" display="flex" justifyContent="center" alignItems="center">
				<Box width="50%">
					<Button fullWidth onClick={onLogin} variant="contained">
						Get In
					</Button>
				</Box>
			</Box>
		</>
	);
}

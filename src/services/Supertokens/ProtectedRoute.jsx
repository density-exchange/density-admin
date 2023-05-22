/* eslint-disable react/prop-types */
import React from 'react';
import { SessionAuth, useSessionContext } from 'supertokens-auth-react/recipe/session';
// import { useNavigate } from "react-router-dom";

function ProtectedRoute(props) {
	const session = useSessionContext();
	return (
		<SessionAuth requireAuth={props.requireAuth === undefined ? true : props.requireAuth} key={props.key}></SessionAuth>
	);
}

export default ProtectedRoute;

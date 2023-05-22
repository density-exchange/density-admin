/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	admins: [],
	adminPermissions: [],
	currentAdminId: '',
};

const admins = createSlice({
	name: 'admins',
	initialState,
	reducers: {
		addAllAdmins(state, action) {
			state.admins = action.payload;
		},
		addAdminPermissions(state, action) {
			const adminExists = state.adminPermissions.find((admin) => admin.adminId === action.payload.adminId);
			if (!adminExists) {
				state.adminPermissions.push(action.payload);
			}
		},
		addAdminId(state, action) {
			state.currentAdminId = action.payload;
		},
	},
});

export const { addAllAdmins, addAdminPermissions, addAdminId } = admins.actions;
export default admins.reducer;

import { setItem } from '@/helpers/storage';
import { AuthState } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AuthState = {
	isLoading: false,
	loggedIn: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: state => {
			state.isLoading = true;
		},
		loginSuccess: (state, action) => {
			state.isLoading = false;
			state.loggedIn = true;
			setItem('token', action.payload.token);
		},
		loginFailure: state => {
			state.isLoading = false;
		},
	},
});

export const { login, loginSuccess, loginFailure } = authSlice.actions;
export default authSlice.reducer;

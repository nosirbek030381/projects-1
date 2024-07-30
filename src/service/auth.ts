import axios from './api';

interface IUser {
	username: string;
	password: string;
}

const AuthService = {
	async userLogin(values: IUser) {
		const { data } = await axios.post('/auth/login', {
			username: values.username,
			password: values.password,
		});
		return data;
	},
};

export default AuthService;

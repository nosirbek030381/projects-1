import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login';

const App = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			navigate('/login');
		} else {
			navigate('/dashboard');
		}
	}, [navigate]);

	return (
		<>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/dashboard' element={<Dashboard />} />
			</Routes>
		</>
	);
};

export default App;

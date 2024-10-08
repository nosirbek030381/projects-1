import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { Toaster } from './components/ui/toaster';
import './index.css';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Router>
			<Provider store={store}>
				<App />
				<Toaster />
			</Provider>
		</Router>
	</React.StrictMode>
);

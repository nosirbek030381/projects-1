export const setItem = (key: string, data: string) => {
	try {
		localStorage.setItem(key, data);
	} catch (error) {
		console.log('error user no found');
	}
};

export const getItem = (key: string) => {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.log('error user no found');
	}
};

export const removeItem = (key: string) => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.log('error user no found');
	}
};

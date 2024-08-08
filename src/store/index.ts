import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../slice/auth.slice';
import PostsReducer from '../slice/post.slice';
import ProductsReducer from '../slice/products.slice';

const store = configureStore({
	reducer: {
		auth: AuthReducer,
		posts: PostsReducer,
		products: ProductsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../slice/auth.slice';
import PostsReducer from '../slice/post.slice';

const store = configureStore({
	reducer: {
		auth: AuthReducer,
		posts: PostsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

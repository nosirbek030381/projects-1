// src/slice/post.slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}

export interface PostsState {
	posts: Post[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: PostsState = {
	posts: [],
	status: 'idle',
	error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const response = await axios.get('https://dummyjson.com/posts');
	return response.data.posts;
});

export const addPost = createAsyncThunk('posts/addPost', async (newPost: Omit<Post, 'id'>) => {
	const response = await axios.post('https://dummyjson.com/posts/add', newPost);
	return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async (post: Post) => {
	const response = await axios.put(`https://dummyjson.com/posts/${post.id}`, post);
	return response.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
	await axios.delete(`https://dummyjson.com/posts/${id}`);
	return id;
});

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchPosts.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
				state.status = 'succeeded';
				state.posts = action.payload;
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch posts';
			})
			.addCase(addPost.fulfilled, (state, action: PayloadAction<Post>) => {
				state.posts.push(action.payload);
			})
			.addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
				const index = state.posts.findIndex(post => post.id === action.payload.id);
				if (index !== -1) {
					state.posts[index] = action.payload;
				}
			})
			.addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
				state.posts = state.posts.filter(post => post.id !== action.payload);
			});
	},
});

export default postsSlice.reducer;

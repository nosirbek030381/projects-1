import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	category: string;
	thumbnail: string;
}

export interface ProductsState {
	products: Product[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: ProductsState = {
	products: [],
	status: 'idle',
	error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
	const response = await axios.get('https://dummyjson.com/products');
	return response.data.products;
});

export const addProduct = createAsyncThunk(
	'products/addProduct',
	async (newProduct: Omit<Product, 'id'>) => {
		const response = await axios.post('https://dummyjson.com/products/add', newProduct);
		return response.data;
	}
);

export const updateProduct = createAsyncThunk(
	'products/updateProduct',
	async (product: Product, { rejectWithValue }) => {
		try {
			const response = await axios.putForm(`https://dummyjson.com/products/${product.id}`, product);
			return response.data;
		} catch (error) {
			console.error('Error updating product:', error);
			return rejectWithValue('Failed to update product');
		}
	}
);

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number) => {
	await axios.delete(`https://dummyjson.com/products/${id}`);
	return id;
});

const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchProducts.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
				state.status = 'succeeded';
				state.products = action.payload;
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Failed to fetch products';
			})
			.addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				state.products.push(action.payload);
			})
			.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
				const index = state.products.findIndex(product => product.id === action.payload.id);
				if (index !== -1) {
					state.products[index] = action.payload;
				}
			})
			.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
				state.products = state.products.filter(product => product.id !== action.payload);
			});
	},
});

export default productsSlice.reducer;

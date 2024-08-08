import { toast } from '@/components/ui/use-toast';
import {
	addProduct,
	deleteProduct,
	fetchProducts,
	Product,
	updateProduct,
} from '@/slice/products.slice';
import { AppDispatch, RootState } from '@/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProductsComponent = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { products, status, error } = useSelector((state: RootState) => state.products);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			navigate('/login');
		}
	}, [navigate]);

	const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
		title: '',
		description: '',
		price: 0,
		category: '',
		thumbnail: '',
	});

	const [editingProduct, setEditingProduct] = useState<Product | null>(null);

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const handleAddProduct = () => {
		if (newProduct.title && newProduct.description) {
			dispatch(addProduct(newProduct))
				.unwrap()
				.then(() => {
					setNewProduct({
						title: '',
						description: '',
						price: 0,
						category: '',
						thumbnail: '',
					});
				})
				.catch(error => {
					console.error('Failed to add product:', error);
				});
		} else {
			alert('Title and description are required.');
		}
	};

	const handleUpdateProduct = () => {
		if (editingProduct) {
			dispatch(updateProduct(editingProduct))
				.unwrap()
				.then(() => {
					toast({ description: "Post o'zgartirildi." });
					setEditingProduct(null);
				})
				.catch(error => {
					toast({ description: "Post o'zgartirilishidagi xatolik.", color: 'red' });
					console.error('Failed to update the post: ', error);
				});
		}
	};

	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'failed') return <p className='error-message'>Error: {error}</p>;

	return (
		<div className='container'>
			<h2>Add New Product</h2>
			<input
				type='text'
				value={newProduct.title}
				onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
				placeholder='Title'
			/>
			<input
				type='text'
				value={newProduct.description}
				onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
				placeholder='Description'
			/>
			<input
				type='text'
				value={newProduct.thumbnail}
				onChange={e => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
				placeholder='Image URL'
			/>
			<input
				type='number'
				value={newProduct.price}
				onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
				placeholder='Price'
			/>
			<input
				type='text'
				value={newProduct.category}
				onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
				placeholder='Category'
			/>
			{/* Add other fields for the product as necessary */}
			<button onClick={handleAddProduct}>Add Product</button>

			{editingProduct && (
				<div>
					<h2>Edit Product</h2>
					<input
						type='text'
						value={editingProduct.title}
						onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
						placeholder='Title'
					/>
					<input
						type='text'
						value={editingProduct.description}
						onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
						placeholder='Description'
					/>
					<input
						type='text'
						value={editingProduct.thumbnail}
						onChange={e => setNewProduct({ ...editingProduct, thumbnail: e.target.value })}
						placeholder='Image URL'
					/>
					<input
						type='number'
						value={editingProduct.price}
						onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
						placeholder='Price'
					/>
					<input
						type='text'
						value={editingProduct.category}
						onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
						placeholder='Category'
					/>
					<button onClick={handleUpdateProduct}>Update Product</button>
				</div>
			)}

			<h2>Products List</h2>
			{products.map(product => (
				<div key={product.id} className='product'>
					<h3>{product.title}</h3>
					<img src={product.thumbnail} alt={product.title} />
					<p>{product.category}</p>
					<p>{product.description}</p>
					<button onClick={() => setEditingProduct(product)}>Edit</button>
					<button className='delete-button' onClick={() => dispatch(deleteProduct(product.id))}>
						Delete
					</button>
				</div>
			))}
		</div>
	);
};

export default ProductsComponent;

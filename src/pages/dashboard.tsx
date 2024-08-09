import { toast } from '@/components/ui/use-toast';
import {
	addProduct,
	deleteProduct,
	fetchProducts,
	Product,
	updateProduct,
} from '@/slice/products.slice';
import { AppDispatch, RootState } from '@/store';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
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

	const handleEditProductChange = (field: keyof Product, value: string | number) => {
		if (editingProduct) {
			setEditingProduct({
				...editingProduct,
				[field]: value,
			});
		}
	};

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
					toast({ description: "Post qo'shildi." });
				})
				.catch(error => {
					toast({ description: "Post qo'shishda xatolik." });
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

	const categoryData = products.reduce(
		(acc, product) => {
			const categoryIndex = acc.labels.indexOf(product.category);
			if (categoryIndex >= 0) {
				acc.datasets[0].data[categoryIndex]++;
			} else {
				acc.labels.push(product.category);
				acc.datasets[0].data.push(1);
			}
			return acc;
		},
		{
			labels: [] as string[],
			datasets: [{ data: [] as number[], backgroundColor: [] as string[], hoverOffset: 4 }],
		}
	);

	categoryData.datasets[0].backgroundColor = categoryData.labels.map(
		() =>
			`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
				Math.random() * 255
			)}, 0.6)`
	);

	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'failed') return <p className='error-message'>Error: {error}</p>;

	return (
		<div className='flex mx-auto justify-evenly max-w-6xl'>
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
							onChange={e => handleEditProductChange('price', Number(e.target.value))}
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
						<div className='flex justify-between items-center mt-2 mb-2'>
							<p>{product.category}</p>
							<p>
								{product.price.toLocaleString('en-US', {
									style: 'currency',
									currency: 'USD',
								})}
							</p>
						</div>
						<p>{product.description}</p>
						<button onClick={() => setEditingProduct(product)}>Edit</button>
						<button className='delete-button' onClick={() => dispatch(deleteProduct(product.id))}>
							Delete
						</button>
					</div>
				))}
			</div>

			<div>
				<h2 className='font-semibold'>Category Distribution</h2>
				<Pie data={categoryData} />
			</div>
		</div>
	);
};

export default ProductsComponent;

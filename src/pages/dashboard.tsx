import { useToast } from '@/components/ui/use-toast';
import { addPost, deletePost, fetchPosts, Post, updatePost } from '@/slice/post.slice';
import { AppDispatch, RootState } from '@/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { posts, status, error } = useSelector((state: RootState) => state.posts);
	const [newPost, setNewPost] = useState<{ title: string; body: string; userId: number }>({
		title: '',
		body: '',
		userId: 4,
	});
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const { toast } = useToast();

	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (token) {
			navigate('/dashboard');
		}
	}, [navigate]);

	useEffect(() => {
		dispatch(fetchPosts());
	}, [dispatch]);

	const handleAddPost = () => {
		if (newPost.title && newPost.body) {
			dispatch(addPost(newPost))
				.unwrap()
				.then(addedPost => {
					console.log('Post added successfully:', addedPost);
					setNewPost({ title: '', body: '', userId: 1 });
					toast({
						description: "Yangi post qo'shildi.",
					});
				})
				.catch(error => {
					console.error('Failed to save the post: ', error);
					toast({
						description: "Yangi post qo'shishda xatolik.",
					});
				});
		} else {
			alert('Title and body are required.');
		}
	};

	const handleUpdatePost = () => {
		if (editingPost) {
			dispatch(updatePost(editingPost))
				.unwrap()
				.then(() => {
					toast({ description: "Post o'zgartirildi." });
					setEditingPost(null);
				})
				.catch(error => {
					toast({ description: "Post o'zgartirilishidagi xatolik.", color: 'red' });
					console.error('Failed to update the post: ', error);
				});
		}
	};

	const handleDeletePost = (id: number) => {
		dispatch(deletePost(id))
			.unwrap()
			.then(() => {
				toast({ description: "Post o'chirildi." });
			})
			.catch(error => {
				toast({ description: "Post o'chirildi." }), error;
			});
	};

	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'failed') return <p>Error: {error}</p>;

	return (
		<div className='p-4 flex flex-col justify-center items-center max-w-6xl mx-auto'>
			<h1 className='text-xl font-bold mb-4'>Posts Dashboard</h1>
			<div className='mb-4'>
				<h2 className='text-lg font-semibold'>Add New Post</h2>
				<div className='flex flex-col items-center'>
					<input
						type='text'
						value={newPost.title}
						onChange={e => setNewPost({ ...newPost, title: e.target.value })}
						placeholder='Title'
						className='border p-2 mb-2 w-full'
					/>
					<textarea
						value={newPost.body}
						onChange={e => setNewPost({ ...newPost, body: e.target.value })}
						placeholder='Body'
						className='border p-2 mb-2 w-full'
					/>
				</div>
				<button onClick={handleAddPost} className='bg-blue-500 text-white p-2 rounded'>
					Add Post
				</button>
			</div>
			{editingPost && (
				<div className='mb-4'>
					<h2 className='text-lg font-semibold'>Edit Post</h2>
					<input
						type='text'
						value={editingPost.title}
						onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
						placeholder='Title'
						className='border p-2 mb-2'
					/>
					<textarea
						value={editingPost.body}
						onChange={e => setEditingPost({ ...editingPost, body: e.target.value })}
						placeholder='Body'
						className='border p-2 mb-2 w-full'
					/>
					<button onClick={handleUpdatePost} className='bg-yellow-500 text-white p-2 rounded'>
						Update Post
					</button>
				</div>
			)}
			<ul>
				{posts.map(post => (
					<li key={post.id} className='border p-2 mb-2'>
						<h3 className='text-lg font-semibold'>{post.title}</h3>
						<p>{post.body}</p>
						<button
							onClick={() => setEditingPost(post)}
							className='bg-green-500 text-white p-1 rounded mr-2'
						>
							Edit
						</button>
						<button
							onClick={() => handleDeletePost(post.id)}
							className='bg-red-500 text-white p-1 rounded'
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Dashboard;

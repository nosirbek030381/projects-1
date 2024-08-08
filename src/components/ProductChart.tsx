import { fetchPosts } from '@/slice/post.slice';
import { AppDispatch, RootState } from '@/store';
import { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';

const ProductChart = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { posts, status } = useSelector((state: RootState) => state.posts);

	useEffect(() => {
		dispatch(fetchPosts());
	}, [dispatch]);

	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'failed') return <p>Failed to load data</p>;

	return <Doughnut data={chartData} />;
};

export default ProductChart;

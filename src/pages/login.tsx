import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AuthService from '@/service/auth';
import { loginFailure, loginSuccess } from '@/slice/auth.slice';
import { RootState } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const Login = () => {
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state: RootState) => state.auth);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (token) {
			navigate('/dashboard');
		}
	}, [navigate]);

	const formSchema = z.object({
		username: z
			.string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' })
			.min(2, {
				message: 'Username must be at least 2 characters.',
			}),
		password: z.string().min(6, {
			message: 'Password must be at least 6 characters.',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await AuthService.userLogin(values);

			dispatch(loginSuccess(response));

			navigate('/dashboard');
		} catch (error) {
			dispatch(loginFailure());
		}
	}

	return (
		<div className='flex justify-center flex-col items-center h-[90vh]'>
			<h1 className='text-4xl mb-2 font-bold'>Login</h1>
			<Form {...form}>
				<form className='space-y-3 w-80' onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder='Username' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type='password' placeholder='••••••••' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type='submit' disabled={isLoading}>
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default Login;

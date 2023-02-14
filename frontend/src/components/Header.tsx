import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoSignOut } from 'react-icons/go';
import { RiSettings5Fill } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { axiosInstance } from 'axios.config';
import { toast } from 'react-toastify';
import { userNameState } from 'globalState/recoilState';
import { useRecoilValue } from 'recoil';

function Header() {
	const router = useRouter();
	const userName = useRecoilValue(userNameState);

	async function signout() {
		try {
			const response = await axiosInstance.post('user/logout');
			if (response.status == 200) router.push('/login');
		} catch (error: any) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error(error);
			}
		}
	}

	return (
		<header className="container py-5 flex justify-between items-center">
			<Link href="/">
				<Image src="/logo.png" alt="Logo" width={60} height={60} />
			</Link>
			<nav>
				<ul className="flex gap-3">
					<li>{userName}</li>
					<li className="cursor-pointer">
						<Link href="/settings">
							<RiSettings5Fill size={25} title="Settings" />
						</Link>
					</li>
					<li className="cursor-pointer">
						<GoSignOut size={25} title="Signout" onClick={signout} />
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;

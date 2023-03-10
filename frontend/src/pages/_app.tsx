import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SWRConfig } from 'swr';
import { axiosInstance } from 'axios.config';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig
			value={{
				fetcher: (url: string) =>
					axiosInstance(url).then((response) => response),
			}}
		>
			<RecoilRoot>
				<Head>
					<title>Expenses</title>
					<meta name="description" content="Generated by create next app" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Component {...pageProps} />
				<ToastContainer position="bottom-right" />
			</RecoilRoot>
		</SWRConfig>
	);
}

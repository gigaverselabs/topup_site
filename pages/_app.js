// add bootstrap css 

import { ProvideState } from '../utils/state';
import { ProvideAuth } from '../utils/auth';

import '../styles/globals.css'
import { CssBaseline } from '@mui/material';
import Header from '../components/Header/Header';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { green, purple } from '@mui/material/colors';


const themeOptions = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#47BE68',
		},
		success: {
			main: '#47be68',
		},
		background: {
			default: 'rgb(28, 27, 31)',
			paper: '#201f23',
		},
		secondary: {
			main: '#00601a',
		},
		info: {
			main: '#05dbe7',
		},
		appbar: {
			main: '#121214',
		}
	}
});

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>Top Up Site - Gigaverse</title>
      <link rel="shortcut icon" href="/favicon.png" />
    </Head>
			<ThemeProvider theme={themeOptions}>
    <ProvideAuth>
      <ProvideState>
          <CssBaseline />
          <Header />
          <Toaster />

          <Component {...pageProps} />
      </ProvideState>
    </ProvideAuth>
			</ThemeProvider>
  </>
}

export default MyApp

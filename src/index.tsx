import './utils/i18n';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/styles';
import { StyledEngineProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { getLocalTheme, setLocalTheme } from '@/utils/helper';
import { ColorModeContext } from '@/utils/context';
import Layout from '@/common/Layout';
import Loading from '@/common/Loading';
import './index.css';
import store from './rootStore';
import AppRouter from './router';

const MainLayout = (props: any) => {
  return (
    <Layout>
      <Helmet>
        <title>
          {props.title || 'Starcoin Explorer'}
        </title>
      </Helmet>
      <Suspense fallback={<Loading />}>
        {props.children}
      </Suspense>
    </Layout>
  );
};

MainLayout.prototype = {
  children: PropTypes.element.isRequired,
};

function App() {

  const localTheme = getLocalTheme();
  const [mode, setMode] = React.useState<'light' | 'dark'>(localTheme && localTheme === 'light' ? 'light' : 'dark');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const mode = prevMode === 'light' ? 'dark' : 'light';
          setLocalTheme(mode);
          return mode;
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },

      }),
    [mode],
  );
  if (mode === 'dark') {
    theme.palette.background.default = '#212121';
  }

  return <HelmetProvider> <ColorModeContext.Provider value={colorMode}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <MainLayout>
              <AppRouter />
            </MainLayout>
          </BrowserRouter>
        </Provider>
      </ThemeProvider> </StyledEngineProvider>
  </ColorModeContext.Provider> </HelmetProvider>;
}


const container = document.getElementById('root');
// @ts-ignore
const root = createRoot(container);
root.render(<App />);


/* eslint-disable no-undef */
import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import GlobalStyles from '~/styles/global';
import { GraphProvider } from '~/context/GraphContext';
import { SnackbarProvider } from '~/context/SnackContext';
import { ApiProvider } from '~/context/ApiContext';
import Routes from './routes';

function App() {
  // useEffect(() => {
  //   api.receive('appMetrics', (data) => {
  //     console.log('appMetrics', data);
  //   });
  //   api.receive('node', (data) => {
  //     console.log('node', data);
  //   });
  //   api.receive('mem', (data) => {
  //     console.log('mem', data);
  //   });
  //   api.receive('cpu', (data) => {
  //     console.log('cpu', data);
  //   });
  //   api.receive('total-mem', (data) => {
  //     console.log('total-mem', data);
  //   });
  // }, []);
  return (
    <ApiProvider>
      <GraphProvider>
        <SnackbarProvider>
          <HashRouter>
            <Routes />
          </HashRouter>
          <GlobalStyles />
        </SnackbarProvider>
      </GraphProvider>
    </ApiProvider>
  );
}

export default App;

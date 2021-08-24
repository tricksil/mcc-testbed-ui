import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyles from '~/styles/global';
import { GraphProvider } from '~/context/GraphContext';
import { SnackbarProvider } from '~/context/SnackContext';
import { ApiProvider } from '~/context/ApiContext';
import Routes from './routes';

function App() {
  return (
    <ApiProvider>
      <GraphProvider>
        <SnackbarProvider>
          <Router>
            <Routes />
          </Router>
          <GlobalStyles />
        </SnackbarProvider>
      </GraphProvider>
    </ApiProvider>
  );
}

export default App;

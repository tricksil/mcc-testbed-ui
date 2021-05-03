import { BrowserRouter as Router } from 'react-router-dom';
import ResponsiveDrawer from '~/page/ResponsiveDrawer';
import GlobalStyles from '~/styles/global';
import { GraphProvider } from '~/context/GraphContext';
import { SnackbarProvider } from '~/context/SnackContext';

import history from '~/services/history';
import Routes from './routes';

function App() {
  return (
    <GraphProvider>
      <SnackbarProvider>
        {/* <ResponsiveDrawer /> */}
        {/* <Home /> */}
        <Router>
          <Routes />
        </Router>
        <GlobalStyles />
      </SnackbarProvider>
    </GraphProvider>
  );
}

export default App;

import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import { Container, Content, Button } from './styles';
import logo from '~/assets/cloud.svg';
import execute from '~/assets/execute.svg';
import stop from '~/assets/stop.svg';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';
import api from '~/services/api';

function HeaderNetwork() {
  const {
    graph,
    convertionalScenery,
    isExecute,
    setExecute,
    setGraph,
  } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const [isLoading, setLoading] = useState(false);

  async function handleExecScenery() {
    setLoading((x) => !x);
    if (graph?.nodes.length === 0) {
      snackBarOpen('Scenary not be void!', 'error');
      setLoading((x) => !x);
      return;
    }
    const sceneryTestbed = convertionalScenery(graph);
    try {
      snackBarOpen('Loading Scenery', 'info');
      const { data } = await api.post('create', sceneryTestbed);
      if (data.code === 400) {
        snackBarOpen(data.message, 'error');
      } else {
        snackBarOpen(data.message, 'success');
        setExecute(true);
      }
      setLoading((x) => !x);
    } catch (error) {
      snackBarOpen('Erro', 'error');
      setLoading((x) => !x);
    }
  }
  async function handleStopScenery() {
    setLoading((x) => !x);
    snackBarOpen('Loading Stop Scenery', 'info');
    if (graph?.nodes.length === 0) {
      snackBarOpen('Scenery not be void!', 'error');
      setLoading((x) => !x);
      return;
    }
    try {
      const { data } = await api.get('stop');
      snackBarOpen(data.message, 'success');
      setExecute(false);
      setLoading((x) => !x);
    } catch (error) {
      snackBarOpen('Erro', 'error');
      setLoading((x) => !x);
    }
  }

  return (
    <Container>
      <Content>
        <nav>
          <Link to="/" onClick={() => setGraph({ nodes: [], edges: [] })}>
            <img src={logo} alt="MCC Network" />
          </Link>
        </nav>

        <aside>
          <Button
            type="button"
            onClick={() =>
              isExecute ? handleStopScenery() : handleExecScenery()
            }
            disabled={isLoading}
          >
            <img
              src={isExecute ? stop : execute}
              alt={isExecute ? 'Stop' : 'Execute'}
            />
            {isExecute ? 'Stop' : 'Execute'}
          </Button>
        </aside>
      </Content>
    </Container>
  );
}

export default HeaderNetwork;

import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import axios from 'axios';
import { Container, Content, Button, Action, ActionContent } from './styles';
import logo from '~/assets/cloud.svg';
import execute from '~/assets/execute.svg';
import stop from '~/assets/stop.svg';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';
import { ApiContext } from '~/context/ApiContext';

function HeaderNetwork() {
  const {
    graph,
    convertionalScenery,
    isExecute,
    setExecute,
    setGraph,
  } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
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
      console.log(sceneryTestbed);
      const { data } = await axios.post(
        `http://${ip}:5000/create`,
        sceneryTestbed
      );
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
    try {
      const { data } = await axios.get(`http://${ip}:5000/stop`);
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
            <ActionContent>
              <Action loading={isLoading ? 1 : 0} execute={isExecute} />
              <img
                src={isExecute ? stop : execute}
                alt={isExecute ? 'Stop' : 'Execute'}
              />
            </ActionContent>

            {isExecute ? 'Stop' : 'Execute'}
          </Button>
        </aside>
      </Content>
    </Container>
  );
}

export default HeaderNetwork;

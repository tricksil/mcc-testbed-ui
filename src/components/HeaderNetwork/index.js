/* eslint-disable no-empty-function */
import { Link } from 'react-router-dom';
import { useContext, useState, useRef } from 'react';

import axios from 'axios';
import {
  Container,
  Content,
  Button,
  Action,
  ActionContent,
  IconContent,
} from './styles';
import logo from '~/assets/logo.svg';
import execute from '~/assets/execute.svg';
import stop from '~/assets/stop.svg';
import save from '~/assets/save.svg';
import app from '~/assets/android.svg';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';
import { ApiContext } from '~/context/ApiContext';
import ScenarioConfigModal from '../ScenarioConfigModal';
import AppAreaModal from '../AppAreaModal';

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
  const scenarioConfigRef = useRef();
  const appAreaRef = useRef();

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
  async function handleSaveScenario() {
    scenarioConfigRef.current?.open();
  }
  async function handleAppArea() {
    appAreaRef.current?.open();
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
          {!isExecute && (
            <Button type="button" onClick={handleSaveScenario}>
              <IconContent>
                <img src={save} alt="Save" />
              </IconContent>
              Save
            </Button>
          )}
          {isExecute && (
            <Button type="button" onClick={handleAppArea}>
              <IconContent>
                <img src={app} alt="Save" />
              </IconContent>
              App Area
            </Button>
          )}
        </aside>
      </Content>
      <ScenarioConfigModal ref={scenarioConfigRef} />
      <AppAreaModal ref={appAreaRef} />
    </Container>
  );
}

export default HeaderNetwork;

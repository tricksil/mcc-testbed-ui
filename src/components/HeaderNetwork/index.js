/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
import { Link } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';

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
import { execStatus } from '~/services/execApp';

function HeaderNetwork() {
  const {
    graph,
    convertionalScenery,
    isExecute,
    setExecute,
    setGraph,
    execApkStatus,
    isDisableBecauseExecApp,
    setExecApkStatus,
    onChangeName,
    cleanGraphStates,
  } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
  const [isLoading, setLoading] = useState(false);
  const scenarioConfigRef = useRef();
  const appAreaRef = useRef();

  async function handleExecStatus() {
    await execStatus(ip, setExecApkStatus);
  }

  useEffect(() => {
    let timer = null;
    if (execApkStatus !== 'EXECUTING') {
      clearInterval(timer);
    }
    if (execApkStatus === 'EXECUTING') {
      timer = setInterval(() => {
        handleExecStatus();
      }, 10000);
    }
    return () => {
      console.log('clean interval');
      clearInterval(timer);
    };
  }, [execApkStatus]);

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
      setExecApkStatus('');
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

  function handleBack() {
    cleanGraphStates();
  }

  return (
    <Container>
      <Content>
        <nav>
          <Link to="/" onClick={handleBack}>
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
            <Button type="button" onClick={handleAppArea} disabled={false}>
              <IconContent>
                <img src={app} alt="App Area" />
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

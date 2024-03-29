/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty-function */
import { Link } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';

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
import SaveScenarioModal from '../SaveScenarioModal';
import AppAreaModal from '../AppAreaModal';
import appApi from '~/services/app';
import scenarioApi from '~/services/scenario';
import { ScenarioContext } from '~/context/ScenarioContext';

let timer = null;
function HeaderNetwork() {
  const { graph, convertionalScenery, cleanGraphStates } = useContext(
    GraphContext
  );
  const {
    isExecute,
    setExecute,
    execApkStatus,
    isDisableBecauseExecApp,
    setExecApkStatus,
    cleanScenarioStates,
  } = useContext(ScenarioContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
  const [isLoading, setLoading] = useState(false);
  const saveScenariogRef = useRef();
  const appAreaRef = useRef();

  async function handleExecStatus() {
    await appApi.executionStatus(ip, setExecApkStatus);
  }

  useEffect(() => {
    if (execApkStatus !== 'EXECUTING') {
      clearInterval(timer);
    }
    if (execApkStatus === 'EXECUTING') {
      timer = setInterval(() => {
        handleExecStatus();
      }, 10000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [execApkStatus]);

  async function handleExecScenerio() {
    setLoading((x) => !x);
    if (graph?.nodes.length === 0) {
      snackBarOpen('Scenary not be void!', 'error');
      setLoading((x) => !x);
      return;
    }
    const scenerioTestbed = convertionalScenery(graph);
    try {
      snackBarOpen('Loading Scenery', 'info');
      const { data } = await scenarioApi.executionScenerio(ip, scenerioTestbed);
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
      const { data } = await scenarioApi.stopScenario(ip);
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
    saveScenariogRef.current?.open();
  }
  async function handleAppArea() {
    appAreaRef.current?.open();
  }

  function handleBack() {
    cleanGraphStates();
    cleanScenarioStates();
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
              isExecute ? handleStopScenery() : handleExecScenerio()
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
          <Button type="button" onClick={handleSaveScenario}>
            <IconContent>
              <img src={save} alt="Save" />
            </IconContent>
            Save
          </Button>
          {isExecute && (
            <Button
              type="button"
              onClick={handleAppArea}
              disabled={isDisableBecauseExecApp}
            >
              <IconContent>
                <img src={app} alt="App Area" />
              </IconContent>
              App Area
              {isDisableBecauseExecApp && <span className="loading" />}
            </Button>
          )}
        </aside>
      </Content>
      <SaveScenarioModal ref={saveScenariogRef} />
      <AppAreaModal ref={appAreaRef} />
    </Container>
  );
}

export default HeaderNetwork;

import { useHistory } from 'react-router-dom';

import { useContext, useRef, useEffect, useState } from 'react';

import Styles from './styles';

import cloud from '~/assets/cloud_2.svg';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';
import SearchModal from '~/components/SearchModal';
import ConfigModal from '~/components/ConfigModal';
import { ApiContext } from '~/context/ApiContext';
import ScenarioModal from '~/components/ScenarioModal';

function Home() {
  const uploadRef = useRef();
  const searchRef = useRef();
  const configRef = useRef();
  const scenarioRef = useRef();
  const history = useHistory();
  const { convertionalScenaryToVis } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (!ip) {
      configRef.current?.open();
    }
  }, [ip]);

  function handleCreateScenery() {
    scenarioRef.current?.open();
  }

  function upload() {
    uploadRef.current.click();
    setAction(null);
  }

  async function openFile(evt) {
    const fileObj = evt.target.files[0];
    const reader = new FileReader();

    await reader.addEventListener('load', (event) => {
      const json = atob(event.target.result.substring(29));
      convertionalScenaryToVis(json);
      snackBarOpen('Updload success', 'success');
      handleCreateScenery();
      history.push('/network');
    });
    await reader.readAsDataURL(fileObj);
  }

  function handleUpload() {
    setAction('upload');
  }

  useEffect(() => {
    if (action && action === 'upload') {
      scenarioRef.current?.open();
    }
  }, [action]);

  return (
    <Styles.Container>
      <Styles.ContentImage>
        <Styles.ImageCloud src={cloud} alt="Cloud" />
        <h1>MCC Network</h1>
      </Styles.ContentImage>
      <Styles.ContentOptions>
        <Styles.BoardOptions>
          <Styles.BoardButton
            type="button"
            onClick={() => {
              handleCreateScenery();
            }}
          >
            Build scenery
          </Styles.BoardButton>
          <Styles.BoardButton
            onClick={() => searchRef.current?.open()}
            type="button"
          >
            Search Scenery
          </Styles.BoardButton>

          <Styles.BoardButton type="button" onClick={handleUpload}>
            Upload Scenery
            <input
              type="file"
              className="hidden"
              multiple={false}
              accept=".json"
              onChange={(evt) => openFile(evt)}
              ref={uploadRef}
            />
          </Styles.BoardButton>

          <Styles.BoardButton
            type="button"
            onClick={() => configRef.current?.open()}
          >
            Server Configuration
          </Styles.BoardButton>
        </Styles.BoardOptions>
      </Styles.ContentOptions>
      <ScenarioModal
        onSubmit={() => (action && action === 'upload' ? upload() : null)}
        onClose={() => {
          setAction(null);
        }}
        ref={scenarioRef}
      />
      <SearchModal ref={searchRef} />
      <ConfigModal ref={configRef} />
    </Styles.Container>
  );
}

export default Home;

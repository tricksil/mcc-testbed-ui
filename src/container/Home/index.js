import { useHistory } from 'react-router-dom';

import { useContext, useRef, useEffect, useState } from 'react';

import Styles from './styles';

import cloud from '~/assets/cloud_2.svg';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';
import SearchModal from '~/components/SearchModal';
import ServerConfigurationModal from '~/components/ServerConfigurationModal';
import { ApiContext } from '~/context/ApiContext';
import NameScenarioModal from '~/components/NameScenarioModal';

function Home() {
  const uploadRef = useRef();
  const searchRef = useRef();
  const serverConfigurationRef = useRef();
  const nameScenarioRef = useRef();
  const history = useHistory();
  const { convertionalScenaryToVis, setGraph } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
  const [action, setAction] = useState(null);
  const [title, setTitle] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!ip) {
      serverConfigurationRef.current?.open();
    }
  }, [ip]);

  function handleCreateScenery() {
    setGraph({ nodes: [], edges: [] });
    nameScenarioRef.current?.open();
  }

  function upload() {
    uploadRef.current.click();
    setAction(null);
  }

  function openFile(evt) {
    const fileObj = evt.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      const json = atob(event.target.result.substring(29));
      convertionalScenaryToVis(json);
      snackBarOpen('Updload success', 'success');
      // handleCreateScenery();
      history.push('/network');
    });
    reader.readAsDataURL(fileObj);
  }

  function handleUpload() {
    setAction('upload');
  }

  function handleSearch() {
    searchRef.current?.open();
  }

  useEffect(() => {
    if (action && action === 'upload') {
      nameScenarioRef.current?.open();
    }
  }, [action]);

  useEffect(() => {
    if (count === 10) {
      window.electron.send('openDevTools', '');
      setCount(0);
    }
  }, [count]);
  return (
    <Styles.Container>
      <Styles.ContentImage>
        <Styles.ImageCloud
          src={cloud}
          alt="Cloud"
          onClick={() => setCount((x) => x + 1)}
        />
        <h1>MCC Testbed</h1>
      </Styles.ContentImage>
      <Styles.ContentOptions>
        <Styles.BoardOptions>
          <Styles.BoardButton
            type="button"
            onClick={() => {
              setTitle('Build Scenario');
              handleCreateScenery();
            }}
          >
            Build Scenario
          </Styles.BoardButton>
          <Styles.BoardButton
            onClick={() => {
              setTitle('Search Scenario');
              handleSearch();
            }}
            type="button"
          >
            Search Scenario
          </Styles.BoardButton>

          <Styles.BoardButton
            type="button"
            onClick={() => {
              setTitle('Upload Scenario');
              handleUpload();
            }}
          >
            Upload Scenario
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
            onClick={() => serverConfigurationRef.current?.open()}
          >
            Server Configuration
          </Styles.BoardButton>
        </Styles.BoardOptions>
      </Styles.ContentOptions>
      <NameScenarioModal
        onSubmit={() => (action && action === 'upload' ? upload() : null)}
        onClose={() => {
          setAction(null);
        }}
        ref={nameScenarioRef}
        title={title}
      />
      <SearchModal ref={searchRef} />
      <ServerConfigurationModal ref={serverConfigurationRef} />
    </Styles.Container>
  );
}

export default Home;

import { useContext, useState, useEffect, useRef } from 'react';
import { Container } from '~/components/Container';
import { GraphContext } from '~/context/GraphContext';
import { Content, Form } from './styles';

export default function Data() {
  const { convertionalScenaryToVis } = useContext(GraphContext);
  const downloadRef = useRef();
  const uploadRef = useRef();
  const [fileConfig, setFileConfig] = useState({
    fileType: 'json',
    fileName: 'scenare.json',
    status: '',
    fileDownloadUrl: null,
  });

  const { graph, convertionalScenery } = useContext(GraphContext);

  function download(event) {
    event.preventDefault();
    // Prepare the file
    const convertionalGraph = convertionalScenery(graph);
    const output = JSON.stringify(convertionalGraph, null, 4);
    console.log(output);
    // Download it
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    setFileConfig((prev) => ({
      ...prev,
      fileDownloadUrl,
    }));
  }

  useEffect(() => {
    if (fileConfig.fileDownloadUrl) {
      downloadRef.current.click();
      URL.revokeObjectURL(fileConfig.fileDownloadUrl);
      setFileConfig((prev) => ({
        ...prev,
        fileDownloadUrl: null,
      }));
    }
  }, [fileConfig.fileDownloadUrl]);

  function upload() {
    uploadRef.current.click();
  }

  function openFile(evt) {
    console.log('teste');
    const fileObj = evt.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      const json = atob(event.target.result.substring(29));
      convertionalScenaryToVis(json);
    });
    reader.readAsDataURL(fileObj);
  }

  return (
    <Container>
      <Content>
        <Form>
          <h1>Import Data</h1>
          <button type="button" onClick={upload}>
            Upload Scenery
          </button>
          <input
            type="file"
            className="hidden"
            multiple={false}
            accept=".json"
            onChange={(evt) => openFile(evt)}
            ref={uploadRef}
          />
        </Form>
        <Form>
          <h1>Export Data</h1>
          <button type="button" onClick={download}>
            Download Scenery
          </button>
          <a
            className="hidden"
            download={fileConfig.fileName}
            href={fileConfig.fileDownloadUrl}
            ref={downloadRef}
          >
            download
          </a>
        </Form>
      </Content>
    </Container>
  );
}

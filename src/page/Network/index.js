import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import VisNetworkReactComponent from 'vis-network-react';
import { v4 } from 'uuid';

import Modal from '~/components/Modal';
import { Button } from '~/components/Button';
import { Container, ButtonGroup } from './styles';
import { GraphContext } from '~/context/GraphContext';

function NetWork() {
  const [modal, setModal] = useState(false);
  const [network, setNetwork] = useState(null);
  const [objectAction, setObjectActions] = useState({});
  const [nodeSelection, setNodeSelection] = useState(null);
  const [edgeSelection, setEdgeSelection] = useState(null);
  const modalRef = useRef();
  const { graph } = useContext(GraphContext);

  const handleModalAdd = (dataNode, callback, action) => {
    setObjectActions({ dataNode, callback, type: 'node', action });
  };
  const handleModalAddEdge = (dataNode, callback, action) => {
    setObjectActions({ dataNode, callback, type: 'edge', action });
  };
  const handleModalEditNode = (dataNode, callback) => {
    setObjectActions({ dataNode, callback, type: 'node' });
  };

  const handleClick = (params) => {};

  const handleDoubleClick = (params) => {
    if (params.nodes && params.nodes.length > 0) setNodeSelection(params);
  };

  const [state, setState] = useState({
    events: {
      click(params) {
        handleClick(params);
      },
      doubleClick(params) {
        handleDoubleClick(params);
      },
    },
    options: {
      // edges: {
      //   arrows: 'to',
      // },
      manipulation: {
        enabled: false,
        initiallyActive: false,
        addNode(data, callback) {
          handleModalAdd(data, callback, 'add');
        },
        addEdge(data, callback) {
          handleModalAddEdge(data, callback, 'add');
        },
        editNode(data, callback) {
          handleModalAdd(data, callback, 'edit');
        },
        editEdge: true,
        deleteNode: true,
        deleteEdge: true,
      },
    },
  });

  const handleModal = () => {
    network.addNodeMode();
  };
  const handleEditNode = () => {
    network.editNode();
  };

  const handleModalEdge = () => {
    network.addEdgeMode();
  };
  useEffect(() => {
    if (nodeSelection && Object.keys(nodeSelection).length > 0)
      if (nodeSelection.nodes.length === 1) network.editNode();
    if (
      nodeSelection &&
      Object.keys(nodeSelection).length > 0 &&
      nodeSelection.nodes.length === 0
    )
      network.addNodeMode();
  }, [network, nodeSelection]);

  useEffect(
    () =>
      edgeSelection &&
      Object.keys(edgeSelection).length > 0 &&
      network.addEdgeMode(),
    [network, edgeSelection]
  );

  useEffect(
    () => Object.keys(objectAction).length > 0 && modalRef.current?.open(),
    [objectAction]
  );

  const { events, options } = state;
  return (
    <Container>
      <ButtonGroup>
        <Button onClick={handleModal}>add node</Button>
        <Button onClick={handleModalEdge}>add edge</Button>
      </ButtonGroup>
      <VisNetworkReactComponent
        data={graph || {}}
        options={options}
        events={events}
        getNetwork={(data) => {
          setNetwork(data);
        }}
        style={{
          width: '100%',
          height: '80vh',
        }}
      />

      <Modal
        ref={modalRef}
        data={{
          ...objectAction,
        }}
        setRemoveData={() => {
          network?.disableEditMode();
          setObjectActions({});
        }}
      />
    </Container>
  );
}

export default NetWork;

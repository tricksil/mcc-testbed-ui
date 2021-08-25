import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import VisNetworkReactComponent from 'vis-network-react';

import { useHistory } from 'react-router-dom';
import axios from 'axios';
import AddModal from '~/components/AddModal';
import EditModal from '~/components/EditModal';
import { Button } from '~/components/Button';
import { ButtonGroup } from './styles';
import { GraphContext } from '~/context/GraphContext';
import { Container } from '~/components/Container';
import DeleteModal from '~/components/DeleteModal';
import VncModal from '~/components/VncModal';

import addImage from '~/assets/add.svg';
import removeImage from '~/assets/remove.svg';
import { SnackbarContext } from '~/context/SnackContext';
import { ApiContext } from '~/context/ApiContext';

function NetWork() {
  const [network, setNetwork] = useState(null);
  const [objectAction, setObjectActions] = useState({});
  const [nodeSelection, setNodeSelection] = useState(null);
  const addModalRef = useRef();
  const editModalRef = useRef();
  const deleteModalRef = useRef();
  const vncModalRef = useRef();
  const { graph, isExecute, isSmartphone, setGraph, findNode } = useContext(
    GraphContext
  );
  const { snackBarOpen } = useContext(SnackbarContext);
  const history = useHistory();
  const [vncPort, setVncPort] = useState('');
  const { ip } = useContext(ApiContext);

  useEffect(
    () => () => {
      // && history.location.pathname === "any specific path")
      if (history.action === 'POP') {
        setGraph({ nodes: [], edges: [] });
      }
    },
    [history, setGraph]
  );

  const handleModalAddNode = (dataNode, action) => {
    setObjectActions({ dataNode, type: 'node', action });
  };
  const handleModalAddEdge = (dataNode, action) => {
    setObjectActions({ dataNode, type: 'edge', action });
  };
  const handleModalRemoveNodeOrEdges = (dataNode, action) => {
    setObjectActions({ dataNode, action });
  };

  const handleDoubleClick = (params) => {
    console.log(params);
    if (params?.edges.length === 1 && params?.nodes.length === 0) {
      setObjectActions({
        dataNode: { id: params.edges[0] },
        type: 'edge',
        action: 'edit',
        event: 'doubleClick',
      });
      return;
    }
    if (params.nodes && params.nodes.length > 0) {
      setNodeSelection(params);
    }
  };

  const [state, setState] = useState({
    events: {
      doubleClick(params) {
        handleDoubleClick(params);
      },
    },
    options: {
      nodes: {
        size: 30,
      },
      edges: {
        arrows: 'to',
        color: '#312e38',
      },
      interaction: {
        navigationButtons: true,
        keyboard: true,
      },
      manipulation: {
        enabled: false,
        initiallyActive: false,
        addNode(data, callback) {
          handleModalAddNode(data, 'add');
        },
        addEdge(data, callback) {
          handleModalAddEdge(data, 'add');
        },
        editNode(data, callback) {
          handleModalAddNode(data, 'edit');
        },
        editEdge: true,
        deleteNode(data, callback) {
          handleModalRemoveNodeOrEdges(
            { ...data, nodes: data.nodes[0] },
            'delete'
          );
        },
        deleteEdge(data, callback) {
          handleModalRemoveNodeOrEdges({ ...data, nodes: '' }, 'delete');
        },
      },
    },
  });

  const handleModal = () => {
    network.addNodeMode();
  };

  const handleModalEdge = () => {
    network.addEdgeMode();
  };
  const handleModalRemove = () => {
    network.deleteSelected();
  };

  const getPortVnc = useCallback(
    async (node) => {
      try {
        const containerName = findNode(node);
        const response = await axios.get(
          `http://${ip}:5000/vnc/${containerName.label}`
        );

        if (response.data.message !== null) {
          setVncPort(response.data.message);
          snackBarOpen('Success Vnc Port', 'success');
        }
        return true;
      } catch (error) {
        console.log(error);
        snackBarOpen('Find Node Error', 'error');
        return false;
      }
    },
    [findNode, snackBarOpen, ip]
  );

  useEffect(() => {
    if (!isExecute && nodeSelection && Object.keys(nodeSelection).length > 0) {
      if (nodeSelection.nodes.length === 1) {
        network.editNode();
      }
      return;
    }

    if (isExecute && nodeSelection && Object.keys(nodeSelection).length > 0) {
      const node = nodeSelection.nodes[0];
      if (isSmartphone(node, 'client')) {
        const isVnc = getPortVnc(node);
        if (isVnc) {
          vncModalRef.current?.name(node);
          vncModalRef.current?.open();
        }
        setNodeSelection({});
      }
    }
  }, [network, nodeSelection, isExecute, isSmartphone, getPortVnc]);

  const actionModal = useCallback(
    (type) => {
      switch (type) {
        case 'add':
          addModalRef.current?.open();
          break;
        case 'edit':
          editModalRef.current?.open();
          break;
        case 'delete':
          deleteModalRef.current?.open();
          break;
        default:
          break;
      }
    },
    [addModalRef, deleteModalRef]
  );

  useEffect(() => {
    if (!isExecute && Object.keys(objectAction).length > 0)
      actionModal(objectAction.action);
    else if (Object.keys(objectAction).length > 0) setObjectActions({});
  }, [objectAction, actionModal, isExecute]);

  const buttonsOptions = useCallback(
    (
      handleModalCallback,
      handleModalEdgeCallback,
      handleModalRemoveCallback
    ) => {
      if (isExecute) return <></>;
      return (
        <ButtonGroup>
          <Button onClick={handleModalCallback}>
            <img src={addImage} alt="Add" />
            add node
          </Button>
          <Button onClick={handleModalEdgeCallback}>
            <img src={addImage} alt="Add" />
            add edge
          </Button>
          <Button onClick={handleModalRemoveCallback}>
            <img src={removeImage} alt="Add" />
            delete
          </Button>
        </ButtonGroup>
      );
    },
    [isExecute]
  );

  const { events, options } = state;
  return (
    <Container>
      {buttonsOptions(handleModal, handleModalEdge, handleModalRemove)}
      <VisNetworkReactComponent
        data={graph}
        options={options}
        events={events}
        getNetwork={(data) => {
          setNetwork(data);
        }}
        style={{
          width: '100%',
          height: isExecute
            ? 'calc(100vh - 80px)'
            : 'calc(100vh - 80px - 40px)',
        }}
      />

      <AddModal
        ref={addModalRef}
        data={{
          ...objectAction,
        }}
        removeData={() => {
          network?.disableEditMode();
          setObjectActions({});
        }}
      />
      <EditModal
        ref={editModalRef}
        data={{
          ...objectAction,
        }}
        removeData={() => {
          network?.disableEditMode();
          setNodeSelection({});
          setObjectActions({});
        }}
      />
      <DeleteModal
        ref={deleteModalRef}
        data={{
          ...objectAction,
        }}
        removeData={() => {
          network?.disableEditMode();
          setObjectActions({});
        }}
      />
      <VncModal
        ref={vncModalRef}
        vncPort={vncPort}
        removeData={() => {
          network?.disableEditMode();
          setObjectActions({});
          setNodeSelection({});
        }}
      />
    </Container>
  );
}

export default NetWork;

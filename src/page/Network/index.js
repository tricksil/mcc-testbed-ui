import { useState, useEffect, useRef } from 'react';

import VisNetworkReactComponent from 'vis-network-react';
import AddModal from '~/components/modal/AddModal';
import { Button } from '~/components/Button';
import { Container, ButtonGroup } from './styles';

function NetWork() {
  const [modal, setModal] = useState(false);
  const [network, setNetwork] = useState(null);
  const [edges, setEdges] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [objectAction, setObjectActions] = useState({});
  const [nodeSelection, setNodeSelection] = useState(null);
  const [edgeSelection, setEdgeSelection] = useState(null);
  const modalRef = useRef();

  const handleModalAdd = (dataNode, callback) => {
    setObjectActions({ dataNode, callback, type: 'node' });
  };
  const handleModalAddEdge = (dataNode, callback) => {
    setObjectActions({ dataNode, callback, type: 'edge' });
  };
  const handleModalEditNode = (dataNode, callback) => {
    setObjectActions({ dataNode, callback, type: 'node' });
  };

  const handleClick = (params) => {
    if (params.nodes && params.nodes.length === 0) setNodeSelection(params);
  };
  const handleDoubleClick = (params) => {
    if (params.nodes && params.nodes.length > 0) setNodeSelection(params);
  };
  const handleDragStat = (params) => {
    if (params.nodes && params.nodes.length > 0) setEdgeSelection(params);
  };

  const [state, setState] = useState({
    graph: {
      nodes: [],
      edges: [],
    },
    events: {
      click(params) {
        // handleClick(params);
      },
      doubleClick(params) {
        handleDoubleClick(params);
      },
      // oncontext(params) {
      //   console.log('oncontext Event:', params);

      //   params.event = '[original event]';
      // },
      // dragStart(params) {
      //   // There's no point in displaying this event on screen, it gets immediately overwritten
      //   params.event = '[original event]';
      //   console.log('dragStart Event:', params);
      //   // handleDragStat(params);
      // },
      // dragging(params) {
      //   params.event = '[original event]';
      // },
      // dragEnd(params) {
      //   params.event = '[original event]';
      //   console.log('dragEnd Event:', params);
      // },
      // controlNodeDragging(params) {
      //   params.event = '[original event]';
      //   console.log('controlNodeDragging Event:', params);
      // },
      // controlNodeDragEnd(params) {
      //   params.event = '[original event]';
      //   console.log('controlNodeDragEnd Event:', params);
      // },
      // zoom(params) {},
      // showPopup(params) {},
      // hidePopup() {
      //   console.log('hidePopup Event');
      // },
      // select(params) {
      //   console.log('select Event:', params);
      // },
      // selectNode(params) {
      //   console.log('selectNode Event:', params);
      //   console.log(network?.getPositions(params.nodes[0]));
      // },
      // selectEdge(params) {
      //   console.log('selectEdge Event:', params);
      // },
      // deselectNode(params) {
      //   console.log('deselectNode Event:', params);
      // },
      // deselectEdge(params) {
      //   console.log('deselectEdge Event:', params);
      // },
      // hoverNode(params) {
      //   console.log('hoverNode Event:', params);
      // },
      // hoverEdge(params) {
      //   console.log('hoverEdge Event:', params);
      // },
      // blurNode(params) {
      //   console.log('blurNode Event:', params);
      // },
      // blurEdge(params) {
      //   console.log('blurEdge Event:', params);
      // },
    },
    options: {
      // edges: {
      //   arrows: 'to',
      // },
      manipulation: {
        enabled: false,
        initiallyActive: false,
        addNode(data, callback) {
          handleModalAdd(data, callback);
        },
        addEdge(data, callback) {
          handleModalAddEdge(data, callback);
        },
        editNode(data, callback) {
          handleModalAdd(data, callback);
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

  console.log(objectAction);

  useEffect(
    () => Object.keys(objectAction).length > 0 && modalRef.current?.open(),
    [objectAction]
  );

  useEffect(() => {
    const nodesData = nodes?.map((edge) => edge);
    if (nodesData && nodesData.length > state.graph.nodes.length) {
      setState((prevState) => ({
        ...prevState,
        graph: {
          ...prevState.graph,
          nodes: nodesData,
        },
      }));
    }
  }, [nodes, state.graph.nodes.length]);

  useEffect(() => {
    const edgesData = edges?.map((edge) => edge);
    if (edgesData && edgesData.length > state.graph.edges.length) {
      setState((prevState) => ({
        ...prevState,
        graph: {
          ...prevState.graph,
          edges: edgesData,
        },
      }));
    }
  }, [edges, state.graph.edges.length]);

  const { graph, events, options } = state;
  return (
    <Container>
      <ButtonGroup>
        <Button onClick={handleModal}>add node</Button>
        <Button onClick={handleEditNode}>edit node</Button>
        <Button onClick={handleModalEdge}>add edge</Button>
      </ButtonGroup>
      <VisNetworkReactComponent
        data={graph}
        options={options}
        events={events}
        getEdges={(edgesData) => {
          setEdges(edgesData);
        }}
        getNodes={(nodesData) => {
          setNodes(nodesData);
        }}
        getNetwork={(data) => {
          setNetwork(data);
        }}
        style={{
          width: '100%',
          height: '80vh',
        }}
      />

      <AddModal
        ref={modalRef}
        data={objectAction}
        setRemoveData={() => {
          network?.disableEditMode();
          setObjectActions({});
        }}
      />
    </Container>
  );
}

export default NetWork;

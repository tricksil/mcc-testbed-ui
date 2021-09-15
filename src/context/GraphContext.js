import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  convertionalToTestbed,
  convertionalToVis,
} from '~/helpers/convertionalScenery';

export const GraphContext = createContext();

export function GraphProvider({ children }) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [isExecute, setExecute] = useState(false);
  const [name, onChangeName] = useState('');

  useEffect(() => {
    const graphSave = async () => {
      const getGraph = await JSON.parse(localStorage.getItem('graph'));
      setGraph((x) => ({ x, ...getGraph }));
    };
    graphSave();
  }, []);

  console.log(graph);

  useEffect(() => {
    localStorage.setItem('graph', JSON.stringify(graph));
  }, [graph]);

  function createNode(node) {
    setGraph((prevState) => ({
      ...prevState,
      nodes: [...prevState.nodes, node],
    }));
  }

  function createEdge(edge) {
    setGraph((prevState) => ({
      ...prevState,
      edges: [...prevState.edges, edge],
    }));
  }

  function addNodeRandom(graphRandom) {
    setGraph((prevState) => ({
      ...prevState,
      nodes: [...prevState.nodes, ...graphRandom.nodes],
      edges: [...prevState.edges, ...graphRandom.edges],
    }));
  }

  function editNode(node) {
    const nodeFound = graph.nodes?.filter((n) => n.id !== node.id);
    setGraph((prevState) => ({
      ...prevState,
      nodes: [...nodeFound, node],
    }));
  }
  function editEdge(edge) {
    const edgeFound = graph.edges?.filter((e) => e.id !== edge.id);
    setGraph((prevState) => ({
      ...prevState,
      edges: [...edgeFound, edge],
    }));
  }
  function findNode(nodeIndex) {
    return graph.nodes?.find((e) => e.id === nodeIndex);
  }
  function isSmartphone(nodeIndex, type) {
    return graph.nodes?.find(
      (node) => node.id === nodeIndex && node.type === type
    );
  }

  function findEdge(edgeIndex) {
    return graph.edges?.find((e) => e.id === edgeIndex);
  }

  function findEdges(edgesIndexs) {
    return edgesIndexs?.reduce(
      (acc, edgeIndex) =>
        acc.push(graph.edges?.find((e) => e.id === edgeIndex)),
      []
    );
  }

  function removeNode(nodeIndex) {
    return function (nodes) {
      if (!nodeIndex) return nodes;
      return nodes?.filter((n) => n.id !== nodeIndex);
    };
  }

  function removeEdges(edgesIndex) {
    return function (edges) {
      return function (qtdItemRemoved) {
        if (edgesIndex.length === 0) return edges;
        edgesIndex?.forEach((edgeIndex) => {
          const index = edges?.findIndex((e) => e.id === edgeIndex);
          if (index !== -1) edges?.splice(index, qtdItemRemoved);
        });
        return edges;
      };
    };
  }

  function removeNodeOrEdges(nodes) {
    return function (edges) {
      setGraph((prev) => ({
        ...prev,
        nodes: removeNode(nodes)(graph.nodes),
        edges: removeEdges(edges)(graph.edges)(1),
      }));
    };
  }

  function convertionalScenery() {
    return convertionalToTestbed(graph);
  }
  function convertionalScenaryToVis(graphJson) {
    const vis = convertionalToVis(graphJson);
    setGraph((prev) => ({
      ...prev,
      ...vis,
    }));
  }

  return (
    <GraphContext.Provider
      value={{
        graph,
        isExecute,
        isSmartphone,
        setGraph,
        createNode,
        createEdge,
        addNodeRandom,
        editNode,
        editEdge,
        findNode,
        findEdge,
        findEdges,
        removeNodeOrEdges,
        convertionalScenery,
        convertionalScenaryToVis,
        setExecute,
        name,
        onChangeName,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

GraphProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

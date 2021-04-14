import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  convertionalToTestbed,
  convertionalToVis,
} from '~/helpers/convertionalScenery';

export const GraphContext = createContext();

export function GraphProvider({ children }) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

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

  function convertionalScenery() {
    return convertionalToTestbed(graph);
  }
  function convertionalScenaryToVis(graphJson) {
    const vis = convertionalToVis(graphJson);
    console.log(vis);
    setGraph((prev) => ({
      ...prev,
      ...vis,
    }));
  }

  return (
    <GraphContext.Provider
      value={{
        graph,
        setGraph,
        createNode,
        createEdge,
        addNodeRandom,
        editNode,
        convertionalScenery,
        convertionalScenaryToVis,
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

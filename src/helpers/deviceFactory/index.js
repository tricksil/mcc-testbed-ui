/* eslint-disable func-names */
import { v4 } from 'uuid';
import faker from 'faker';
import PropTypes from 'prop-types';

const symbolsArray = ["'", '"', '.', ' ', ','];

export function removeSymbols(symbols) {
  return function (text) {
    return symbols.reduce((acc, simbolo) => acc.replace(simbolo, ''), text);
  };
}

function hasNames(graphs) {
  return graphs?.nodes
    ?.filter((node) => node.type === 'client' || node.type === 'server')
    ?.map((node) => node.label);
}

const nameType = {
  client: () => faker.name.firstName(),
  switch: () => faker.company.companyName(),
  server: () => faker.random.word(),
};

function nameRandom(graphs, namesSelected) {
  return function (type) {
    console.log(graphs, namesSelected, type);
    let nameChoose = null;
    const namesGraphs = hasNames(graphs);
    const namesExists = [...namesGraphs, ...namesSelected];

    nameChoose = nameType[type]();
    while (namesExists.includes(nameChoose)) {
      nameChoose = nameType[type]();
    }

    return nameChoose;
  };
}

function createName(graphs, namesSelected) {
  return function (type) {
    const name = nameRandom(graphs, namesSelected)(type);
    return removeSymbols(symbolsArray)(name).toLowerCase();
  };
}

export function createDimage() {
  return function (type) {
    if (type === 'client') {
      return `renanalves/android-22`;
    }
    if (type === 'switch') return '';
    return `renanalves/server-testbed`;
  };
}

function hasIps(graphs) {
  return graphs.nodes
    .filter((node) => node.type === 'client' || node.type === 'server')
    .map((node) => node.ip);
}

function ipRandom(graphs, ipsSelected) {
  let ipChoose = null;
  const ipsGraphs = hasIps(graphs);
  const ipsExists = [...ipsGraphs, ...ipsSelected];

  ipChoose = Math.floor(Math.random() * 255);

  while (ipsExists.includes(ipChoose)) {
    ipChoose = Math.floor(Math.random() * 255);
  }

  return `10.0.0.${ipChoose}`;
}

export function ipExist(ip, graphs) {
  const ipsGraphs = hasIps(graphs);
  return ipsGraphs.includes(ip);
}

export function nameExist(name, graphs) {
  const namesGraphs = hasNames(graphs);
  return namesGraphs?.includes(name);
}
export function DeviceFactory(
  graphs,
  nodeConnect,
  quantity,
  customEdge,
  customNode
) {
  const ipsSelected = [];
  const namesSelected = [];
  const nodes = new Array(quantity).fill().map((value) => {
    const id = v4().split('-')[0];
    const createNode = {
      ...value,
      ...customNode,
      id,
    };
    if (customNode.type !== 'switch') {
      const name = createName(graphs, namesSelected)(customNode.type);
      const dimage = createDimage()(customNode.type);
      const ip = ipRandom(graphs, ipsSelected);
      const title = `Type: ${
        customNode.type === 'client' ? 'Cliente' : 'Server'
      }<br>Name: ${name}<br>${customNode.title}<br>IP: ${ip}<br>Image: ${
        customNode.dimage
      }`;
      createNode.label = name;
      createNode.dimage = dimage;
      createNode.ip = ip;
      createNode.title = title;
      ipsSelected.push(ip);
      namesSelected.push(name);
    } else {
      createNode.label = id;
      createNode.title = `Type: Switch<br>Name: ${id}`;
    }

    return createNode;
  });

  const edges = nodes.map((value) => ({
    ...customEdge,
    from: value.id,
    to: nodeConnect,
    title: `Delay: ${customEdge.delay}ms<br>Jitter: ${customEdge.jitter}ms<br>Bandwidth: ${customEdge.bandwidth}`,
  }));

  return {
    nodes,
    edges,
  };
}

DeviceFactory.propTypes = {
  nodeConnect: PropTypes.oneOfType([PropTypes.object]),
  quantity: PropTypes.number,
  customEdge: PropTypes.oneOfType([PropTypes.object]),
  customNode: PropTypes.oneOfType([PropTypes.object]),
};

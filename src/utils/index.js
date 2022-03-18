import { chooseTypeDevice } from './helpers/convertionalScenery';
import { createDimage, DeviceFactory } from './helpers/deviceFactory';

import switchDevice from '~/assets/switch.svg';

function addNodeTitle(typeChoose, name, nodeIndex) {
  return `Type: ${
    typeChoose.charAt(0).toUpperCase() + typeChoose.slice(1)
  }<br>Name: ${typeChoose !== 'switch' ? name : nodeIndex}`;
}

function addEdgeTitle(delay, jitter, bandwidth) {
  return `Delay: ${delay}ms<br>Jitter: ${jitter}ms<br>Bandwidth: ${bandwidth}`;
}

function addLabel(typeChoose, name, nodeIndex) {
  return typeChoose !== 'switch' ? name : nodeIndex;
}

function addIp(customNode, device, switchDivice, ip) {
  if (device !== switchDivice) {
    customNode.ip = ip;
    customNode.title = `${customNode.title}<br>IP: ${ip}`;
  }
}

function addDImage(customNode, typeChoose) {
  if (typeChoose !== 'switch') {
    customNode.dimage = createDimage(typeChoose);
    customNode.title = `${customNode.title}<br>Image: ${customNode.dimage}`;
  }
}

function addNode(node, device, name, ip) {
  const typeChoose = chooseTypeDevice(device);
  const nodeIndex = node.id.split('-')[0];
  const customNode = {
    ...node,
    id: nodeIndex,
    label: addLabel(typeChoose, name, nodeIndex),
    title: addNodeTitle(typeChoose, name, nodeIndex),
    shape: 'image',
    image: device,
    size: 15,
    type: typeChoose,
  };
  addIp(customNode, device, switchDevice, ip);
  addDImage(customNode, typeChoose);
  return customNode;
}

function editNode(node, device, name, ip) {
  const customNode = {
    ...node,
    label: name,
    title: `Name: ${name}`,
  };
  if (device !== switchDevice) {
    customNode.ip = ip;
    customNode.title = `${customNode.title}<br>IP: ${ip}`;
    customNode.title = `${customNode.title}<br>Image: ${customNode.dimage}`;
  }
  return customNode;
}

export function saveNode(node, edit = false, actionNode, device, name, ip) {
  const customNode = edit
    ? editNode(node, device, name, ip)
    : addNode(node, device, name, ip);

  actionNode(customNode);
}

export function saveEdge(edge, actionEdge, name, bandwidth, delay, jitter) {
  const customEdge = {
    ...edge,
    label: name,
    bandwidth: Number(bandwidth),
    delay: `${delay}`,
    jitter: `${jitter}`,
    title: addEdgeTitle(delay, jitter, bandwidth),
  };
  actionEdge(customEdge);
}

export function saveNodesAndEdge(
  node,
  actionRandom,
  deviceChecked,
  bandwidthRandom,
  delayRandom,
  jitterRandom,
  graph,
  quantity
) {
  const typeChoose = chooseTypeDevice(deviceChecked);
  const customNode = {
    shape: 'image',
    image: deviceChecked,
    size: 15,
    type: typeChoose,
  };
  const customEdge = {
    bandwidth: Number(bandwidthRandom),
    delay: `${delayRandom}`,
    jitter: `${jitterRandom}`,
  };
  const graphRandom = DeviceFactory(
    graph,
    node?.id,
    Number(quantity),
    customEdge,
    customNode
  );
  actionRandom(graphRandom);
}

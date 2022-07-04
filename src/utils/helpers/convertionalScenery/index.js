import phone from '~/assets/phone.svg';
import server from '~/assets/server.svg';
import loadBalance from '~/assets/load_balance.svg';
import switchDivice from '~/assets/switch.svg';
import { typeTitle } from '../deviceFactory';

export function convertionalToTestbed(graphs) {
  const nodes = graphs.nodes
    .filter((node) => node.type !== 'switch')
    .map((node) => ({
      name: node.label,
      ip: node.ip,
      interface: node.id,
      type: node.type,
      dimage: node.dimage,
    }));

  const switches = graphs.nodes
    ?.filter((graph) => graph.type === 'switch')
    .map((graph) => graph.id);

  const links = graphs.edges?.map((edge) => ({
    from: edge.from,
    to: edge.to,
    delay: `${edge.delay}ms`,
    jitter: `${edge.jitter}ms`,
    bw: edge.bandwidth,
  }));

  return {
    NODES: nodes,
    SWITCHES: switches,
    LINKS: links,
  };
}

export function chooseTypeDevice(typeParam) {
  switch (typeParam) {
    case phone:
      return 'client';
    case server:
      return 'server';
    case loadBalance:
      return 'load-balance';
    default:
      return 'switch';
  }
}

const type = {
  client: phone,
  server,
  'load-balance': loadBalance,
  switch: switchDivice,
};

export function convertionalToVis(testbed) {
  const { NODES, SWITCHES, LINKS } = JSON.parse(testbed);
  console.log(NODES, SWITCHES, LINKS);
  let nodes = [];
  let edges = [];
  if (NODES && NODES.length > 0)
    nodes = NODES.map((node) => ({
      id: node.interface,
      label: node.name,
      ip: node.ip,
      type: node.type,
      dimage: node.dimage,
      shape: 'image',
      image: type[node.type],
      size: 15,
      title: `Type: ${typeTitle[node.type]}<br>Name: ${node.name}<br>Ip: ${
        node.ip
      }<br>Image: ${node.dimage}`,
    }));

  if (SWITCHES && SWITCHES.length > 0)
    nodes = [
      ...nodes,
      ...SWITCHES.map((node) => ({
        id: node,
        label: node,
        shape: 'image',
        type: 'switch',
        image: switchDivice,
        size: 15,
        title: `Type: Switch<br>Name: ${node}`,
      })),
    ];
  if (LINKS && LINKS.length > 0)
    edges = LINKS.map((link) => ({
      from: link.from,
      to: link.to,
      delay: link.delay.replace(/\D/g, ''),
      jitter: link.jitter.replace(/\D/g, ''),
      bandwidth: link.bw,
      title: `Delay: ${link.delay}<br>Jitter: ${link.jitter}<br>Bandwidth: ${link.bw}`,
    }));
  return {
    nodes,
    edges,
  };
}

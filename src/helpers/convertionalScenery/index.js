import phone from '~/assets/phone.svg';
import server from '~/assets/server.svg';
import switchDivice from '~/assets/switch.svg';

export function convertionalToTestbed(graphs) {
  const nodes = graphs.nodes
    .filter((node) => node.type === 'client' || node.type === 'server')
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
    delay: edge.delay,
    bw: edge.bandwidth,
  }));

  return {
    NODES: nodes,
    SWITCHES: switches,
    LINKS: links,
  };
}

export function convertionalToVis(testbed) {
  const { NODES, SWITCHES, LINKS } = JSON.parse(testbed);

  const nodesTypes = NODES.map((node) => ({
    id: node.interface,
    label: node.name,
    ip: node.ip,
    type: node.type,
    dimage: node.dimage,
    shape: 'image',
    image: node.type === 'client' ? phone : server,
    size: 15,
    title: `Name: ${node.name}<br>Ip: ${node.ip}<br>Image: ${node.dimage}`,
  }));

  const nodes = [
    ...nodesTypes,
    ...SWITCHES.map((node) => ({
      id: node,
      label: node,
      shape: 'image',
      type: 'switch',
      image: switchDivice,
      size: 15,
      title: `Name: ${node}`,
    })),
  ];

  const edges = LINKS.map((link) => ({
    from: link.from,
    to: link.to,
    delay: link.delay,
    bandwidth: link.bw,
    title: `<p>Delay: ${link.delay}<br>Bandwidth: ${link.bw}</p>`,
  }));

  return {
    nodes,
    edges,
  };
}

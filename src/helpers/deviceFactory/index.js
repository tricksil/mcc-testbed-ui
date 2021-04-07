import { v4 } from 'uuid';
import faker from 'faker';
import PropTypes from 'prop-types';

export function DeviceFactory(nodeConnect, quantity, customEdge, customNode) {
  const nodes = new Array(quantity).fill().map((value) => ({
    ...value,
    ...customNode,
    id: v4(),
    label: `${faker.name.firstName()} ${faker.name.lastName()}`,
    ip: faker.internet.ip(),
  }));

  const edges = nodes.map((value) => ({
    ...customEdge,
    from: value.id,
    to: nodeConnect,
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

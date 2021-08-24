import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import * as axios from 'axios';

export const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [ip, setIp] = useState('');

  function changeIp(value) {
    setIp(value);
  }

  return (
    <ApiContext.Provider value={{ ip, changeIp }}>
      {children}
    </ApiContext.Provider>
  );
}

ApiProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

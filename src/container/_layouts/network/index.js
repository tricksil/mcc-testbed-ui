import React from 'react';
import PropTypes from 'prop-types';

import HeaderNetwork from '~/components/HeaderNetwork';
import { Wrapper } from './styles';

function NetworkLayout({ children }) {
  return (
    <Wrapper>
      <HeaderNetwork />
      {children}
    </Wrapper>
  );
}

export default NetworkLayout;

NetworkLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

export const Button = styled.button`
  max-width: 100%;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
`;

export const ButtonIcon = styled.button`
  max-width: 100%;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  background: none;

  img {
    width: 25px;
    height: 25px;
  }
`;

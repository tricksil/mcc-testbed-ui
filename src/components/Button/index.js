/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

export const Button = styled.button`
  max-width: 100%;
  padding: 8px 24px;
  border: none;
  cursor: pointer;
  background-color: #28262e;
  color: #fff;
  text-transform: capitalize;
  /* font-size: 12px; */

  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    margin-right: 5px;
  }

  &:first-child {
    border-bottom-left-radius: 16px;
  }

  &:last-child {
    border-bottom-right-radius: 16px;
  }
  &:hover {
    background-color: rgba(40, 38, 46, 0.5);
    color: #28262e;
    font-weight: bold;
  }
`;

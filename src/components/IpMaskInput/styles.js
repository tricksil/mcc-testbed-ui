import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  h4 {
    margin-bottom: 0px !important;
  }
`;
export const IpContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;
export const Input = styled(TextField)`
  .MuiInput-root {
    max-width: 50px;
  }
`;

export const Error = styled.span`
  color: #cc2727;
  font-size: 12px;
  margin-top: 5px;
`;

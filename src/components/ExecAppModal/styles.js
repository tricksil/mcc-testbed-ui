import { Dialog } from '@material-ui/core';
import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.8);
`;

export const Success = styled.h6`
  color: #2bde68;
  margin-left: 10px;
`;
export const Error = styled.h6`
  color: #cc2727;
  margin-left: 10px;
`;

export const Content = styled.div`
  width: 28vw;
  height: 90vh;
  background: white;
  margin: 50px auto;
  border-radius: 8px;

  display: grid;
  grid-template-rows: minmax(50px, 1fr) minmax(500px, 3fr) 100px;
  grid-template-areas:
    'header'
    'body'
    'footer';
`;

export const Iframe = styled.iframe``;

export const Header = styled.header`
  display: grid;
  align-items: center;
  padding: 30px 20px;
  grid-area: header;
`;

export const Body = styled.main`
  display: grid;
  align-items: center;
  padding: 0px 20px;
  grid-area: body;
`;

export const Footer = styled.footer`
  grid-area: footer;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  padding: 0px 20px;
`;

export const Input = styled.input`
  max-width: 100%;
  padding: 8px 16px;
  border: 1px solid #ccc;
`;

export const ActionContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

export const DialogCustom = styled(Dialog)`
  .MuiDialog-paperWidthSm {
    max-width: 600px;
    width: 100%;
  }
`;

export const UploadApk = styled.div`
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  width: 400px;
  height: 200px;
  > p {
    color: ${(props) => (props.error ? '#cc2727' : 'black')};
  }
  border: 2px dashed ${(props) => (props.error ? '#cc2727' : 'gray')};
  > img {
    width: 120px;
    height: 120px;
  }
  .hidden {
    display: none;
  }
`;

const load = keyframes`
  to {
    transform: rotate(360deg);
  }
`;
export const Action = styled.span`
  padding: 10px;
  border-radius: 50%;
  border: 3px solid
    ${(props) => (props.disabled ? 'rgba(0, 0, 0, 0.26)' : '#3f51b5')};

  ${(props) =>
    props.loading
      ? css`
          border-top-color: transparent;
          animation: ${load} 1s infinite linear;
        `
      : ''}
`;

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

export const DialogCustom = styled(Dialog)`
  .MuiDialog-paperFullWidth {
    width: 100%;
  }
  .MuiDialog-paperWidthFalse {
    max-width: 100%;
  }
  .MuiDialog-paperScrollPaper {
    display: flex;
    max-height: 100%;
    flex-direction: column;
  }
  .MuiDialog-paper {
    margin: 0;
  }
  .MuiDialog-paperFullWidth {
    height: 100%;
    width: 100%;
  }
  .MuiPaper-rounded {
    border-radius: 0px;
  }
`;

export const DialogTitleCustom = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  > button {
    background: none;
    border: none;
    img {
      width: 24px;
      height: 24px;
    }
    cursor: pointer;
  }
`;

export const GridContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ButtonAdd = styled.button`
  width: 100%;
  max-width: 250px;
  background-color: #312e38;
  padding: 8px 8px;
  border: 0;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

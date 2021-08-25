import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.8);
`;

export const Content = styled.div`
  width: 40vw;
  height: 80vh;
  background: white;
  margin: 50px auto;
  border-radius: 8px;

  display: grid;
  grid-template-rows: minmax(160px, 1fr) 3fr 100px;
  grid-template-areas:
    'header'
    'body'
    'footer';
`;

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

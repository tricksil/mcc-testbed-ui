import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div`
  background: #28262e;
  padding: 0 30px;
`;
export const Content = styled.div`
  height: 80px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  nav {
    display: flex;
    align-items: center;
    a > img {
      width: 40px;
    }
  }

  aside {
    display: flex;
  }
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  strong {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }
  a {
    margin-top: 2px;
    color: #999;
    font-size: 14px;
  }
`;

export const Logout = styled.button`
  border: 0;
  height: 42px;
  border-radius: 4px;
  background: #d44059;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  padding: 0 20px;
  margin-left: 30px;
  cursor: pointer;
`;

const load = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const ActionContent = styled.div`
  position: relative;
  padding: 10px;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;
export const IconContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

export const Action = styled.span`
  padding: 10px;
  border-radius: 50%;
  border: 3px solid ${(props) => (props.execute ? '#CC2727' : '#2bde68')};
  position: absolute;
  left: 0%;
  bottom: 0%;
  top: 0%;
  right: 0%;

  ${(props) =>
    props.loading
      ? css`
          border-top-color: transparent;
          animation: ${load} 1s infinite linear;
        `
      : ''}
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  min-width: 100px;
  border: 2px solid #fff;
  border-radius: 8px;
  background: #fff;
  padding: 4px 8px;
  color: #222222;
  font-weight: bold;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    background: #eaecef;
    border-color: #eaecef;
  }

  &:last-child {
    margin-right: 0px;
  }
`;

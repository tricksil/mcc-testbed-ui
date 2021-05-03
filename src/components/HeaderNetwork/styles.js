import styled from 'styled-components';

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
    justify-content: space-between;
    align-items: baseline;
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

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    margin-right: 5px;
  }

  border: 2px solid #fff;
  border-radius: 8px;
  background: #fff;
  padding: 4px 8px;
`;

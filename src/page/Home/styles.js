import styled from 'styled-components';

const components = {};

components.Container = styled.div`
  height: 100%;
  display: flex;

  flex: 1;
  justify-content: space-between;
`;

components.ContentImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;

  background: rgba(255, 255, 255, 0.1);

  > h1 {
    color: #ffffff;
  }
`;

components.ImageCloud = styled.img`
  width: 300px;
`;

components.ContentOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

components.BoardOptions = styled.div`
  background: #ff9000;
  border-radius: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 60px;
  min-width: 300px;

  .hidden {
    display: none;
  }
`;

components.BoardButton = styled.button`
  border: 0;
  background: #3e3b47;
  border-radius: 32px;
  padding: 12px 24px;

  width: 100%;

  color: #ffffff;
  font-weight: bold;
  font-size: 18px;

  & + & {
    margin-top: 20px;
  }

  cursor: pointer;
`;

export default components;

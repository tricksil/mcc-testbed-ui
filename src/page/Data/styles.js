import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;
export const Form = styled.form`
  height: 400px;
  width: 300px;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  button {
    width: 100%;
    padding: 8px 16px;
    background: white;
    border: 1px solid black;
    border-radius: 4px;
    font-weight: bold;

    &:hover {
      background-color: rgba(118, 118, 118, 0.5);
      color: white;
      border-color: transparent;
    }
  }

  .hidden {
    display: none;
  }
`;

import styled from 'styled-components';

export const UploadApk = styled.div`
  margin-top: 20px;
  padding: 20px;
  display: flex;
  align-self: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  width: 100%;
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

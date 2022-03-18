/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

export const ContainerSelect = styled.div`
  margin: 30px 0;
  height: 100px;
`;
export const Container = styled.div`
  /* margin: 30px 0; */
  height: 100px;
`;

export const Info = (props) => (
  <Container>
    <p>{JSON.stringify(props)}</p>
  </Container>
);

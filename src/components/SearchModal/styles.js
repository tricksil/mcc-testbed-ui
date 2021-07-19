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

export const colourStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'red' : 'blue',
    padding: 20,
    marginBottom: 30,
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
    marginBottom: 30,
    height: 47,
  }),
};

export const Info = (props) => (
  <Container>
    <p>{JSON.stringify(props)}</p>
  </Container>
);

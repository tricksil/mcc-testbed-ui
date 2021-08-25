/* eslint-disable no-nested-ternary */
import styled from 'styled-components';

export const ContainerSelect = styled.div`
  margin: 30px 0;
  height: 100px;
`;
export const Container = styled.div`
  /* margin: 30px 0; */
  /* height: 100px; */
  max-height: 300px;
`;

export const ScenarioContent = styled.div`
  border-radius: 8px;

  font-weight: bold;
  font-size: 18px;

  padding: 5px 10px;
  background: #312e37;
  background: ${(props) => (props.select ? '#eaecef' : '#312e37')};
  margin-bottom: 5px;
  cursor: pointer;

  p {
    color: ${(props) => (props.select ? '#312e37' : '#eaecef')};
  }

  &:hover {
    background: ${(props) => (props.select ? '#eaecef' : '#eaecef')};
    p {
      color: ${(props) => (props.select ? '#312e37' : '#312e37')};
    }
  }

  &:last-child {
    margin-bottom: none;
  }
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

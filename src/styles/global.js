import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html, body, #root, .App {
  height: 100%;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  &:focus {
    outline: none;
  }
}

`;

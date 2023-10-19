import styled from '@emotion/styled';

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 10px solid #d0ebff;
  border-top-color: #2e71d6;
  animation: spin013151 1s linear infinite;
  border-radius: 100%;

  @keyframes spin013151 {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Spinner;

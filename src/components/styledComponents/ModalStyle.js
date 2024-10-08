import styled from "styled-components";

export const ModalOverlayStyle = styled.div `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContentStyle = styled.div `
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
  position: relative;

  button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    color: #000;
    background: none;
    border: none;

    &:hover {
        opacity: 0.5;
    }
  }

  h2 {

  }

  p {

  }
`;
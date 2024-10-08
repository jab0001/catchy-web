import styled from "styled-components";

export const LogoStyle = styled.img `
    display: block;

    max-width: 329px;
    height: auto;

    margin: 0 auto;
 `;

export const InputStyle = styled.input `
    width: 100%;

    margin: 0 auto;

    height: 50px;
    padding: 10px 24px;

    border-radius: 35px;
    border: 3px solid #147FC2;
    background: rgba(217, 217, 217, 0.00);
    
    
    box-sizing: border-box;

    font-family: "NunitoSans-Regular";
    font-size: 24px;
    font-weight: 400;
    line-height: 50px;

    color: #1881C2;

    outline: none;

    &::placeholder {
        font-family: "NunitoSans-LightItalic";
        font-size: 24px;
        font-weight: 400;
        line-height: 209%;

        color: #1881C2;

        opacity: 0.5;
    }
`;
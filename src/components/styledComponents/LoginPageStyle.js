import styled from "styled-components";

export const LoginStyle = styled.div `
height: 100%;
width; 100vw;
display: flex;
flex-direction: column;
justify-content: space-evenly;
padding-left: 16px;
padding-right: 16px;
box-sizing: border-box;

.title {
    text-align: center;
    font-family: NunitoSans-Regular;
    font-size: 40px;
    font-style: normal;
    font-weight: 500;
    line-height: 50px;
    letter-spacing: 1px;

    color: #1881C2;
}

.container {
    min-height: 38vh;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.input {
    &:first-child {
        margin-bottom: 20px;
    }
}

.forget {
    padding: 0;
    margin: 0;
    margin-top: 17px;
    border: none;
    background: none;

    text-align: center;
    font-family: "NunitoSans-Regular";
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: 25px;
    text-decoration-line: underline;

    color: #1881C2;
}

.switch {
    padding: 0;
    margin: 0;
    margin-top: 19px;
    border: none;
    background: none;

    text-align: center;
    font-family: "NunitoSans-Regular";
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;

    color: #1881C2;
}

.text {
    margin-bottom: 62px;
  
    text-align: center;
    font-family: NunitoSans-LightItalic;
    font-size: 24px;
    font-weight: 300;
    line-height: 30px;

    color: #1881C2;
}

.button {
    padding: 0 24px;
    margin: 0 auto;
    
    font-family: "NunitoSans-Bold";
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
    line-height: 50px;
    letter-spacing: 2px;

    border-radius: 30px;
    border: none;
    background: linear-gradient(90deg, #147FC2 0%, #093C5C 100%);

    color: #FFF;

    text-transform: uppercase;

    &.resend {
        background: red;
        border-color: red;
        font-size: 22px;
    }
}

.img-verify {
    width: 100%;
    height: auto;
    margin: 0 auto;
}
 `;
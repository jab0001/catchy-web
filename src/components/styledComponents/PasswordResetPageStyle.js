import styled from "styled-components";

export const PasswordResetStyle = styled.div `
height: 100%;
width; 100vw;
display: flex;
flex-direction: column;
justify-content: space-between;
box-sizing: border-box;

.title {
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 36px;

    text-align: center;
    font-family: NunitoSans-Regular;
    font-size: 40px;
    font-style: normal;
    font-weight: 500;
    line-height: 50px;
    letter-spacing: 1px;

    color: #1881C2;
}

.text {
    margin-bottom: 19px;
  
    text-align: center;
    font-family: NunitoSans-LightItalic;
    font-size: 24px;
    font-weight: 300;
    line-height: 30px;

    color: #1881C2;
}

.container {
    padding-left: 16px;
    padding-right: 16px;

    min-height: 44vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.button {
    padding: 0 24px;
    margin: 0 auto;
    margin-left: 16px;
    margin-right: 16px;
    
    font-family: "NunitoSans-Bold";
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
    line-height: 50px;
    letter-spacing: 2px;

    border-radius: 35px;
    border: none;
    background: linear-gradient(90deg, #147FC2 0%, #093C5C 100%);

    color: #FFF;

    text-transform: uppercase;
}

.img-reset {
    width: 100%;
    height: auto;
    margin: 0 auto;
}
 `;
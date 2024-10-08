import styled from "styled-components";

export const IntroStyle = styled.div `
height: 100%;
width; 100vw;
display: flex;
flex-direction: column;
justify-content: space-evenly;
padding-left: 16px;
padding-right: 16px;
box-sizing: border-box;

.container {
    width: 100%;

    display: flex;
    justify-content: space-around;
    
    margin: 0 auto;
    /* margin-top: auto; */
}

.button {
    /* padding: 0px 19px; */

    font-family: "NunitoSans-SemiBold";
    font-size: 24px;
    font-style: normal;
    line-height: 45px;
    letter-spacing: 1.2px;
    color: #FFF;
    border-radius: 35px;
    border: 3px solid #147FC2;
    background: #1881C2;
    box-sizing: border-box;
    white-space: nowrap;

    &.login {
        width: 128px;
    }

    &.register {
        width: 190px;
    }
}

.title {
    /* margin-top: 23px; */

    font-family: "NunitoSans-SemiBold";
    font-size: 36px;
    font-style: normal;
    line-height: 40px;
    letter-spacing: -0.2px;
    text-align: center;
    color: #1881C2;
}

.text {
    /* margin-top: 6px; */

    font-family: "NunitoSans-Regular";
    font-size: 33px;
    font-style: normal;
    line-height: 42px;
    letter-spacing: -0.5px;
    text-align: center;
    color: #1881C2;
}

.img {
    display: block;

    width: 28vh;
    height: auto;

    margin: 0 auto;
    /* margin-top: 28px; */
}
 `;
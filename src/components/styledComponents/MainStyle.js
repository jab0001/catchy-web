import styled from "styled-components";

export const MainStyle = styled.div `
height: 100%;
width; 100vw;
display: flex;
flex-direction: column;
justify-content: space-between;
padding-left: 16px;
padding-right: 16px;
padding-top: 75px;
box-sizing: border-box;

.input {
    font-size: 24px;
    line-height: 28px;
    letter-spacing: -0.32px;
    text-align: center;

    height: 40px;
    line-height: 40px;

    &::placeholder {
        text-align: center;
    }
}

.list {
    margin-top: 18px;
    padding-left: 6px;
    padding-right: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 7px 10px;
    min-height: 77px;
}

.keyword {
    position: relative;

    padding: 0 32px 0 16px;

    text-align: center;
    font-family: 'NunitoSans-Regular';
    font-size: 20px;
    line-height: 19px;
    letter-spacing: -0.32px;

    border-radius: 25px;
    border: 1px solid #147FC2;

    color: #1881C2;
    background: none;
}

.close {
    position: absolute;
    width: 15px;
    height: 15px;
    right: 9px;
    top: 1px;
}

.generate {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding-bottom: 30px;
}

.companies {
    margin: 0 auto;
    margin-top: auto;
    margin-bottom: auto;
    width: 60%;

    display: flex;
    flex-wrap: wrap;
    gap: 34px;
}

.service-image {
    width: 80px;
    height: 80px;
    border: none;

    filter: grayscale(100%);
    opacity: 0.5;
  }
  
  input[type="checkbox"]:checked + .service-image {
    filter: grayscale(0%);
    opacity: 1;
  }

  .button {
    padding: 0 24px;
    margin: 0 auto;
    width: 100%;
    
    font-family: "NunitoSans-Bold";
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
    line-height: 50px;
    letter-spacing: 2px;

    border-radius: 30px;
    border: none;
    

    color: #FFF;

    text-transform: uppercase;

    &.payment {
        background: linear-gradient(270deg, #FDBC22 0%, #EE4239 100%);

        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }

    &.fetch {
        margin-top: 22px;
        background: linear-gradient(90deg, #147FC2 0%, #093C5C 100%);

        &:disabled {
            opacity: 0.5;
        }
    }

    &.generated-payment {
        background: linear-gradient(270deg, #FDBC22 0%, #EE4239 100%);

        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
    
}

.generated {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding-bottom: 30px;
}

.generated-btns {
    margin-top: auto;
    display: flex;
}

.generate-back {
    margin-right: 10px;
    width: 60px;

    border-radius: 50%;

    background: #1881C2;
    border: none;

    color: #fff;

    font-size: 28px;

    box-sizing: border-box;
}

.help-list {
    margin-bottom: 10px;
}

.help-logo {
    margin-bottom: 33px;
}

.help-title {
    padding: 0 24px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Sans-Regular';
    font-size: 21px;
    line-height: 21px;
    letter-spacing: 1px;

    color: #1881C2;

    box-sizing: border-box;
    border-radius: 15px;
    border: 2px solid #147FC2;

    background: #FFF;
}

.help-img {
    width: 35px;
    height: 35px;
}
 `;
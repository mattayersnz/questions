import React from 'react';
import styled from "styled-components";
import enter from '../images/enter.svg';
// Action
export const Action = ({ actionText, actionEvent }) => {
    document.addEventListener('keydown', function (event) {
        event.preventDefault();
        if (event.key === 13) {
            console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
            actionEvent();
        }
    });
    return (
        <div>
            <ActionBox>
                <ActionContent>
                    {actionText}
                    <Enter src={enter} />
                </ActionContent>
            </ActionBox>
        </div>
    )
}
const ActionBox = styled.div`
position: absolute;
top: 40%;
left: 30%;
margin: 24px;
padding: 22px;
background: #313131;
border-radius: 5px;
width: 30%;
display: flex;
justify-content: center;
`
const Enter = styled.img`
width: 20px;
padding-left: 32px;
`
const ActionContent = styled.span`
font-family: 'Rubik', 'sans serif';
font-size: 1.5rem;
color: #EBEBEB;
padding-bottom: 7px;
`
// import React from 'react';
// // import enter from '../images/enter.svg';
// import styled from 'styled-components';
// // Action
// export const Action = ({ actionText, actionEvent }) => {
//     // document.addEventListener('keydown', function(event) {
//     //     console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
//     // });
//   return (
//     <div>
//       <ActionBox>
//        kk
//       </ActionBox>
//     </div>
//   )
// }
// ​

// const ActionBox = styled.div`
//   margin: 20%;
//   margin-top: 10%;
// `;
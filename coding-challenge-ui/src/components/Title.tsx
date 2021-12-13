import React, {  } from "react";
import styled from "styled-components";

type TitleProps = {
    text: string
}

const Text = styled.h2`
    font-family: "Roboto";
`;

const Title = ( { text } : TitleProps) => {

    return (
        <div>
            <Text>{text}</Text>
        </div>
    )
}

export default Title;
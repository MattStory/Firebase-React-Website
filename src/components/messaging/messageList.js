import React from "react";

const messageList = ({message}, uid) => {
    console.log("writing message to screen");
    console.log("message: ", message.content);
    return (
        <div className={"messages section"}>
            if ({uid} == {message.id}) {
                <div align="left">
                    <p className = "black-text">{message.content}</p>
                    <p className = "black-text">{message.name}</p>
                    <p className = "black-text">{message.msgTime}</p>
                </div>
            } else {
                <div align="right">
                    <p className = "black-text">{message.content}</p>
                    <p className = "black-text">{message.name}</p>
                    <p className = "black-text">{message.msgTime}</p>
                </div>
            }
        </div>
    )
};

export default messageList;
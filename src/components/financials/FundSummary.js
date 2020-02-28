import React from "react";
import moment from "moment";



const FundSummary = ({fund}) => {
    return (
        <div className={"card z-depth-0 fund-summary"}>
            <div className={"card-content grey-text text-darken-3"}>
                <span className={"card-title"}>{fund.fundType + ': ' + fund.nickname}</span>
                <p>Balance: ${fund.balance}</p>
                <p className ="grey-text">{moment(fund.createdAt.toDate()).calendar()}</p>
            </div>
        </div>
    )
}

export default FundSummary
import React from "react";
import FundSummary from "./FundSummary";

const FundList = ({funds}) => {
    console.log(funds);
        return (
            <div className={"fund-list section"}>
                { funds && funds.map(fund => {
                    return (
                        <FundSummary fund={fund} key={fund.id} />
                    )
                })}
            </div>
        )
}

export default FundList
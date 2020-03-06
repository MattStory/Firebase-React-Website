import React from "react";
import moment from "moment";

const TransactionSummary = ({transaction}) => {
    return (
       <div>
           <span className={"title"}>{transaction.merchant}</span>
           <p>Amount: ${transaction.amount} {transaction.transactionDate}</p>
           <p className ="grey-text">{transaction.transactionDate}</p>
       </div>
    )
};

export default TransactionSummary
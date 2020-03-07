import React from "react";
import TransactionSummary from "./TransactionSummary";

const TransactionList = ({transactions}) => {
    console.log(transactions)
    return (
        <div className={"fund-list section"}>
            { transactions && transactions.map(transaction => {
                return (
                    <TransactionSummary transaction={transaction} key={transaction.id} />
                )
            })}
        </div>
    )
};

export default TransactionList
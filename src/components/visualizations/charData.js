export function convertJson(transactions) {
    let dataStr = JSON.stringify(formatTransactions(transactions));
    delete dataStr['createdAt'];
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    console.log(dataUri);
}

function formatTransactions(transactions) {
    let result = [];
    for (let k in transactions){
        if (transactions[k] instanceof Object){
            result.push({"Transaction Date":transactions[k].transactionDate,
                "Merchant":transactions[k].merchant,
                "Amount":transactions[k].amount})
        }
    }

    return result;
}

export default {convertJson};
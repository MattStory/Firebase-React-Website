/*
Credit to Danny Pule
Source: https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2
 */


function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += JSON.stringify(array[i][index]);
        }

        str += line + '\r\n';
    }

    return str;
}

function exportTransactionsToCSV(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
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


export function exportJSON(transactions) {
    let dataStr = JSON.stringify(formatTransactions(transactions));
    delete dataStr['createdAt'];
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    let exportFileDefaultName = 'transactions-' + date + '.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

export function exportCSV(transactions) {
    let formattedTransactions = formatTransactions(transactions);
    let headers = Object.keys(formattedTransactions[0]);
    //let transactions = JSON.parse(JSON.stringify(this.props.transactions));

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let exportFileName = 'transactions-' + date;

    exportTransactionsToCSV(headers, formattedTransactions, exportFileName)
}

export default {exportCSV, exportJSON};
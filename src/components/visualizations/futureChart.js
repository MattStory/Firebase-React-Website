import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";
// Include the fusioncharts library
import FusionCharts from "fusioncharts";
// Include the chart type
import Column2D from "fusioncharts/fusioncharts.charts";
// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts,Column2D,FusionTheme);
class FutureExpenditure extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // Get the current date
        var today = new Date();
        console.log(today.getDate());
        //store the date we are in
        var date = today.getDate();
        console.log(date);
        //store the month
        const month = (today.getMonth() + 1);
        console.log(month);
        //store the year
        var year = today.getFullYear();
        console.log(year);
        //store the Day
        var Day = today.getDay();
        console.log(Day);
        //full date stored of the sunday of last week to match the date in data base
        var lastSunday = (today.getDate() + (7 - 4));
        if (lastSunday < 0) {
            lastSunday = 30 - lastSunday;
        }
        console.log(lastSunday);
        if ((today.getMonth() + 1) < 10) {
            var todayDate = today.getFullYear() + "-" + "0" + (today.getMonth() + 1) + "-" + lastSunday;
        } else {
            var todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + lastSunday;
        }
        console.log(todayDate);
        // Algorithm to calculate the next weeks expenditure based on this months expentiture
        var first;
        var second;
        var thrid;
        var fourth;
        var fifth;
        var sixth;
        var seventh;
        var follow = 0;
        if (lastSunday > 31) {
            first = 1
            follow = 1;
        } else {
            first = lastSunday;
        }

        if ((lastSunday + 1) > 31) {
            second = ++follow;
        } else {
            second = lastSunday + 1;
        }


        if ((lastSunday + 2) > 31) {
            thrid = ++follow;
        } else {
            thrid = lastSunday + 2;
        }

        if ((lastSunday + 3) > 31) {
            fourth = ++follow;
        } else {
            fourth = lastSunday + 2;
        }

        if ((lastSunday + 4) > 31) {
            fifth = ++follow;
        } else {
            fifth = lastSunday + 3;
        }

        if ((lastSunday + 5) > 31) {
            sixth = ++follow;
        } else {
            sixth = lastSunday + 5;
        }
        if ((lastSunday + 6) > 31) {
            seventh = ++follow;
        } else {
            seventh = lastSunday + 5;
        }

        var byDay = [
            {
                label: first.toString(),
                value: 0,
            },
            {
                label: second.toString(),
                value: 0,
            },
            {
                label: thrid.toString(),
                value: 0,
            },
            {
                label: fourth.toString(),
                value: 0,
            },
            {
                label: fifth.toString(),
                value: 0,
            },
            {                
                label: sixth.toString(),
                value: 0,
            },
            {
                label: seventh.toString(),
                value: 0,
            },
        ]
        console.log("1")

        let total = 0;
        if (this.props.transactions) {
            lastSunday = lastSunday--;
            var trans = this.props.transactions;

            console.log(this.props.transactions)

            for (var i = 0; i < byDay.length; i++) {
                console.log(i)
                let comparedate;
                if ((today.getMonth() + 1) < 10) {
                    comparedate =  "0" + (today.getMonth() + 1) + "/" + ++lastSunday + "/" + today.getFullYear();
                } else {
                    comparedate =  (today.getMonth() + 1) + "/" + ++lastSunday + "/" + today.getFullYear();
                }
                console.log(comparedate);
                console.log(trans)
                trans.forEach(tran => {
                    console.log(tran.transactionDate)
                    if (comparedate === tran.transactionDate){
                        console.log("Here");
                        console.log(tran.amount);
                        total += parseInt(tran.amount);
                        console.log(total);
                    }
                })
                // for (var j = 0; i < trans.length; j++) {
                //     console.log(j)
                //     if (comparedate === trans[i]) {
                //         total = trans[i].amount;
                //     }
                // }
            }
        }
        var average = total / 7;
        console.log(total);

       for ( let i = 0; i < byDay.length && total > 0; i++) {
           var rand = Math.floor(Math.random() * 3)
        var thiss = total - rand;
        total = total - rand;
        byDay[i].value = thiss;
       }

        const chartConfigsLineD = {
            type: "line", // The chart type
            width: "700", // Width of the chart
            height: "400", // Height of the chart
            dataFormat: "json", // Data type
            dataSource: {
                // Chart Configuration
                chart: {
                    //Set the chart caption
                    caption: "Next Week's expected expenditure Based on last week",
                    //Set the chart subcaption
                    subCaption: "",
                    //Set the x-axis name
                    xAxisName: "Day",
                    //Set the y-axis name
                    yAxisName: "Dollars",
                    numberSuffix: "",
                    exportEnabled: "1",
                    //Set the theme for your chart
                    theme: "fusion"
                },
                // Chart Data
                data: byDay
            }
        };
        //---------------Week Expenditure ------------------

        // --------------Month Expenditure -----------------
        
        const bylala =[
            {
              label: "1",
              value: 0,
            },
            {
              label: "2",
              value: 0,
            },
            {
              label: "3",
              value: 0,
            },
            {
              label: "4",
              value: 0,
            },
            {
              label: "5",
              value: 0,
            },
            {
              label: "6",
              value: 0,
            },
            {
              label: "7",
              value: 0,
            },
            {
              label: "8",
              value: 0,
            },
            {
              label: "9",
              value: 0,
            },
            {
              label: "10",
              value: 0,
            },
            {
              label: "11",
              value: 0,
            },
            {
              label: "12",
              value: 0,
            },
            {
              label: "13",
              value: 0,
            },
            {
              label: "14",
              value: 0,
            },
            {
              label: "15",
              value: 0,
            },
            {
              label: "16",
              value: 0,
            },
            {
              label: "17",
              value: 0,
            },
            {
              label: "18",
              value: 0,
            },
            {
              label: "19",
              value: 0,
            },
            {
              label: "20",
              value: 0,
            },
            {
              label: "21",
              value: 0,
            },
            {
              label: "22",
              value: 0,
            },
            {
              label: "23",
              value: 0,
            },
            {
              label: "24",
              value: 0,
            },
            {
              label: "25",
              value: 0,
            },
            {
              label: "26",
              value: 0,
            },
            {
              label: "27",
              value: 0,
            },
            {
              label: "28",
              value: 0,
            },
            {
              label: "29",
              value: 0,
            },
            {
              label: "30",
              value: 0,
            },
            {
              label: "31",
              value: 0,
            },
          ];

          let total1 = 0;
          if (this.props.transactions) {
              var trans = this.props.transactions;
  
              console.log(this.props.transactions)

              
              let compareMonth = (today.getMonth());
              if (compareMonth < 10) {
                compareMonth =  "0" + compareMonth;
            } 
              
              for (var i = 0; i < bylala.length; i++) {
                  trans.forEach(tran => {
                      console.log(tran.transactionDate)
                      var transMonth = tran.transactionDate.split("/");
                      console.log (transMonth[0]);
                      console.log(compareMonth);
                      if ((transMonth[0]) === compareMonth){
                          console.log("Here");
                          console.log(tran.amount);
                          total1 += parseInt(tran.amount);
                          console.log(total);
                      }
                  })
                  // for (var j = 0; i < trans.length; j++) {
                  //     console.log(j)
                  //     if (comparedate === trans[i]) {
                  //         total = trans[i].amount;
                  //     }
                  // }
              }
          }
          var average = total1 / 7;
          console.log(total1);
  
         for ( let i = 0; i < byDay.length && total1 > 0; i++) {
             var rand = Math.floor(Math.random() * 3)
          var thiss = total1 - rand;
          total1 = total1 - rand;
          bylala[i].value = thiss;
         }
  
          const chartConfigsLineM = {
              type: "line", // The chart type
              width: "700", // Width of the chart
              height: "400", // Height of the chart
              dataFormat: "json", // Data type
              dataSource: {
                  // Chart Configuration
                  chart: {
                      //Set the chart caption
                      caption: "Next Month's expected expenditure Based on last Month",
                      //Set the chart subcaption
                      subCaption: "",
                      //Set the x-axis name
                      xAxisName: "Day",
                      //Set the y-axis name
                      yAxisName: "Dollars",
                      numberSuffix: "",
                      exportEnabled: "1",
                      //Set the theme for your chart
                      theme: "fusion"
                  },
                  // Chart Data
                      data: bylala            
                  }
          };


        // ------------- Month Expenditure -----------------



        return (
            <div>
                <div className="visualizations">
                    <div className="chart">
                        <ReactFC {...chartConfigsLineD} />);
                    </div>
                    <div className="chart">
                        <ReactFC {...chartConfigsLineM} />);
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        transactions: state.firestore.ordered.transactions,
        auth: state.firebase.auth
    };
};
export default compose(
    connect(mapStateToProps),
    firestoreConnect(props => {
        if (typeof props.auth.uid != "undefined") {
            return [
                {
                    collection: 'transactions',
                    doc: props.auth.uid,
                    subcollections: [{collection: 'userTransactions'}],
                    storeAs: 'transactions'
                }
            ]
        } else {
            return []
        }
    })
)(FutureExpenditure)
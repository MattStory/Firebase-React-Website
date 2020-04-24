// STEP 1 - Include Dependencies
// Include react
import React,{Component, useState}from "react";
import ReactDOM from "react-dom";
import {Link} from 'react-router-dom'

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Column2D from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

import {connect} from 'react-redux';
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from 'redux'
import './chart.css';
// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);



// STEP 4 - Creating the DOM element to pass the react-fusioncharts component
class Chart extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      
    }
  }
  
  render() {
    // Pie Chart
    const amount = this.props.transactions;
    let myMap = new Map();
    let myMap2 = new Map();
    const chartDataPie =[];
    // Array of months
    var month = new Array();
    month[0] = "months";
    month[1] = "January";
    month[2] = "February";
    month[3] = "March";
    month[4] = "April";
    month[5] = "May";
    month[6] = "June";
    month[7] = "July";
    month[8] = "August";
    month[9] = "September";
    month[10] = "October";
    month[11] = "November";
    month[12] = "December";

    const byDay =[
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

    const byMonth = [
      {
        label: "January",
        value: 0,
      },
      {
        label: "Feburary",
        value: 0,
      },
      {
        label: "March",
        value: 0,
      },
      {
        label: "April",
        value: 0,
      },
      {
        label: "May",
        value: 0,
      },
      {
        label: "June",
        value: 0,
      },
      {
        label: "July",
        value: 0,
      },
      {
        label: "August",
        value: 0,
      },
      {
        label: "September",
        value: 0,
      },
      {
        label: "October",
        value: 0,
      },
      {
        label: "November",
        value: 0,
      },
      {
        label: "December",
        value: 0,
      },

    ];

    const byWeek = [
      {
        label: "Week1",
        value: 0,
      },
      {
        label: "Week2",
        value: 0,
      },
      {
        label: "Week3",
        value: 0,
      },
      {
        label: "Week4",
        value: 0,
      },
    ];



    var currentDate = new Date();
    var current_Month = currentDate.getMonth();
    var current_year = currentDate.getFullYear();
    console.log(current_year);
    if(amount != undefined) {
      console.log(amount)

      

      for (let i = 0; i < amount.length; i++) {
        //console.log(amount[i].amount);
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //console.log(this.props.transactions[i].transactionDate.getDay())

        // For This Months Spending by day
        let temp = this.props.transactions[i].transactionDate;
        console.log(temp);
        var dt = temp.split("/");
        console.log(dt);
        if(dt[0]!=undefined){
        if (dt[0].charAt(0) == 0) {
          dt[0] = dt[0].charAt(1);
        }
      }
        var date_format  = month[dt[0]] + " " + dt[1]+ ", " + dt[2];
        var date = new Date(date_format.toString());
        var day = date.getDay();
        // console.log(day, month[current_Month + 1]);
        // console.log(day, month[dt[1]]);
        console.log(dt[0]);  //dt 0 = month
        console.log(dt[1]);  //dt 1 = day
        console.log(dt[2]);  //dt 2 = year
        //console.log(byDay[dt[2]]);
        if (month[current_Month + 1] == month[dt[0]] ) {
          byDay[dt[1] - 1].value += parseInt(amount[i].amount);
        }

        if (current_year == dt[2]) {
         byMonth[date.getMonth()].value += parseInt(amount[i].amount); 
        }
        console.log(dt[1]);
        if (month[current_Month + 1] == month[dt[0]] ) {
        if (dt[1] - 1 < 8) {
          byWeek[0].value += parseInt(amount[i].amount);
        } else if (dt[1] - 1 > 8 && dt[1] - 1 < 15) {
          byWeek[1].value += parseInt(amount[i].amount);
        } else if (dt[1] - 1 > 15 && dt[1] - 1 < 22) {
          byWeek[2].value += parseInt(amount[i].amount);
        } else {
          byWeek[3].value += parseInt(amount[i].amount);
        } 
      }
    }
   

    }
    if (this.props.transactions != undefined){
      // var dt = new Date("December 25, 1995 ");
      // console.log(dt.getDay());
      // let temp = this.props.transactions[0].transactionDate;
      // console.log(temp);
      // var dt = temp.split("-");
      // console.log(dt);
      // // console.log(dt[1]);
      // // console.log(dt[1].charAt(0));
      // if (dt[1].charAt(0) == 0) {
      //     dt[1] = dt[1].charAt(1);
      //     //console.log(dt);
      // }

      // var date_format  = month[dt[1]] + " " + dt[2]+ ", " + dt[0];
      // console.log(date_format);
      // var date = new Date(date_format.toString());
      // var day = date.getDay();
      // console.log(day);

      // byDay[day].value += parseInt(amount[0].amount);
      // console.log(byDay[day].label , byDay[day].value);
      //console.log(month[3]);
      //console.log(this.props.transactions[0].transactionDate);
    }


// STEP 3 - Creating the JSON object to store the chart configurations
const chartConfigsPie = {
  type: "pie2d", // The chart type
  width: "700", // Width of the chart
  height: "400", // Height of the chart
  dataFormat: "json", // Data type
  dataSource: {
    // Chart Configuration
    chart: {
      //Set the chart caption
      caption: "Spending by Category",
      //Set the chart subcaption
      //Set the x-axis name
      xAxisName: "Spending Category",
      //Set the y-axis name
      yAxisName: "Dollars ",
      numberSuffix: "",
      exportEnabled: "1",
      //Set the theme for your chart
      theme: "fusion"
    },
    // Chart Data
    data: chartDataPie
  }
};

const chartConfigsLineD = {
  type: "line", // The chart type
  width: "700", // Width of the chart
  height: "400", // Height of the chart
  dataFormat: "json", // Data type
  dataSource: {
    // Chart Configuration
    chart: {
      //Set the chart caption
      caption: "This Months Spending by Day",
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
    data:byDay
  }
};

const chartConfigsLineW = {
  type: "line", // The chart type
  width: "700", // Width of the chart
  height: "400", // Height of the chart
  dataFormat: "json", // Data type
  dataSource: {
    // Chart Configuration
    chart: {
      //Set the chart caption
      caption: "This Months Spending by Week",
      //Set the chart subcaption
      subCaption: "",
      //Set the x-axis name
      xAxisName: "Week",
      //Set the y-axis name
      yAxisName: "Dollars",
      numberSuffix: "",
      exportEnabled: "1",
      //Set the theme for your chart
      theme: "fusion"
    },
    // Chart Data
    data: byWeek
  }
};

const chartConfigsLineM = {
  type: "line", // The chart type
  width: "700", // Width of the chart
  height: "400", // Height of the chart
  dataFormat: "json", // Data type
  dataSource: {
    // Chart Configuration
    chart: {
      //Set the chart caption
      caption: "This Years Spending by Month",
      //Set the chart subcaption
      subCaption: "",
      //Set the x-axis name
      xAxisName: "Month",
      //Set the y-axis name
      yAxisName: "Dollars",
      numberSuffix: "",
      exportEnabled: "1",
      //Set the theme for your chart
      theme: "fusion"
    },
    // Chart Data
    data: byMonth
  }
};
    
    return (
      <div className = "visualizations2">
    <div className ="chart2">
    <ReactFC {...chartConfigsLineD} />);
    </div>
    <div className ="chart2">
    <ReactFC {...chartConfigsLineW} />);
    </div>
    <div className ="chart2">
    <ReactFC {...chartConfigsLineM} />);
    </div>
    <div className = "chartbtn">
    <Link to='/pastVisualizations' className ='btn btn -floating green lighten-1'>Past Spending</Link>
    </div>
    <div className = "chartbtn">
    <Link to={"/future"} className={"btn green lighten-1 center mt"}>Spending Forcast</Link>
    </div>
    </div>
    )
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
)(Chart)
// STEP 1 - Include Dependencies
// Include react
import React from "react";
import ReactDOM from "react-dom";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Column2D from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import "./chart.css";
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

// STEP 2 - Chart Data
const chartDataPie = [
  {
    label: "Venezuela",
    value: "290"
  },
  {
    label: "Saudi",
    value: "260"
  },
  {
    label: "Canada",
    value: "180"
  },
  {
    label: "Iran",
    value: "140"
  },
  {
    label: "Russia",
    value: "115"
  },
  {
    label: "UAE",
    value: "100"
  },
  {
    label: "US",
    value: "30"
  },
  {
    label: "China",
    value: "30"
  }
];

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
      caption: "This Months Spending by Category",
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
    data: chartDataPie
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
    data: chartDataPie
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
      caption: "This Months Spending by Month",
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
    data: chartDataPie
  }
};

// STEP 4 - Creating the DOM element to pass the react-fusioncharts component
class Chart extends React.Component {
  render() {
    console.log(this.props.transactions);
    return (
      <div className = "visualizations">
      <div className = "chart">
    <ReactFC {...chartConfigsPie} />);
    </div>
    <div className ="chart">
    <ReactFC {...chartConfigsLineD} />);
    </div>
    <div className ="chart">
    <ReactFC {...chartConfigsLineW} />);
    </div>
    <div className ="chart">
    <ReactFC {...chartConfigsLineM} />);
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
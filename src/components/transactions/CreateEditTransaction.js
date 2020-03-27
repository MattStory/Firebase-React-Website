import React, {Component, withRouter} from "react";
import {connect} from "react-redux";
import {createTransaction} from "../../store/actions/transactionActions"
import Select from 'react-select';
import {Link} from "react-router-dom";

const transactionCategory = [
    { value: "Dining", label: "Dining"},
    { value: "Travel", label: "Travel"},
    { value: "Tuition", label: "Tuition"},
    { value: "Grocery", label: "Grocery"},
    { value: "Bar & Coffee Shop", label: "Bar & Coffee Shop"},
    { value: "Fee", label: "Fee"}];

class CreateEditTransaction extends Component {

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.transactionCategory === undefined)
            alert("Please select a category!");
        else
            this.props.createTransaction(this.state, this.props.history);
    };

    handleCategoryChange = (e) => {
        this.setState({
            transactionCategory: e.value
        })
    }

    render() {
        return (
            <div className={"container"}>
                <form className={"white"} onSubmit={this.handleSubmit}>
                    <h5 className={"grey-text text-darken-3"}>Create New Transaction</h5>
                    <div className={"input-field"}>
                        <input type={"number"} id={'amount'} required={true} onChange={this.handleChange}/>
                        <label htmlFor={'amount'}>Amount</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"date"} id={'transactionDate'} required={true} onChange={this.handleChange}/>
                        <label htmlFor={'transactionDate'}>Date</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"text"} id={'merchant'} required={true} onChange={this.handleChange}/>
                        <label htmlFor={'merchant'}>Merchant</label>
                    </div>
                    <div className={"input-field"}>
                        <Select
                            className={"transactionCategory"}
                            name={"transactionCategory"}
                            placeholder={"Category"}
                            options={transactionCategory}
                            onChange={this.handleCategoryChange}
                        />
                    </div>
                    <div className={"input-field"}>
                        <button className={"btn green lighten-1"}>Create</button>
                        <Link to={"/transactions"} className={"btn grey darken-3 white-text"} style={{"marginLeft": "2%"}}>Close</Link>
                    </div>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        createTransaction: (transaction, history) => dispatch(createTransaction(transaction, history))
    }
};

export default connect(null, mapDispatchToProps)(CreateEditTransaction)
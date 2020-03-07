import React, {Component, withRouter} from "react";
import {connect} from "react-redux";
import {createTransaction} from "../../store/actions/transactionActions"
import Select from 'react-select';

class CreateEditTransaction extends Component {

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.createTransaction(this.state, this.props.history);
    };

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
                        <button className={"btn green lighten-1"}>Create</button>
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
import React, {Component} from "react";
import {connect} from "react-redux";
import {createFund} from "../../store/actions/fundActions";
import './CreateFund.css'
import Select from 'react-select';
import {Redirect} from 'react-router-dom'

class CreateFund extends Component {
    state = {
        nickname: '',
        balance: 0,
        lowBalanceLimit: 0,
        largeTransactionLimit: 0,
        spendingLimit: 0,
        fundType: 'PayPal'
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSelectChange = (e) => {
        this.setState({
            fundType: e.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.createFund(this.state);
        alert("fund created");
        //this.props.history.push('/financials')
    }

    render() {
        return (
            <div className={"container"}>
                <form className={"white"} onSubmit={this.handleSubmit}>
                    <h5 className="grey-text text-darken-3">Create a New Fund</h5>
                    <div className={"input-field"}>
                        <input type={"text"} id={'nickname'} onChange={this.handleChange}/>
                        <label htmlFor={"nickname"}>Nickname</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"number"} id={'balance'} onChange={this.handleChange} required/>
                        <label htmlFor={"balance"}>Balance</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"number"} id={'lowBalanceLimit'} onChange={this.handleChange}/>
                        <label htmlFor={"lowBalanceLimit"}>Low Balance Limit</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"text"} id={'largeTransactionLimit'} onChange={this.handleChange}/>
                        <label htmlFor={"largeTransactionLimit"}>Large Transaction Limit</label>
                    </div>
                    <div className={"input-field"}>
                        <input type={"text"} id={'spendingLimit'} onChange={this.handleChange}/>
                        <label htmlFor={"spendingLimit"}>Spending Limit</label>
                    </div>
                    <div className={"input-field"}>
                        <Select
                            className={"fundtype"}
                            name={"fundtype"}
                            placeholder={"Fund Type"}
                            options = {[
                                { value: 'PayPal', label: 'PayPal'},
                                { value: 'Dining Dollar', label: 'Dining Dollar'},
                                { value: 'Boiler Express', label: 'Boiler Express'},
                                { value: 'Financial Aid', label: 'Financial Aid'},
                                { value: 'Bank', label: 'Bank'}
                            ]}
                            onChange={this.handleSelectChange}
                            defaultValue={{ value: 'paypal', label: 'PayPal'}}
                        />
                    </div>
                    <div className="input-field">
                        <div className="row">
                            <div className="input-field col s6">
                                <button className="btn green lighten-1">Create</button>
                            </div>
                            <div className="input-field col s6">
                                <button className="btn white black-text lighten-1" onClick={this.props.closePopup}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}




const mapDispatchToProps = (dispatch) => {
    return{
        createFund: (fund) => dispatch(createFund(fund))
    }
}

export default connect(null, mapDispatchToProps)(CreateFund)
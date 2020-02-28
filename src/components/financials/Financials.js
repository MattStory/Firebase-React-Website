import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from "react-router-dom";
import {signUp} from "../../store/actions/authActions";
import './Financials.css'
import FundList from './FundList'
import CreateFund from "./CreateFund";
import {editFund} from "../../store/actions/fundActions";
import Select from "react-select";

class Financials extends Component{
    constructor(props) {
        super(props);
        this.state = { showCreateFund: false,
            showEditFund: false};
    }

    toggleCreateFund() {
        this.setState({
            showCreateFund: !this.state.showCreateFund
        })
    }

    // handleSet = (e) => {
    //     e.preventDefault();
    //     this.props.setFund()
    // }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleEdit = (e) => {
        e.preventDefault();
        this.props.editFund(this.state)
    }

    handleDel = (e) => {
        console.log(e)
        e.preventDefault();
        this.props.delFund(this.state)
    }

    handleSelectChange = (e) => {
        console.log(e.value)
        this.setState({
            fundSelected: e.value
        })
    }

    handleEditSelectChange = (e) => {
        this.setState({
            fundType: e.value
        })
    }

    render() {
        const {auth} =this.props;
        if(!auth.uid) return <Redirect to= '/signin'/>
        // console.log(this.props);
        // console.log(this.state);
        // console.log('render');
        //f(funds) return <Redirect to= '/signin'/>;
        const funds = this.props.funds;
        console.log(funds)

        let fundOptions = [];

        let userFunds = []

        if (this.props.funds != null){
            

            funds.forEach(f => {
                if (f.uid === auth.uid){
                    userFunds.push(f);
                }
                    })
        }

        fundOptions = userFunds.map(v => ({
            label: v.fundType + ': ' + v.nickname,
            value: v.id
        }))

        console.log(userFunds)

        // console.log(funds);
        return(
            <div className={"container mt-10"}>
                <div className ="card z-depth-0">
                    {this.state.showCreateFund
                        ?
                        <CreateFund
                            closePopup={this.toggleCreateFund.bind(this)}
                        />
                        :
                        <div className={"container center"}>
                            <button className="btn green lighten-1 center mt-10 mb-10" onClick={this.toggleCreateFund.bind(this)}>New Financial Account</button>
                        </div>
                    }
                </div>
                <div className={"row"}>
                    <div className={"col s12 m6"}>
                        {userFunds.length === 0
                            ?
                            null
                            :
                            <FundList funds = {userFunds}/>
                        }
                    </div>
                    <div className={"col s12 m6"}>
                        {userFunds.length === 0
                            ?
                            null
                            :
                            <div className={"card z-depth-0 fund-operation"}>
                                <div className={"card-content grey-text text-darken-3"}>
                                    <Select
                                        className={"funds"}
                                        name={"funds"}
                                        onChange={this.handleSelectChange}
                                        options={fundOptions}
                                    />
                                    <div className={"container"}>
                                        <form className={"white"} onSubmit={this.handleSubmit}>
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
                                                    onChange={this.handleEditSelectChange}
                                                    defaultValue={{ value: 'paypal', label: 'PayPal'}}
                                                />
                                            </div>
                                        </form>
                                        <button className={"btn green lighten-1"} onClick={this.handleEdit}>Edit Account</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    // console.log(state);
    // if(typeof state.firestore.ordered.funds == 'undefined'){
    //     console.log('invalid');
    //     return {};
    // }
    // else{
    //     console.log('valid');
    //     return {
    //         funds: state.firestore.ordered.funds
    //     };
    // }
    return {
        funds: state.firestore.ordered.funds,
        auth: state.firebase.auth
    };
};

const mapDispatchToProps=(dispatch)=>{
    return{
        editFund: (fund)=> dispatch(editFund(fund))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        {collection: 'funds'}
    ])
)(Financials)
import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router-dom'
import FridgeContainer from '../Containers/FridgeContainer'
import ShoppinglistContainer from '../Containers/ShoppinglistContainer'
import FridgeCard from './FridgeCard'
import ShoppingCard from './ShoppingCard'

class FamilyComponent extends React.Component {

    state = {
        fridges: [],
        shoppinglists: [],
        familyId: null,
        updatedFridge: null
    }

    componentDidMount(){
        if(this.props.user){
            let userFamily = this.props.user.userFamilies[0].familyId
            fetch(`http://localhost:3000/families/${userFamily}`,{
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            })
            .then(r=>r.json())
            .then(family => {
                this.setState({fridges: family.fridges, shoppinglists: family.shoppinglists, familyId: userFamily})
            })
            .catch(console.log)
        }
    }

    getFridge = (fridgeId) => {
        fetch(`http://localhost:3000/families/${this.state.familyId}/fridges/${fridgeId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            }
        })
        .then(r=>r.json())
        .then(returnedFridge => {
            this.setState({updatedFridge: returnedFridge})
        })
    }


    arrayOfFridgeCards = () => {
        return this.state.fridges.map(fridge => <FridgeCard fridge={fridge} familyId={this.state.familyId} key={fridge.id} getFridge={this.getFridge} />)
    }

    arrayOfShoppingCards = () => {
        return this.state.shoppinglists.map(shoppinglist => <ShoppingCard shoppinglist={shoppinglist} familyId={this.state.familyId} key={shoppinglist.id} />)
    }

    render(){
        return(
            <>
                {/* <h2>Family component (inside family - choice of fridges or shopping list)</h2> */}
                <Switch>
                    <Route path="/families/fridges/:id" render={(routerProps)=>{
                        const fridgeId = routerProps.match.params.id
                        let foundFridge
                        if (this.state.updatedFridge) {
                            foundFridge = this.state.updatedFridge
                        } else {
                            foundFridge = this.state.fridges.find(fridge => fridge.id === parseInt(fridgeId))
                        }
                        let fridgeComponent
                        if(foundFridge){
                            fridgeComponent = <FridgeContainer fridge={foundFridge} familyId={this.state.familyId} key={foundFridge.id} />
                        } else {
                            fridgeComponent = <h1>Loading</h1>
                        }
                        return fridgeComponent
                    }} />
                    <Route path="/families/fridges" render={()=>{
                        return(
                            <div className="fridgeCards">
                                {this.arrayOfFridgeCards()}
                            </div>
                        )
                    }} />
                    <Route path="/families/shopping/:id" render={(routerProps)=>{
                        const shoppinglistId = routerProps.match.params.id
                        const foundShoppinglist = this.state.shoppinglists.find(shoppinglist => shoppinglist.id === parseInt(shoppinglistId))
                        let shoppingComponent
                        if(foundShoppinglist){
                            shoppingComponent = <ShoppinglistContainer shoppinglist={foundShoppinglist} familyId={this.state.familyId} key={foundShoppinglist.id} />
                        } else {
                            shoppingComponent = <h1>Loading</h1>
                        }
                        return shoppingComponent
                    }} />
                    <Route path="/families/shopping" render={()=>{
                        return(
                            <div className="shoppingCards">
                                {this.arrayOfShoppingCards()}
                            </div>
                        )
                    }} />
                </Switch>
            </>
        )
    }
}

function msp(state){
    return{
        user: state.user
    }
}

export default withRouter(connect(msp, null)(FamilyComponent))
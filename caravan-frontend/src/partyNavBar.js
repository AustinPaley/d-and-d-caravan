import React from 'react';

class PartyNavBar extends React.Component{
  state={
    numberOfPendingObjectsInCart: 0
  }

  componentDidMount(){

  }

  componentDidUpdate(prevProps){
    // debugger
    if ((this.props.pendingItemsInCart !== prevProps.pendingItemsInCart) || (this.props.pendingSpellsInCart !== prevProps.pendingSpellsInCart)){
      // debugger
      this.itemInCartCalculator()
    }
  }

  itemInCartCalculator = () => {
    var totalNumberOfObjectsInCart = 0

    if (this.props.pendingItemsInCart.length > 0){
      this.props.pendingItemsInCart.forEach(item => {
        totalNumberOfObjectsInCart += item.number_in_cart
      })
    }

    if (this.props.pendingSpellsInCart.length > 0){
      this.props.pendingSpellsInCart.forEach(spell => {
        totalNumberOfObjectsInCart += spell.number_in_cart
      })
    }

    this.setState({
      numberOfPendingObjectsInCart: totalNumberOfObjectsInCart
    })
  }

  render(){
    // console.log("navBar", this.props)
    return (
      <div className="nav-bar">
        <div>Caravan Shoppes</div>
        <div onClick={() => this.props.bagOfHoldingShown()}>Bag of Holding</div>
        <div>World Map</div>
        <div>Quest Board</div>
        <div onClick={() => this.props.currentCartShown()}>
          Current Cart
          <span className="number-of-items-in-cart-nav" style={this.state.numberOfPendingObjectsInCart > 0 ? {display: "block"} : {display: "none"}}>{this.state.numberOfPendingObjectsInCart}</span>
        </div>
      </div>
    );
  }
}

export default PartyNavBar;

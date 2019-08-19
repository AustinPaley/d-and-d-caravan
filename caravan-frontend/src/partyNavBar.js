import React from 'react';

class PartyNavBar extends React.Component{
  state={
    default: ""
  }

  render(){
    console.log(this.props)
    return (
      <div className="nav-bar">
        <div>Caravan Shoppes</div>
        <div onClick={() => this.props.bagOfHoldingShown()}>Bag of Holding</div>
        <div>World Map</div>
        <div>Quest Board</div>
        <div onClick={() => this.props.currentCartShown()}>
          Current Cart
          <span className="number-of-items-in-cart-nav" style={this.props.numberOfPendingItemsInCart > 0 ? {display: "block"} : {display: "none"}}>{this.props.numberOfPendingItemsInCart}</span>
        </div>
      </div>
    );
  }
}

export default PartyNavBar;

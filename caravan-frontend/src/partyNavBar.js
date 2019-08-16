import React from 'react';

class PartyNavBar extends React.Component{
  state={
    default: ""
  }

  render(){
    return (
      <div className="nav-bar">
        <div>Caravan Shoppes</div>
        <div onClick={() => this.props.bagOfHoldingShown()}>Bag of Holding</div>
        <div>World Map</div>
        <div>Quest Board</div>
        <div>Current Cart</div>
      </div>
    );
  }
}

export default PartyNavBar;

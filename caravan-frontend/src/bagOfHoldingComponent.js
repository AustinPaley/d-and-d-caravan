import React from 'react';
import ObjectsList from './bagOfHoldingComponents/objectsList.js'

class BagofHoldingComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      items: [],
      spells: []
    }
  }

  componentDidMount(){
      fetch("http://localhost:3000/bagofholdings/1", {
        method: "GET"
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          items: res.bag.items,
          spells: res.bag.spells
        })
      })
  }


  render(){
    return(
      <div>
        {
          this.state.items.length > 0 || this.state.spells.length > 0 ?
            <ObjectsList items={this.state.items} spells={this.state.spells}/>
          :
          null
        }
      </div>
    )
  }
}

export default BagofHoldingComponent;

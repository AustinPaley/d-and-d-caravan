import React from 'react';

class CurrentCart extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      default: ""
    }
  }

  componentDidMount(){

  }

  render(){
    return(
      <div style={this.props.currentCartShown === true ? {display: "block"} : {display: "none"}}>
        <p>CART SHOWN</p>
      </div>
    )
  }
}

export default CurrentCart;

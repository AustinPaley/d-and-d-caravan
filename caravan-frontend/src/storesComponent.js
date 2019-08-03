import React from 'react';

class StoresComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      default: "default"
    }
  }

  render(){
    return(
      <div>
        <p>In</p>
      </div>
    )
  }
}

export default StoresComponent;

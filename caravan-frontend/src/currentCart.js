import React, {Fragment} from 'react';
import PlusImage from './images/plus-square-regular.svg';
import MinusImage from './images/minus-square-regular.svg';

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
      <div>
        <div className="parchmentTop">
        <p className="shop-x-button" onClick={() => this.props.currentCartShown()}>X</p>
        <div className="parchment"></div>
        <div className="parchmentBody">
          <table className="itemListTable">
            <thead>
              <tr>
                <th className="sticky-header">Item Name</th><th className="sticky-header">Item Type</th><th className="sticky-header">Cost</th><th className="sticky-header">Stock</th><th className="sticky-header">Add/Remove</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }
}

export default CurrentCart;

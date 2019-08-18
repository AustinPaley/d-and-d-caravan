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

  render(){
    return(
      <div className="bag-or-cart">
        <div className="parchmentTop">
        <p className="shop-x-button" onClick={() => this.props.currentCartShown()}>X</p>
        <div className="parchment"></div>
        <div className="parchmentBody">
          <table className="itemListTable">
            <thead>
              <tr>
                <th className="sticky-header">Item Name</th><th className="sticky-header">Item/Spell Type</th><th className="sticky-header">Stock</th><th className="sticky-header">Remove</th>
              </tr>
            </thead>
            <tbody>
              {this.props.pendingItemsInCart.sort((a,b) => a.cost-b.cost).map(item => {
                return (
                  <Fragment key={`item-number-${item.id}`}>
                  <tr>
                    <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.current_stock}</td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.objectToCartRemove(item, "item")}/></td>
                  </tr>
                  </Fragment>
                )
              })
              }
              {this.props.pendingSpellsInCart.sort((a,b) => a.level-b.level).map(spell => {
                return (
                  <Fragment key={`item-number-${spell.id}`}>
                  <tr>
                    <td>{spell.name}</td><td>{spell.school}</td><td>{spell.current_stock}</td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.objectToCartRemove(spell, "spell")}/></td>
                  </tr>
                  </Fragment>
                )
              })
              }
            </tbody>
          </table>
        </div>
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }
}

export default CurrentCart;

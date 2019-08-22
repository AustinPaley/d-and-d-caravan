import React, {Fragment} from 'react';
import MinusImage from './images/minus-square-regular.svg';
import Negotiate from './images/negotiate.svg'

class CurrentCart extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      itemsList: [],
      spellsList: []
    }
  }

  componentDidMount(){
    this.priceConverterHelper()
    this.spellConverterHelper()
  }

  componentDidUpdate(prevProps){
    if (this.props.pendingItemsInCart !== prevProps.pendingItemsInCart){
      this.priceConverterHelper()
    }

    if (this.props.pendingSpellsInCart !== prevProps.pendingSpellsInCart){
      this.spellConverterHelper()
    }
  }

  priceConverterHelper = () => {
    var newItemArray = []
    this.props.pendingItemsInCart.forEach(item => {
      var itemCost = parseFloat(item.cost)
      if (itemCost / 1 >= 1){
        var gold = itemCost / 1
        itemCost = gold.toString() + "g"
      }

      else if (itemCost / .1 >= 1){
        var silver = itemCost / .1
        itemCost = silver.toString() + "s"
      }

      else if (itemCost / .01 >= 1){
        var copper = itemCost / .01
        itemCost = copper.toString() + "c"
      }
      item["render_cost"] = itemCost
      newItemArray.push(item)
    })

    this.setState({
      itemsList: newItemArray
    })
  }

  spellConverterHelper = () => {
    var newSpellArray = []
    this.props.pendingSpellsInCart.forEach(spell => {
      if (spell.level === 0){
        spell["render_level"] = "Cantrip"
        spell["render_cost"] = spell.cost + "g"
      }
      else {
        spell["render_level"] = spell.level
        spell["render_cost"] = spell.cost + "g"
      }
      spell["max_stock"] = spell.current_stock
      newSpellArray.push(spell)
    })

    this.setState({
      spellsList: newSpellArray
    })
  }

  render(){
    console.log("cart", this.props.pendingItemsInCart)
    return(
      <div className="bag-or-cart" style={this.props.currentCartShownStatus === true ? {display: "block"} : {display: "none"}}>
        <div className="parchmentTop">
        <p className="shop-x-button" onClick={() => this.props.currentCartShown()}>X</p>
        <div className="parchment"></div>
        <div className="parchmentBody">
          <table className="itemListTable">
            <thead>
              <tr>
                <th className="sticky-header">Item Name</th><th className="sticky-header">Item/Spell Type</th><th className="sticky-header">Stock</th><th className="sticky-header">Price</th><th className="sticky-header">Negotiate</th><th className="sticky-header">Remove</th>
              </tr>
            </thead>
            <tbody>
              {this.state.itemsList.sort((a,b) => a.cost-b.cost).map(item => {
                return (
                  <Fragment key={`item-number-${item.id}`}>
                  <tr>
                    <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.current_stock}</td><td>{item.render_cost}</td><td><img className="negotiate-icon" src={Negotiate} alt="negotiate-image" /></td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.objectToCartRemove(item, "item")}/></td>
                  </tr>
                  </Fragment>
                )
              })
              }
              {this.state.spellsList.sort((a,b) => a.level-b.level).map(spell => {
                return (
                  <Fragment key={`item-number-${spell.id}`}>
                  <tr>
                    <td>{spell.name}</td><td>{spell.school}</td><td>{spell.current_stock}</td><td>{spell.render_cost}</td><td><img className="negotiate-icon" src={Negotiate} alt="negotiate-image" /></td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.objectToCartRemove(spell, "spell")}/></td>
                  </tr>
                  </Fragment>
                )
              })
              }
            </tbody>
          </table>
        </div>
        <div className="changes-button-holder">
          <p className="cart-save-changes-button" onClick={() => this.props.saveItems(this.state)}>Checkout</p>
          <p className="cart-cancel-changes-button" onClick={() => this.moneyRefreshHandler()}>Empty<br/>Cart</p>
        </div>
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }
}

export default CurrentCart;

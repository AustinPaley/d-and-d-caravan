import React, {Fragment} from 'react';
import MinusImage from './images/minus-square-regular.svg';
import Negotiate from './images/negotiate.svg'
import NegotiatedObject from './cartComponents/negotiatedObject.js'

// TODO - MAKE A WARNING MESSAGE SO THAT WHEN SOMEONE TRIES TO SAVE WITH
// NO ITEMS IN CART IT TELLS USERS TO SAVE ITEMS TO THEIR CART FIRST

class CurrentCart extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      itemsList: [],
      spellsList: [],
      displayedCost: 0,
      currentlyNegotiatedObject: "",
      loading: false
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

    if (((this.props.pendingItemsInCart.length + this.props.pendingSpellsInCart.length) === 0) && ((prevProps.pendingItemsInCart.length + prevProps.pendingSpellsInCart.length) >= 1)){
      this.setState({
        displayedCost: 0
      })
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
    }, () => {this.totalCostHelper()})
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
      // spell["max_stock"] = spell.current_stock
      newSpellArray.push(spell)
    })

    this.setState({
      spellsList: newSpellArray
    }, () => {this.totalCostHelper()})
  }

  saveItems = (bagContents) => {
    var cartCost = 0
    var cartCostString = ""
    if (bagContents.spellsList.length !== 0){
      bagContents.spellsList.forEach(item => cartCost += ((item.cost * item.number_in_cart) * 100) / 100)
    }
    if (bagContents.itemsList.length !== 0){
      bagContents.itemsList.forEach(item => cartCost += ((item.cost * item.number_in_cart) * 100) / 100)
    }

    cartCostString = ((cartCost * 100) /100).toFixed(2)
    this.setState({
      loading: true
    }, () => {
      fetch("http://austins-macbook-air-2.local/bagofholdings/1", {
        method: "PUT",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({"items": bagContents.itemsList, "spells": bagContents.spellsList, "money": cartCostString, "type":"purchase"})
      })
      .then(res => res.json())
      .then(res => {
        if (res.status === 406){
          this.setState({
            loading: false
          }, () => {
            alert(res.error)
          })
        }
        else {
          this.moneyParser(res.bag.money)
        }
      })
    })
  }

  moneyParser = (money) => {
    var moneyArray = money.split(".")
    if (moneyArray.length === 1){
      moneyArray.push("00")
    }
    var currentGold = 0
    var currentSilver = 0
    var currentCopper = 0
    for (var i=0; i < 4; i++){
      if (i === 1){
        currentGold = parseInt(moneyArray[0])
      }

      if (i === 2){
        currentSilver = parseInt(moneyArray[1][0])
      }

      if (i === 3){
        currentCopper = parseInt(moneyArray[1][1])
      }
    }

    this.setState({
      loading: false,
      displayedCost: 0
    }, () => {
      this.props.clearCart()
      alert("Item(s) purchased and added to Bag of Holding!")
    })
    this.props.moneyHoister(money, currentGold, currentSilver, currentCopper)
  }

  totalCostHelper = () => {
    var totalCost = 0
    var gold = ""
    var silver = ""
    var copper = ""
    var total = ""
    var totalObjects = [...this.state.itemsList, this.state.spellsList].flat()
    if (totalObjects.length > 0){
      totalObjects.forEach(item => {
        var itemCost = parseFloat(item.cost * item.number_in_cart)
        totalCost += itemCost
      })
    }

    if ((totalCost > 0) && (totalCost.toString().split(".")[1] !== undefined) && (totalCost.toString().split(".")[1][1] !== undefined)){
      gold = totalCost.toString().split(".")[0] + "g"
      silver = totalCost.toString().split(".")[1][0] + "s"
      copper = totalCost.toString().split(".")[1][1] + "c"
      total = gold + " " + silver + " " + copper
      this.setState({
        displayedCost: total
      })
    }
    else if ((totalCost > 0) && (totalCost.toString().split(".")[1] !== undefined)){
      gold = totalCost.toString().split(".")[0] + "g"
      silver = totalCost.toString().split(".")[1][0] + "s"
      total = gold + " " + silver
      this.setState({
        displayedCost: total
      })
    }
    else if (totalCost > 0){
      gold = totalCost.toString().split(".")[0] + "g"
      this.setState({
        displayedCost: gold
      })
    }
  }

  negotiatorHelper = (item) => {
    this.setState({
      currentlyNegotiatedObject: item.name,
      currentlyNegotiatedObjectInfo: item
    })
  }

  negotiatedObjectShown = () => {
    this.setState({
      currentlyNegotiatedObject: ""
    })
  }

  negotiatedPriceUpdator = (object, currencyType, currencyAmount) => {
    var rawCost = 0
    var newCost = currencyAmount + currencyType[0]
    if (currencyType[0] === "g"){
      rawCost = (parseInt(currencyAmount) * 1).toString()
    }

    else if (currencyType[0] === "s"){
      rawCost = (parseInt(currencyAmount) * .1).toString()
    }

    else if (currencyType[0] === "c"){
      rawCost = (parseInt(currencyAmount) * .01).toString()
    }

    if (Object.keys(object).includes("item_level")){
      var newItemArray = [...this.state.itemsList]
      newItemArray.find(oldObject => oldObject.id === object.id).render_cost = newCost
      newItemArray.find(oldObject => oldObject.id === object.id).cost = rawCost
      this.setState({
        itemsList: newItemArray,
        currentlyNegotiatedObject: ""
      }, () => this.totalCostHelper())
    }

    if (Object.keys(object).includes("level")){
      var newSpellArray = [...this.state.spellsList]
      newSpellArray.find(oldObject => oldObject.id === object.id).render_cost = newCost
      newSpellArray.find(oldObject => oldObject.id === object.id).cost = rawCost

      this.setState({
        spellsList: newSpellArray,
        currentlyNegotiatedObject: ""
      }, () => this.totalCostHelper())
    }
  }

  clearCartAndResetCost = () => {
    this.props.clearCart()
    this.setState({
      displayedCost: 0
    })
  }

  render(){
    console.log("SPELLS IN THE CART", this.props.pendingSpellsInCart)
    console.log("ITEMS IN THE CART", this.props.pendingItemsInCart)
    return(
      <div className="bag-or-cart" style={this.props.currentCartShownStatus === true ? {display: "block"} : {display: "none"}}>
        <div className="parchmentTop">
        {this.state.currentlyNegotiatedObject === "" ?
          <p className="shop-x-button" onClick={() => this.props.currentCartShown()}>X</p>
        :
          <p className="shop-x-button" onClick={() => this.negotiatedObjectShown()}>X</p>
        }
        <div className="parchment"></div>
        <div className="parchmentBody">
          {this.state.currentlyNegotiatedObject === "" ?
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
                      <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.number_in_cart}</td><td>{item.render_cost}</td><td><img className="negotiate-icon" src={Negotiate} alt="negotiate-item" onClick={() => this.negotiatorHelper(item)} /></td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.objectToCartRemove(item, "item")}/></td>
                    </tr>
                    </Fragment>
                  )
                })
                }
                {this.state.spellsList.sort((a,b) => a.level-b.level).map(spell => {
                  return (
                    <Fragment key={`item-number-${spell.id}`}>
                    <tr>
                      <td>{spell.name}</td><td>{spell.school}</td><td>{spell.number_in_cart}</td><td>{spell.render_cost}</td><td><img className="negotiate-icon" src={Negotiate} alt="negotiate-spell" onClick={() => this.negotiatorHelper(spell)} /></td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.objectToCartRemove(spell, "spell")}/></td>
                    </tr>
                    </Fragment>
                  )
                })
                }
              </tbody>
            </table>
          :
            <NegotiatedObject negotiatedPriceUpdator={this.negotiatedPriceUpdator} info={this.state.currentlyNegotiatedObjectInfo}/>
          }
        </div>
        {this.state.currentlyNegotiatedObject === "" ?
          <Fragment>
            <div className="cart-finance-holder">
              <p>Current Funds<span className="current-cart-cost">{`${this.props.bagOfHoldingMoneyInfo.gold}g ${this.props.bagOfHoldingMoneyInfo.silver}s ${this.props.bagOfHoldingMoneyInfo.copper}c`}</span></p>
              <p>Current Cost<span className="current-cart-cost">{this.state.displayedCost}</span></p>
            </div>
            {this.state.loading === false ?
              <div className="changes-button-holder">
                <p className="cart-save-changes-button" onClick={() => this.saveItems(this.state)}>Checkout</p>
                <p className="cart-cancel-changes-button" onClick={() => this.clearCartAndResetCost()}>Empty<br/>Cart</p>
              </div>
            :
            <div className="changes-button-holder">
              <p>Purchasing...</p>
            </div>
            }
          </Fragment>
        :
          null
        }
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }
}

export default CurrentCart;

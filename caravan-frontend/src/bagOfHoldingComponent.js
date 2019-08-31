import React from 'react';
import ObjectsList from './bagOfHoldingComponents/objectsList.js'

// TODO
// 1) ADD CONFIRMATION OF SAVE WINDOW POST DATABASE RESPONSE IN SAVE ITEMS
// 2) THERES THIS WEIRD BUG WHERE STOCK DOES NOT CHANGE WHEN THE CANCEL BUTTON IS USED

// NOTE
// ALL MONEY VALUE SHOULD BE IN FORM [GOLD].[SILVER][COPPER], EVEN WHEN IT'S JUST GOLD
// NOT HAVING THIS WILL BREAK RENDER

class BagofHoldingComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      items: [],
      spells: [],
      money: "",
      gold: null,
      silver: null,
      copper: null,
      loading: false
    }
  }

  componentDidMount(){
    this.refreshItems()
  }

  componentDidUpdate(prevProps){
    if ((this.props.bagOfHoldingMoneyInfo.money !== this.state.money) && (this.state.money !== "") && this.props !== prevProps){
      this.refreshItems()
    }
  }

  refreshItems = () => {
    this.setState({
      loading: true
    }, () => {
      fetch("http://localhost:3000/bagofholdings/1", {
        method: "GET"
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          items: res.bag.items,
          spells: res.bag.spells,
          money: res.bag.money,
        }, () => {
          this.moneyParser()
        })
      })
    })
  }

  saveItems = (bagContents) => {
    // var newBagMoney = (bagContents.newGold + bagContents.newSilver + bagContents.newCopper).toString()
    var gold = 0
    var silver = 0
    var copper = 0
    var moneyArray = [{"gold": bagContents.shownGold}, {"silver": bagContents.shownSilver}, {"copper":bagContents.shownCopper}]
    debugger
    for (var currency of moneyArray){
      if (Object.keys(currency).includes("gold")){
        gold = currency.gold
      }
      if (Object.keys(currency).includes("silver")){
        silver = parseInt(currency.silver.toString()[currency.silver.toString().length -1])
        if (currency.silver.toString().length > 1){
          gold += parseInt(currency.silver.toString().slice(0, currency.silver.toString().length -1))
        }

      }
      if (Object.keys(currency).includes("copper")){

        copper = parseInt(currency.copper.toString()[currency.copper.toString().length -1])

        if (currency.copper.toString().length > 2){
          gold += parseInt(currency.copper.toString().slice(0, currency.copper.toString().length -2))
        }

        if (currency.copper.toString().length > 1){
          silver += parseInt(currency.copper.toString()[currency.copper.toString().length -2])
        }
        if (silver > 10){
          gold += parseInt(silver.toString()[0])
          silver = parseInt(silver.toString()[1])
        }
      }

    }
    
    var newBagMoney = [gold.toString(), ".", silver.toString(), copper.toString()].join("")
    this.setState({
      loading: true
    }, () => {
      fetch("http://localhost:3000/bagofholdings/1", {
        method: "PUT",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({"items": bagContents.itemsList, "spells": bagContents.spellsList, "money": newBagMoney})
      })
      .then(res => res.json())
      .then(res => {
        debugger
        this.setState({
          items: res.bag.items,
          spells: res.bag.spells,
          money: res.bag.money,
        }, () => {
          this.moneyParser()
          alert("Changes saved!")
        })
      })
    })
  }

  moneyParser = () => {
    var moneyArray = this.state.money.split(".")
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
      gold: currentGold,
      silver: currentSilver,
      copper: currentCopper,
      loading: false
    }, () => this.props.moneyHoister(this.state.money, this.state.gold, this.state.silver, this.state.copper))
  }

  stockChanger = (changedItem, actionType) => {
    var selectedItem = this.state.items.find(item => item.id === changedItem.id)

    if (actionType === "minus" && selectedItem.current_stock > 0){
      selectedItem.current_stock -= 1
      this.setState(prevState => ({
        ...prevState.items,
        [prevState.items.find(item => item.id === changedItem.id).current_stock]: selectedItem.current_stock
      }))
    }

    if (actionType === "minus" && selectedItem.current_stock === 0){
      this.setState({
        items: this.state.items.filter(item => item.id !== selectedItem.id)
      })
    }
  }

  spellChanger = (purchasedSpell, actionType) => {
    var selectedSpell = this.state.spells.find(spell => spell.id === purchasedSpell.id)

    if (actionType === "minus" && selectedSpell.current_stock > 0){
      selectedSpell.current_stock -= 1
      this.setState(prevState => ({
        ...prevState.spells,
        [prevState.spells.find(spell => spell.id === selectedSpell.id).current_stock]: selectedSpell.current_stock
      }))
    }

    if (actionType === "minus" && selectedSpell.current_stock === 0){
      this.setState({
        spells: this.state.spells.filter(spell => spell.id !== selectedSpell.id)
      })
    }
  }

  render(){
    return(
      <div className="bag-or-cart" style={this.props.bagOfHoldingShown === true ? {display: "block"} : {display: "none"}}>
        {
          (this.state.items.length > 0 || this.state.spells.length > 0) && this.state.gold !== null ?
            <ObjectsList loading={this.state.loading} items={this.state.items} spells={this.state.spells} stockChanger={this.stockChanger} spellChanger={this.spellChanger} refreshItems={this.refreshItems} saveItems={this.saveItems} gold={this.state.gold} silver={this.state.silver} copper={this.state.copper} bagOfHoldingShownFunc={this.props.bagOfHoldingShownFunc} />
          :
          null
        }
      </div>
    )
  }
}

export default BagofHoldingComponent;

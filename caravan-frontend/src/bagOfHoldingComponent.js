import React from 'react';
import ObjectsList from './bagOfHoldingComponents/objectsList.js'

// TODO
// 1) ADD MONEY TO BOTTOM OF THE BAG
// 2) FIX BUG WHERE SAVE UPDATES ARE NOT REFLECTED IN STOCK

class BagofHoldingComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      items: [],
      spells: []
    }
  }

  componentDidMount(){
    this.refreshItems()
  }

  refreshItems = () => {
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

  saveItems = (bagContents) => {
    fetch("http://localhost:3000/bagofholdings/1", {
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({"items": bagContents.itemsList, "spells": bagContents.spellsList})
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        items: res.bag.items,
        spells: res.bag.spells,
      })
    })
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
      <div>
        {
          this.state.items.length > 0 || this.state.spells.length > 0 ?
            <ObjectsList items={this.state.items} spells={this.state.spells} stockChanger={this.stockChanger} spellChanger={this.spellChanger} refreshItems={this.refreshItems} saveItems={this.saveItems}>

            </ObjectsList>
          :
          null
        }
      </div>
    )
  }
}

export default BagofHoldingComponent;

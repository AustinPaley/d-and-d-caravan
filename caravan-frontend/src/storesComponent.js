import React from 'react';
import ItemList from './storesComponents/itemList.js'
import SpellList from './storesComponents/spellList.js'

const IMAGELIBRARY = {
  1: require('./images/level1.png'),
  2: require('./images/level2.png'),
  3: require('./images/level3.png'),
  4: require('./images/level4.png'),
  5: require('./images/level5.png'),
  6: require('./images/level6.png'),
  7: require('./images/level7.png'),
  8: require('./images/level8.png'),
  9: require('./images/level9.png')
}

class StoresComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      shopName: "",
      ownerName: "",
      ownerRace: "",
      ownerImage: "",
      shopItems: [],
      shopSpells: [],
      shopLevel: null,
      shopImage: "",
    }
  }

  componentDidMount(){
    if (this.props.info){
      fetch("http://localhost:3000/shops/" + this.props.info.id, {
        method: "GET"
      })
      .then(res => res.json())
      .then(res => {
        var shopImage = IMAGELIBRARY[res.shop.level + 1]
        this.setState({
          shopName: res.shop.name,
          ownerName: res.owner.name,
          ownerRace: res.owner.race,
          ownerImage: "data:image/png;base64," + res.owner.image,
          shopItems: res.items,
          shopSpells: res.spells,
          shopLevel: res.shop.level,
          shopImage: shopImage
        })
      })
    }
  }

  stockChanger = (changedItem, actionType) => {
    var selectedItem = this.state.shopItems.find(item => item.id === changedItem.id)
    var maxStock = this.state.shopItems.find(item => item.id === changedItem.id).max_stock
        debugger
    if (actionType === "plus" && selectedItem.current_stock < maxStock){
      selectedItem.current_stock += 1
    }
    if (actionType === "minus" && selectedItem.current_stock > 0){
      selectedItem.current_stock -= 1
    }
    this.setState(prevState => ({
      ...prevState.shopItems,
      [prevState.shopItems.find(item => item.id === changedItem.id).current_stock]: selectedItem.current_stock
    }))
  }

  spellChanger = (purchasedSpell, actionType) => {
    var selectedSpell = this.state.shopSpells.find(spell => spell.id === purchasedSpell.id)
    var maxSpellStock = this.state.shopSpells.find(spell => spell.id === purchasedSpell.id).max_stock
    if (actionType === "plus" && selectedSpell.current_stock < maxSpellStock){
      selectedSpell.current_stock += 1
    }
    if (actionType === "minus" && selectedSpell.current_stock > 0){
      selectedSpell.current_stock -= 1
    }
    this.setState(prevState => ({
      ...prevState.shopItems,
      [prevState.shopSpells.find(spell => spell.id === selectedSpell.id).current_stock]: selectedSpell.current_stock
    }))
  }

  render(){
    return(
      <div>
        <h2>{this.state.shopName}</h2>
        {this.state.ownerName ?
          (this.state.shopSpells.length > 0 ?
            <div>
              <img src={this.state.shopImage} alt={this.state.shopName} />
              <p>Owned by: {this.state.ownerName}, {this.state.ownerRace}</p>
              <img src={this.state.ownerImage} alt={this.state.ownerImage} />
              <SpellList spells={this.state.shopSpells} spellChanger={this.spellChanger}/>
            </div>
          :
            <div>
              <img src={this.state.shopImage} alt={this.state.shopName} />
              <p>Owned by: {this.state.ownerName}, {this.state.ownerRace}</p>
              <img src={this.state.ownerImage} alt={this.state.ownerImage} />
              <ItemList items={this.state.shopItems} stockChanger={this.stockChanger}/>
            </div>
          )
        :
          null
        }
      </div>
    )
  }
}

export default StoresComponent;

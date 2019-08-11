import React from 'react';
import ItemList from './storesComponents/itemList.js'
import SpellList from './storesComponents/spellList.js'
import RightArrow from './images/arrow-circle-right-solid.svg';
import LeftArrow from './images/arrow-circle-left-solid.svg';

// TODO
// 1) ADD UPGRADE BUTTONS TO THE STORE
// 2) BUILD PATCH CALLS TO DATABASE TO UPDATE IN DATABASE AS WELL AS IN FRONTEND
// 3) BUILD BACKEND BAG FUNCTIONALITY - SHOULD HOLD ITEMS AS WELL AS MONEY
// 4) BUILD FRONTEND FUNCTIONALITY TO SHOW ONE STORE AT A TIME
// 5) RENDER BAG IN FRONT END


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
      unlockedItems: [],
      shopSpells: [],
      unlockedSpells: [],
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
        var unlockedItems = this.unlockedItemChanger(res.items, res.shop.level)
        var unlockedSpells = this.unlockedSpellChanger(res.spells, res.shop.level)
        this.setState({
          shopName: res.shop.name,
          ownerName: res.owner.name,
          ownerRace: res.owner.race,
          ownerImage: "data:image/png;base64," + res.owner.image,
          shopItems: res.items,
          unlockedItems: unlockedItems,
          shopSpells: res.spells,
          unlockedSpells: unlockedSpells,
          shopLevel: res.shop.level,
          shopImage: shopImage
        })
      })
    }
  }

  unlockedItemChanger = (allItems, shopLevel) => {
    // THIS IS SET TO LEVEL 9 FOR TESTING PURPOSES
    return allItems.filter(item => item.item_level <= (shopLevel + 9))
  }

  unlockedSpellChanger = (allSpells, shopLevel) => {
    // THIS IS SET TO LEVEL 9 FOR TESTING PURPOSES
    return allSpells.filter(spell => spell.level <= (shopLevel + 9))
  }

  shopLevelChanger = (levelChange) => {
    // DOWN FUNCTIONALITY WILL BE UNNECESSARY IN LIVE, KEPT IN FOR TESTING
    if (levelChange === "up"){
      var increasedLevel = this.state.shopLevel + 1
      var increasedShopImage = IMAGELIBRARY[increasedLevel + 1]
      this.setState({
        shopLevel: increasedLevel,
        shopImage: increasedShopImage
      })
    }

    if (levelChange === "down"){
      var decreasedLevel = this.state.shopLevel - 1
      var decreasedShopImage = IMAGELIBRARY[decreasedLevel + 1]
      this.setState({
        shopLevel: decreasedLevel,
        shopImage: decreasedShopImage
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
              <img src={LeftArrow} alt="Left Arrow" width={"5%"} />
              <span className="level-up-button" onClick={() => this.shopLevelChanger("down")}>Level Down</span>
              <span className="level-up-button" onClick={() => this.shopLevelChanger("up")}>Level Up</span>
              <img src={this.state.shopImage} alt={this.state.shopName} />
              <p>Owned by: {this.state.ownerName}, {this.state.ownerRace}</p>
              <img src={this.state.ownerImage} alt={this.state.ownerImage} />
              <SpellList spells={this.state.shopSpells} shopLevel={this.state.shopLevel} spellChanger={this.spellChanger} levelChanger={this.levelChanger}/>
              <img src={RightArrow} alt="Right Arrow" width={"5%"} />
            </div>
          :
            <div>
              <img src={LeftArrow} alt="Left Arrow" width={"5%"} />
              <img src={this.state.shopImage} alt={this.state.shopName} />
              <p>Owned by: {this.state.ownerName}, {this.state.ownerRace}</p>
              <img src={this.state.ownerImage} alt={this.state.ownerImage} />
              <ItemList items={this.state.unlockedItems} shopLevel={this.state.shopLevel} stockChanger={this.stockChanger} levelChanger={this.levelChanger}/>
              <img src={RightArrow} alt="Right Arrow" width={"5%"} />
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

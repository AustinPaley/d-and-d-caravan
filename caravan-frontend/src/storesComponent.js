import React from 'react';
import ItemList from './storesComponents/itemList.js'
import SpellList from './storesComponents/spellList.js'

// TODO
// 1) BUILD A CART WHERE ALL PENDING ITEM ARE STORED - CART SHOULD HAVE A CHECKOUT OPTION AS WELL
// AS A RESET OPTION (AS WELL AS A REMOVE ITEM FROM CART BUTTON)
// 2) TIE STOCK TO BACKEND FUNCTIONALITY - UPON "CHECKOUT" REMOVE ITEMS FROM CART AND FROM STORE
// 3) ADD FUNCTIONALITY TO PURCHASE ITEMS AT GOLD COST
// 4) ADD FUNCTIONALITY TO SEND PROPERLY PURCHASED ITEMS INTO BAG OF HOLDING


const IMAGELIBRARY = {
  0: require('./images/level0.png'),
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
      shopActive: false
    }
  }

  componentDidMount(){
    if (this.props.info){
      fetch("http://localhost:3000/shops/" + this.props.info.id, {
        method: "GET"
      })
      .then(res => res.json())
      .then(res => {
        var shopImage = IMAGELIBRARY[res.shop.level]
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

  componentDidUpdate(){
    if (this.props.loaded === false){
      this.props.loaderHelper()
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
    // THE IMAGE FUNCTIONALITY HERE IS OFF BY 1 TO ACCOMODATE FOR TESTING
    // LEVEL 0 SHOPS SHOULD NOT RENDER NORMALLY TO BEGIN WITH - NEED BUY NOW IMAGE
    if (levelChange === "up"){
      var increasedLevel = this.state.shopLevel + 1
      var increasedShopImage = IMAGELIBRARY[increasedLevel]
      fetch("http://localhost:3000/shops/" + this.props.info.id, {
        method: "PUT",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({"level": increasedLevel})
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          shopLevel: res.level,
          shopImage: increasedShopImage
        })
      })
    }

    if (levelChange === "down"){
      var decreasedLevel = this.state.shopLevel - 1
      var decreasedShopImage = IMAGELIBRARY[decreasedLevel]
      fetch("http://localhost:3000/shops/" + this.props.info.id, {
        method: "PUT",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({"level": decreasedLevel})
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          shopLevel: res.level,
          shopImage: decreasedShopImage
        })
      })
    }
  }

  stockChanger = (changedItem, actionType) => {
    var selectedItem = this.state.shopItems.find(item => item.id === changedItem.id)
    var maxStock = this.state.shopItems.find(item => item.id === changedItem.id).max_stock
    var cartObject = Object.assign({}, selectedItem)
    if (actionType === "plus" && selectedItem.current_stock < maxStock){
      selectedItem.current_stock += 1
    }
    if (actionType === "minus" && selectedItem.current_stock > 0){
      selectedItem.current_stock -= 1
    }
    this.setState(prevState => ({
      ...prevState.shopItems,
      [prevState.shopItems.find(item => item.id === changedItem.id).current_stock]: selectedItem.current_stock
    }), () => this.props.objectToCartAdd(cartObject, "item"))
  }

  spellChanger = (purchasedSpell, actionType) => {
    var selectedSpell = this.state.shopSpells.find(spell => spell.id === purchasedSpell.id)
    var maxSpellStock = this.state.shopSpells.find(spell => spell.id === purchasedSpell.id).max_stock
    var cartObject = Object.assign({}, purchasedSpell)
    delete cartObject.current_stock
    if (actionType === "plus" && selectedSpell.current_stock < maxSpellStock){
      selectedSpell.current_stock += 1
    }
    if (actionType === "minus" && selectedSpell.current_stock > 0){
      selectedSpell.current_stock -= 1
    }
    this.setState(prevState => ({
      ...prevState.shopSpells,
      [prevState.shopSpells.find(spell => spell.id === selectedSpell.id).current_stock]: selectedSpell.current_stock
    }), () => this.props.objectToCartAdd(cartObject, "spell"))
  }

  activeShopHelper = () => {
    this.setState({
      shopActive: !this.state.shopActive
    })
  }

  render(){
    return(
      <div style={(this.props.currentlySelectedStore === this.props.info.id) && (this.props.shopsShown === true) ? {display: "block"} : {display: "none"}}>
        <h2>{this.state.shopName}</h2>
        {this.state.ownerName ?
          (this.state.shopSpells.length > 0 ?
            <div className="stores-component-container">
              <div className="stores-image-container" style={this.state.shopActive === false ? {display: "block"} : {display: "none"}}>
                <span className="level-down-button" onClick={() => this.shopLevelChanger("down")}>Level Down</span>
                <span className="level-up-button" onClick={() => this.shopLevelChanger("up")}>Level Up</span>
                <img className="shop-image" src={this.state.shopImage} alt={this.state.shopName} />
              </div>
                {this.state.shopActive === false ?
                  <div className="stores-owner-container">
                    <img className="owner-image" src={this.state.ownerImage} alt={this.state.ownerImage} onClick={() => this.activeShopHelper()} />
                    <p>Owned by: {this.state.ownerName}, {this.state.ownerRace}</p>
                  </div>
                :
                  <SpellList spells={this.state.shopSpells} shopLevel={this.state.shopLevel} spellChanger={this.spellChanger} levelChanger={this.levelChanger} activeShopHelper={this.activeShopHelper}/>
                }
            </div>
          :
            <div className="stores-component-container">
              <div className="stores-image-container" style={this.state.shopActive === false ? {display: "block"} : {display: "none"}}>
                <span className="level-down-button" onClick={() => this.shopLevelChanger("down")}>Level Down</span>
                <span className="level-up-button" onClick={() => this.shopLevelChanger("up")}>Level Up</span>
                <img className="shop-image" src={this.state.shopImage} alt={this.state.shopName} />
              </div>
                {this.state.shopActive === false ?
                  <div className="stores-owner-container">
                    <img className="owner-image" src={this.state.ownerImage} alt={this.state.ownerImage} onClick={() => this.activeShopHelper()} />
                    <p>Owned by: {this.state.ownerName}, {this.state.ownerRace}</p>
                  </div>
                :
                  <ItemList items={this.state.unlockedItems} shopLevel={this.state.shopLevel} stockChanger={this.stockChanger} levelChanger={this.levelChanger} activeShopHelper={this.activeShopHelper}/>
                }
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

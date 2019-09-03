import React from 'react';
import './App.css';
import StoresComponent from './storesComponent.js';
import BagofHoldingComponent from './bagOfHoldingComponent.js';
import CurrentCart from './currentCart.js';
import PartyNavBar from './partyNavBar.js'
import RightArrow from './images/arrow-circle-right-solid.svg';
import LeftArrow from './images/arrow-circle-left-solid.svg';

class App extends React.Component{
  state={
    allStoresObject: [],
    loaded: false,
    currentlySelectedStore: 2,
    bagOfHoldingShown: false,
    currentCartShown: false,
    shopsShown: true,
    pendingItemsInCart: [],
    pendingSpellsInCart: [],
    bagOfHoldingMoneyInfo: {}
  }

  componentDidMount(){
    this.getAllStoresData()
  }

  getAllStoresData = () => {
    fetch("http://localhost:3000/shops/?exclude=1",{
      method: "GET"
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        allStoresObject: res
      })
    })
  }

  loaderHelper = () => {
    this.setState({
      loaded: true
    })
  }

  bagOfHoldingShown = () => {
    this.setState({
      bagOfHoldingShown: !this.state.bagOfHoldingShown
    }, () => {
      if (this.state.bagOfHoldingShown === false && this.state.currentCartShown === false){
        this.setState({
          shopsShown: true
        })
      }
      else {
        this.setState({
          shopsShown: false,
          currentCartShown: false
        })
      }
    })
  }

  currentCartShown = () => {
    this.setState({
      currentCartShown: !this.state.currentCartShown
    }, () => {
      if (this.state.currentCartShown === false && this.state.bagOfHoldingShown === false){
        this.setState({
          shopsShown: true
        })
      }
      else {
        this.setState({
          shopsShown: false,
          bagOfHoldingShown: false
        })
      }
    })
  }

  storeSelectorHelper = (type) => {
    var totalNumberOfStores = this.state.allStoresObject.length
    var currentStoreSelected = this.state.currentlySelectedStore

    if ((type === "left" && this.state.currentlySelectedStore === 2)){
      this.setState({
        currentlySelectedStore: Math.abs(totalNumberOfStores + 1)
      })
    }

    else if (type === "left") {
      this.setState({
        currentlySelectedStore: Math.abs(currentStoreSelected - 1)
      })
    }

    if ((type === "right" && this.state.currentlySelectedStore === totalNumberOfStores + 1)){
      this.setState({
        currentlySelectedStore: 2
      })
    }

    else if (type === "right") {
      this.setState({
        currentlySelectedStore: Math.abs(currentStoreSelected + 1)
      })
    }
  }

  objectToCartAdd = (object, itemType) => {
    if (itemType === "item"){
      if (this.state.pendingItemsInCart.find(item => item.id === object.id) === undefined){
        object.current_stock = 1
        this.setState(prevState => ({
          pendingItemsInCart: [...prevState.pendingItemsInCart, object]
        }))
      }

      if ((this.state.pendingItemsInCart.find(item => item.id === object.id) !== undefined) && (this.state.pendingItemsInCart.find(item => item.id === object.id).current_stock < this.state.pendingItemsInCart.find(item => item.id === object.id).max_stock)){
        var newItemArray = [...this.state.pendingItemsInCart]
        newItemArray.find(item => item.id === object.id).current_stock += 1
        this.setState({
          pendingItemsInCart: newItemArray
        })
      }
    }

    if (itemType === "spell"){
      if (this.state.pendingSpellsInCart.find(spell => spell.id === object.id) === undefined){
        object.current_stock = 1
        this.setState(prevState => ({
          pendingSpellsInCart: [...prevState.pendingSpellsInCart, object]
        }))
      }

      if ((this.state.pendingSpellsInCart.find(spell => spell.id === object.id) !== undefined) && (this.state.pendingSpellsInCart.find(spell => spell.id === object.id).current_stock < object.max_stock)){
        var newSpellArray = [...this.state.pendingSpellsInCart]
        newSpellArray.find(spell => spell.id === object.id).current_stock += 1
        this.setState({
          pendingSpellsInCart: newSpellArray
        })
      }
    }
  }

  objectToCartRemove = (object, itemType) => {
    if (itemType === "item" && this.state.pendingItemsInCart.find(item => item.id === object.id).current_stock === 1){
      var currentPendingItems = this.state.pendingItemsInCart
      this.setState({
        pendingItemsInCart: currentPendingItems.filter(item => item.id !== object.id)
      })
    }

    if (itemType === "item" && this.state.pendingItemsInCart.find(item => item.id === object.id).id !== undefined && this.state.pendingItemsInCart.find(item => item.id === object.id).current_stock > 1){
      var newItemsArray = [...this.state.pendingItemsInCart]
      newItemsArray.find(item => item.id === object.id).current_stock -= 1
      this.setState({
        pendingItemsInCart: newItemsArray
      })
    }

    if (itemType === "spell" && this.state.pendingSpellsInCart.find(spell => spell.id === object.id).current_stock === 1){
      var currentPendingSpells = this.state.pendingSpellsInCart
      this.setState({
        pendingSpellsInCart: currentPendingSpells.filter(spell => spell.id !== object.id)
      })
    }

    if (itemType === "spell" && this.state.pendingSpellsInCart.find(spell => spell.id === object.id).id !== undefined && this.state.pendingSpellsInCart.find(spell => spell.id === object.id).current_stock > 1){
      var newSpellsArray = [...this.state.pendingSpellsInCart]
      newSpellsArray.find(spell => spell.id === object.id).current_stock -= 1
      this.setState({
        pendingSpellsInCart: newSpellsArray
      })
    }
  }

  clearCart = () => {
    this.setState({
      pendingSpellsInCart: [],
      pendingItemsInCart: []
    })
  }

  moneyHoister = (bagOfHoldingMoney, bagOfHoldingGold, bagOfHoldingSilver, bagOfHoldingCopper) => {
    this.setState({
      bagOfHoldingMoneyInfo: {"money": bagOfHoldingMoney, "gold": bagOfHoldingGold, "silver": bagOfHoldingSilver, "copper": bagOfHoldingCopper}
    })
    this.getAllStoresData()
  }

  render(){
    return (
      <div className="App">
        <PartyNavBar bagOfHoldingShown={this.bagOfHoldingShown} currentCartShown={this.currentCartShown} numberOfPendingItemsInCart={this.state.pendingItemsInCart.length + this.state.pendingSpellsInCart.length} />
        <CurrentCart moneyHoister={this.moneyHoister} bagOfHoldingMoneyInfo={this.state.bagOfHoldingMoneyInfo} currentCartShown={this.currentCartShown} pendingItemsInCart={this.state.pendingItemsInCart} pendingSpellsInCart={this.state.pendingSpellsInCart} objectToCartRemove={this.objectToCartRemove} currentCartShownStatus={this.state.currentCartShown} clearCart={this.clearCart}/>
        <BagofHoldingComponent moneyHoister={this.moneyHoister} bagOfHoldingShown={this.state.bagOfHoldingShown} bagOfHoldingShownFunc={this.bagOfHoldingShown} bagOfHoldingMoneyInfo={this.state.bagOfHoldingMoneyInfo} />
        {this.state.loaded === true ?
          <div>
            <img src={LeftArrow} className="left-arrow" alt="Left Arrow" width={"5%"} onClick={() => this.storeSelectorHelper("left")}/>
          </div>
        :
          null
        }
        {this.state.allStoresObject.length > 0 ?
          <div>
            {this.state.allStoresObject.map(store => (
                <StoresComponent key={store.id} info={store} currentlySelectedStore={this.state.currentlySelectedStore} loaded={this.state.loaded} loaderHelper={this.loaderHelper} objectToCartAdd={this.objectToCartAdd} shopsShown={this.state.shopsShown} />
              ))
            }
          </div>
        :
          null
        }
        {this.state.loaded === true ?
          <div>
            <img src={RightArrow} className="right-arrow" alt="Right Arrow" width={"5%"} onClick={() => this.storeSelectorHelper("right")} />
          </div>
        :
          null
        }
      </div>
    );
  }
}

export default App;

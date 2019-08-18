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
    currentlySelectedStore: 1,
    bagOfHoldingShown: false,
    currentCartShown: false,
  }

  componentDidMount(){
    fetch("http://localhost:3000/shops/",{
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
    })
  }

  currentCartShown = () => {
    this.setState({
      currentCartShown: !this.state.currentCartShown
    })
  }

  storeSelectorHelper = (type) => {
    var totalNumberOfStores = this.state.allStoresObject.length
    var currentStoreSelected = this.state.currentlySelectedStore
    if ((type === "left" && this.state.currentlySelectedStore === 0) || (type === "left" && this.state.currentlySelectedStore === 1)){
      this.setState({
        currentlySelectedStore: Math.abs(totalNumberOfStores - 1)
      })
    }

    else if (type === "left") {
      this.setState({
        currentlySelectedStore: Math.abs(currentStoreSelected - 1)
      })
    }

    if ((type === "right" && this.state.currentlySelectedStore === 0) || (type === "right" && this.state.currentlySelectedStore === 8)){
      this.setState({
        currentlySelectedStore: 1
      })
    }

    else if (type === "right") {
      this.setState({
        currentlySelectedStore: Math.abs(currentStoreSelected + 1)
      })
    }
  }

  render(){
    return (
      <div className="App">
        <PartyNavBar bagOfHoldingShown={this.bagOfHoldingShown} currentCartShown={this.currentCartShown} />
        {this.state.currentCartShown === true ?
          <CurrentCart currentCartShown={this.currentCartShown} />
        :
          null
        }
        <BagofHoldingComponent bagOfHoldingShown={this.state.bagOfHoldingShown} />
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
                <StoresComponent key={store.id} info={store} currentlySelectedStore={this.state.currentlySelectedStore} loaded={this.state.loaded} loaderHelper={this.loaderHelper} />
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

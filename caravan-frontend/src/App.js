import React from 'react';
import './App.css';
import StoresComponent from './storesComponent.js';

class App extends React.Component{
  state={
    allStoresObject: []
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

  render(){
    return (
      <div className="App">
        {this.state.allStoresObject.map(store => (
            <StoresComponent key={store.id} info={store} />
          ))
        }
        <StoresComponent />
      </div>
    );
  }
}

export default App;

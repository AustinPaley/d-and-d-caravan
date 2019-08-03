import React from 'react';
import logo from './logo.svg';
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;

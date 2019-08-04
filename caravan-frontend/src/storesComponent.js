import React from 'react';
import ItemList from './storesComponents/itemList.js'

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

  render(){
    return(
      <div>
        <h2>{this.state.shopName}</h2>
        {this.state.ownerName ?
          <div>
            <img src={this.state.shopImage} alt={this.state.shopName} />
            <p>Owned by: {this.state.ownerName}, {this.state.ownerRace}</p>
            <img src={this.state.ownerImage} alt={this.state.ownerImage} />
            <ItemList items={this.state.shopItems}/>
          </div>
        :
          null
        }
      </div>
    )
  }
}

export default StoresComponent;

import React, {Fragment} from 'react';
import PlusImage from '../images/plus-square-regular.svg';
import MinusImage from '../images/minus-square-regular.svg';

class ItemList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      itemsList: []
    }
  }

  componentDidMount(){
    this.priceConverterHelper()
  }

  componentDidUpdate(prevProps){
    if (this.props.pendingItemsInCart.length === 0 && this.props.items !== prevProps.items){
      this.priceConverterHelper()
    }
  }

  priceConverterHelper = () => {
    var newItemArray = []
    this.props.items.forEach(item => {
      var itemCost = parseFloat(item.cost)
      if (itemCost / 1 >= 1){
        var gold = itemCost / 1
        itemCost = gold.toString() + "g"
      }

      else if (itemCost / .1 >= 1){
        var silver = itemCost / .1
        itemCost = silver.toString() + "s"
      }

      else if (itemCost / .01 >= 1){
        var copper = itemCost / .01
        itemCost = copper.toString() + "c"
      }
      item["render_cost"] = itemCost
      item["max_stock"] = item.current_stock
      newItemArray.push(item)
    })
    if (this.props.cartClearLoading === true){
      this.setState({
        itemsList: newItemArray
      }, () => {this.props.clearCartStoreHelper("complete")})
    }
    else {
      this.setState({
        itemsList: newItemArray
      }, () => {this.props.clearCartStoreHelper()})
    }
  }

  render(){
    console.log("IN ITEMS", this.props.cartClearLoading)
    return(
      <div>
        <div className="parchmentTop">
        <p className="shop-x-button" onClick={() => this.props.activeShopHelper()}>X</p>
        <div className="parchment"></div>
        <div className="parchmentBody">
          <table className="itemListTable">
            <thead>
              <tr>
                <th className="sticky-header">Item Name</th><th className="sticky-header">Item Type</th><th className="sticky-header">Cost</th><th className="sticky-header">Stock</th><th className="sticky-header">Buy/Undo</th>
              </tr>
            </thead>
            <tbody>
              {this.state.itemsList.sort((a,b) => a.cost-b.cost).map(item => {
                return (
                  <Fragment key={`item-number-${item.id}`}>
                  <tr>
                    <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.render_cost}</td><td>{item.current_stock}</td><td><img src={PlusImage} className="add-remove-icons" alt="plusIcon" onClick={() => this.props.stockChanger(item, "minus")}/><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.stockChanger(item, "plus")}/></td>
                  </tr>
                  </Fragment>
                )
              })
              }
            </tbody>
          </table>
        </div>
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }
}

export default ItemList;

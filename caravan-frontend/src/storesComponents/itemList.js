import React, {Fragment} from 'react';
import PlusImage from '../images/plus-square-regular.svg';
import MinusImage from '../images/minus-square-regular.svg';

class ItemList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      itemsList: this.props.items
    }
  }

  componentDidMount(){
    this.priceConverterHelper()
  }

  priceConverterHelper = () => {
    var newItemArray = []
    this.state.itemsList.forEach(item => {
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

    this.setState({
      itemsList: newItemArray
    })
  }

  render(){
    return(
      <div>
        <div className="parchmentTop">
        <div className="parchment"></div>
        <div className="parchmentBody">
          <table className="itemListTable">
            <thead>
              <tr>
                <th className="sticky-header">Item Name</th><th className="sticky-header">Item Type</th><th className="sticky-header">Cost</th><th className="sticky-header">Stock</th><th className="sticky-header">Add/Remove</th>
              </tr>
            </thead>
            <tbody>
              {this.state.itemsList.sort((a,b) => a.cost-b.cost).map(item => {
                return (
                  <Fragment key={`item-number-${item.id}`}>
                  <tr>
                    <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.render_cost}</td><td>{item.current_stock}</td><td><img src={PlusImage} className="add-remove-icons" alt="plusIcon" onClick={() => this.props.stockChanger(item, "plus")}/><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.stockChanger(item, "minus")}/></td>
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

import React, {Fragment} from 'react';
import MinusImage from '../images/minus-square-regular.svg';

// TODO
// 1) ADD REMOVE SPELLS FUNCTIONALITY - IF STOCK GOES TO 0 REMOVE SPELL ENTIRELY FROM BAG
// USE FUNCTIONALITY FROM ITEMS BUT CHANGE LOGIC - WORK IS COMPLETED THERE

class ObjectsList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      itemsList: this.props.items,
      spellsList: this.props.spells
    }
  }

  componentDidMount(){
    this.priceConverterHelper()
    this.spellConverterHelper()
  }

  componentDidUpdate(prevProps, prevState){
    if (this.props.items.length !== prevProps.items.length){
      this.priceConverterHelper()
    }

    if (this.props.spells.length !== prevProps.spells.length){
      this.spellConverterHelper()
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

    this.setState({
      itemsList: newItemArray
    })
  }

  spellConverterHelper = () => {
    var newSpellArray = []
    this.state.spellsList.forEach(spell => {
      if (spell.level === 0){
        spell["render_level"] = "Cantrip"
        spell["render_cost"] = spell.cost + "g"
      }
      else {
        spell["render_level"] = spell.level
        spell["render_cost"] = spell.cost + "g"
      }
      spell["max_stock"] = spell.current_stock
      newSpellArray.push(spell)
    })

    this.setState({
      spellsList: newSpellArray
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
                <th className="sticky-header">Item Name</th><th className="sticky-header">Item/Spell Type</th><th className="sticky-header">Stock</th><th className="sticky-header">Remove</th>
              </tr>
            </thead>
            <tbody>
              {this.state.itemsList.sort((a,b) => a.cost-b.cost).map(item => {
                return (
                  <Fragment key={`item-number-${item.id}`}>
                  <tr>
                    <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.current_stock}</td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.stockChanger(item, "minus")}/></td>
                  </tr>
                  </Fragment>
                )
              })
              }
              {this.state.spellsList.sort((a,b) => a.level-b.level).map(spell => {
                return (
                  <Fragment key={`item-number-${spell.id}`}>
                  <tr>
                    <td>{spell.name}</td><td>{spell.school}</td><td>{spell.current_stock}</td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.spellChanger(spell, "minus")}/></td>
                  </tr>
                  </Fragment>
                )
              })
              }
            </tbody>
          </table>
        </div>
        <p className="bag-of-holding-cancel-changes-button" onClick={() => this.props.refreshItems()}>Cancel Changes</p>
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }

}

export default ObjectsList;

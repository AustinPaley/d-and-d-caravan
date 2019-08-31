import React, {Fragment} from 'react';
import MinusImage from '../images/minus-square-regular.svg';

class ObjectsList extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      itemsList: this.props.items,
      spellsList: this.props.spells,
      newGold: this.props.gold,
      newSilver: this.props.silver,
      newCopper: this.props.copper,
      shownGold: this.props.gold,
      shownSilver: this.props.silver,
      shownCopper: this.props.copper,
      moneyBeingReset: false,
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

    if (this.state.moneyBeingReset){
      this.setState({
        newGold: this.props.gold,
        newSilver: this.props.silver,
        newCopper: this.props.copper,
        shownGold: this.props.gold,
        shownSilver: this.props.silver,
        shownCopper: this.props.copper,
        moneyBeingReset: false,
      })
    }

    if ((isNaN((this.props.gold + this.props.silver + this.props.copper)) !== true) && (this.props.gold + this.props.silver + this.props.copper) !== (prevProps.gold + prevProps.silver + prevProps.copper)){
      this.setState({
        newGold: this.props.gold,
        newSilver: this.props.silver,
        newCopper: this.props.copper,
        shownGold: this.props.gold,
        shownSilver: this.props.silver,
        shownCopper: this.props.copper,
      })
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
    this.props.spells.forEach(spell => {
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

  moneyConverterHelper = (event, moneyType) => {
    // TODO - THIS NEEDS A CHECK TO MAKE SURE NO REGULAR ALPHABETICAL CHARACTERS ARE INCLUDED
    // SHOULD BE SOMETHING LIKE /[A-Za-z]/ in regex.
    var goldGuide = {"cp": 0.01, "sp": 0.1, "ep": 0.5, "gp": 1, "pp": 10}

    if (moneyType === "gp" && isNaN(parseFloat(event.target.value)) === true){
      this.setState({
        newGold: "",
        shownGold: "",
      })
    }

    if (moneyType === "gp" && isNaN(parseFloat(event.target.value)) !== true){

      var newGoldAmount = parseFloat(event.target.value)
      var convertedGoldAmount = goldGuide["gp"] * newGoldAmount
      this.setState({
        newGold: convertedGoldAmount,
        shownGold: newGoldAmount
      })
    }

    if (moneyType === "sp" && isNaN(parseFloat(event.target.value)) === true){
      this.setState({
        newSilver: "",
        shownSilver: "",
      })
    }

    if (moneyType === "sp" && isNaN(parseFloat(event.target.value)) !== true){
      var newSilverAmount = parseFloat(event.target.value)
      var convertedSilverAmount = goldGuide["sp"] * newSilverAmount

      this.setState({
        newSilver: convertedSilverAmount,
        shownSilver: newSilverAmount
      })
    }

    if (moneyType === "cp" && isNaN(parseFloat(event.target.value)) === true){
      this.setState({
        newCopper: "",
        shownCopper: ""
      })
    }

    if (moneyType === "cp" && isNaN(parseFloat(event.target.value)) !== true){
      var newCopperAmount = parseFloat(event.target.value)
      var convertedCopperAmount = goldGuide["cp"] * newCopperAmount

      this.setState({
        newCopper: convertedCopperAmount,
        shownCopper: newCopperAmount
      })
    }
  }

  moneyRefreshHandler = (e) => {
    var newMoney = this.state.newGold + this.state.newSilver + this.state.newCopper
    var oldMoney = this.props.gold + this.props.silver + this.props.copper
    if (newMoney !== oldMoney){
      this.setState({
        moneyBeingReset: true
      }, () => {
        this.props.refreshItems()
      })
    }
    else{
      this.props.refreshItems()
    }

  }

  render(){
    console.log("objects list", this.props)
    return(
      <div>
        <div className="parchmentTop">
        <p className="shop-x-button" onClick={() => this.props.bagOfHoldingShownFunc()}>X</p>
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
        <div className="bag-of-holding-money">
          <div className="bag-of-holding-money-type">
            <label>Gold:</label>
            <input value={this.state.shownGold} onChange={(event) => this.moneyConverterHelper(event, "gp")}/>
          </div>
          <div className="bag-of-holding-money-type">
            <label>Silver:</label>
            <input value={this.state.shownSilver} onChange={(event) => this.moneyConverterHelper(event, "sp")}/>
          </div>
          <div className="bag-of-holding-money-type">
            <label>Copper:</label>
            <input value={this.state.shownCopper} onChange={(event) => this.moneyConverterHelper(event, "cp")}/>
          </div>
        </div>
        {this.props.loading === false ?
          <div className="changes-button-holder">
            <p className="bag-of-holding-save-changes-button" onClick={() => this.props.saveItems(this.state)}>Save<br/>Changes</p>
            <p className="bag-of-holding-cancel-changes-button" onClick={() => this.moneyRefreshHandler()}>Cancel<br/>Changes</p>
          </div>
        :
          <div className="changes-button-holder">
            <p>Saving...</p>
          </div>
        }
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }

}

export default ObjectsList;

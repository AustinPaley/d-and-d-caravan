import React, {Fragment} from 'react';
import MinusImage from '../images/minus-square-regular.svg';
import EditImage from '../images/edit-regular.svg'
import SortDown from '../images/sort-down-solid.svg';
import SortUp from '../images/sort-up-solid.svg';
import AddObject from './addObject.js'
import EditObject from './editObject.js'

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
      sort: "loading"
    }
  }

  componentDidMount(){
    this.priceConverterHelper()
    this.spellConverterHelper()
    this.sortHelperFunction()
  }

  componentDidUpdate(prevProps, prevState){
    if (this.props.items !== prevProps.items){
      this.priceConverterHelper()
    }

    if (this.props.spells !== prevProps.spells){
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

  sortHelperFunction = () => {
    if (this.state.sort === "loading"){
        var newSortedItemList = [...this.state.itemsList.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))]
        var newSortedSpellList = [...this.state.spellsList.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))]
        this.setState({
          sort: "down",
          itemsList: newSortedItemList,
          spellsList: newSortedSpellList
        })
    }

    if (this.state.sort === "down"){
      var newSortedItemList = [...this.state.itemsList.sort((a,b) => (b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : 0))]
      var newSortedSpellList = [...this.state.spellsList.sort((a,b) => (b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : 0))]
      this.setState({
        sort: "up",
        itemsList: newSortedItemList,
        spellsList: newSortedSpellList
      })
    }

    if (this.state.sort === "up"){
      var newSortedItemList = [...this.state.itemsList.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))]
      var newSortedSpellList = [...this.state.spellsList.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))]
      this.setState({
        sort: "down",
        itemsList: newSortedItemList,
        spellsList: newSortedSpellList
      })
    }
  }

  render(){
    debugger
    return(
      <div>
        <div className="parchmentTop">
        {this.props.addItemShown === false && this.props.editItemShown === false ?
          <div>
            <p className="shop-x-button" onClick={() => this.props.bagOfHoldingShownFunc()}>X</p>
            <div className="add-object-button-holder">
              <p className="add-object-button" style={{cursor: "pointer"}} onClick={() => this.props.addItemStatusHelper()}>Add Item</p>
            </div>
          </div>

        :
          (this.props.editItemShown === false ?
            <div>
              <p className="shop-x-button" onClick={() => this.props.addItemStatusHelper()}>X</p>
            </div>
          :
            <div>
              <p className="shop-x-button" onClick={() => this.props.editItemStatusHelper("reset")}>X</p>
            </div>
          )
        }
        <div className="parchment"></div>
          <div>
          {this.props.addItemShown === false ?
            (this.props.editItemShown === false ?
              <div className="parchmentBody" style={{marginTop: "10px"}}>
                <table className="itemListTable">
                  <thead>
                    <tr>
                      <th className="sticky-header" onClick={() => this.sortHelperFunction()}>
                        Item Name
                        {this.state.sort === "down" ?
                          <img src={SortDown} className="sort-down-arrow" alt="sort-down-arrow" />
                        :
                          <img src={SortUp} className="sort-up-arrow" alt="sort-up-arrow" />
                        }
                      </th>
                      <th className="sticky-header">Item/Spell Type</th>
                      <th className="sticky-header">Stock</th>
                      <th className="sticky-header">Edit</th>
                      <th className="sticky-header">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.itemsList.map(item => {
                      return (
                        <Fragment key={`item-number-${item.id}`}>
                        <tr>
                          <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.current_stock}</td><td><img className="edit-icons" src={EditImage} alt="Edit Icon" onClick={() => this.props.editItemStatusHelper(item)}/></td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.stockChanger(item, "minus")}/></td>
                        </tr>
                        </Fragment>
                      )
                    })
                    }
                    {this.state.spellsList.sort((a,b) => a.name-b.name).map(spell => {
                      return (
                        <Fragment key={`item-number-${spell.id}`}>
                        <tr>
                          <td>{spell.name}</td><td>{spell.school}</td><td>{spell.current_stock}</td><td><img className="edit-icons" src={EditImage} alt="Edit Icon" onClick={() => this.props.editItemStatusHelper(spell)}/></td><td><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.spellChanger(spell, "minus")}/></td>
                        </tr>
                        </Fragment>
                      )
                    })
                    }
                  </tbody>
                </table>
              </div>
            :
              <EditObject editedObject={this.props.editedObject} refreshItems={this.props.refreshItems} editItemStatusHelper={this.props.editItemStatusHelper} loading={this.props.loading} />
            )
          :
            <AddObject addItemStatusHelper={this.props.addItemStatusHelper} refreshItems={this.props.refreshItems} loading={this.props.loading}/>
          }
        </div>
        {this.props.addItemShown === false && this.props.editItemShown === false ?
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
        :
          null
        }
        {this.props.loading === false ?
          (this.props.addItemShown === false && this.props.editItemShown === false ?
            <div className="changes-button-holder">
              <p className="bag-of-holding-save-changes-button" onClick={() => this.props.saveItems(this.state)}>Save<br/>Changes</p>
              <p className="bag-of-holding-cancel-changes-button" onClick={() => this.moneyRefreshHandler()}>Cancel<br/>Changes</p>
            </div>
          :
            null
          )
        :
          (this.props.addItemShown === false && this.props.editItemShown === false ?
            <div className="changes-button-holder">
              <p>Saving...</p>
            </div>
          :
            null
          )
        }
        <div className="parchmentBottom"></div></div>
      </div>
    )
  }

}

export default ObjectsList;

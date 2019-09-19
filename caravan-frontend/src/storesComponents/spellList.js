import React, {Fragment} from 'react';
import PlusImage from '../images/plus-square-regular.svg';
import MinusImage from '../images/minus-square-regular.svg';

class SpellList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      spellsList: []
    }
  }

  componentDidMount(){
    this.spellConverterHelper()
  }

  componentDidUpdate(prevProps){
    if (this.props.pendingSpellsInCart.length === 0 && this.props.spells !== prevProps.spells){
      this.spellConverterHelper()
    }
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

  render(){
    return(
      <div>
        <div className="parchmentTop">
        <p className="shop-x-button" onClick={() => this.props.activeShopHelper()}>X</p>
        <div className="parchment"></div>
        <div className="parchmentBody">
          <table className="itemListTable">
            <thead>
              <tr>
                <th className="sticky-header">Spell Name</th><th className="sticky-header">Spell Type</th><th className="sticky-header">Spell Level</th><th className="sticky-header">Cost</th><th className="sticky-header">Stock</th><th className="sticky-header">Buy/Undo</th>
              </tr>
            </thead>
            <tbody>
              {this.state.spellsList.sort((a,b) => a.level-b.level).map(spell => {
                return (
                  <Fragment key={`spell-number-${spell.id}`}>
                  <tr>
                    <td>{spell.name}</td><td>{spell.school}</td><td>{spell.render_level}</td><td>{spell.render_cost}</td><td>{spell.current_stock}</td><td><img src={PlusImage} className="add-remove-icons" alt="plusIcon" onClick={() => this.props.spellChanger(spell, "minus")}/><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.spellChanger(spell, "plus")}/></td>
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

export default SpellList;

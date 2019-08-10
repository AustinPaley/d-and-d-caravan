import React, {Fragment} from 'react';
import PlusImage from '../images/plus-square-regular.svg';
import MinusImage from '../images/minus-square-regular.svg';

class SpellList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      spellsList: this.props.spells
    }
  }

  componentDidMount(){
    this.spellConverterHelper()
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

  // TODO - FIX STOCK CHANGER FOR SPELLS - IT NEEDS TO REMOVE SPELLS ENTIRELY WHEN SELECTED

  render(){
    console.log(this.state.spellsList)
    return(
      <div>
        <div className="parchmentTop">
        <div className="parchment"></div>
        <div className="parchmentBody">
          <table className="itemListTable">
            <thead>
              <tr>
                <th className="sticky-header">Spell Name</th><th className="sticky-header">Spell Type</th><th className="sticky-header">Spell Level</th><th className="sticky-header">Cost</th><th className="sticky-header">Stock</th><th className="sticky-header">Add/Remove</th>
              </tr>
            </thead>
            <tbody>
              {this.state.spellsList.sort((a,b) => a.level-b.level).map(spell => {
                return (
                  <Fragment key={`item-number-${spell.id}`}>
                  <tr>
                    <td>{spell.name}</td><td>{spell.school}</td><td>{spell.render_level}</td><td>{spell.render_cost}</td><td>{spell.current_stock}</td><td><img src={PlusImage} className="add-remove-icons" alt="plusIcon" onClick={() => this.props.spellChanger(spell, "plus")}/><img className="add-remove-icons" src={MinusImage} alt="minusIcon" onClick={() => this.props.spellChanger(spell, "minus")}/></td>
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

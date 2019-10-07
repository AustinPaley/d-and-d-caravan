import React from 'react';

class QuestObject extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      default: "",
    }
  }

  render(){
    return(
      <div onClick={() => this.props.questHelperFunction(this.props.questInfo)} className="parchmentTop__quest" style={this.props.questInfo.selected === true ? {"border":"1px solid yellow"} : {"border": "none"}}>
        <div className="parchment__quest"></div>
        <div className="parchmentBody__quest">
          <h3>{this.props.questInfo.title}</h3>
          <div>{this.props.questInfo.description}</div>
        </div>
        <div className="parchmentBottom__quest"></div>
      </div>
    )
  }

}

export default QuestObject;

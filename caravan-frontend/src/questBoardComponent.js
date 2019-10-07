import React from 'react';
import QuestObject from './questBoardComponents/questObject.js'

class QuestBoardComponent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      quests: null,
      selectedQuest: null
    }
  }

  componentDidMount(){
    fetch("http://austins-macbook-air-2.local/questboards/1", {
      method: "GET"
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        quests: res.quests
      })
    })
  }

  questHelperFunction = (selectedQuestInfo) => {
    var newQuests = [...this.state.quests]
    newQuests.find(quest => quest.id === selectedQuestInfo.id)["selected"] = true
    for (var quest of newQuests.filter(quest => quest.id !== selectedQuestInfo.id)){
	     quest["selected"] = false
    }
    this.setState({
      selectedQuest: selectedQuestInfo,
      quests: newQuests
    })
  }

  render(){
    return(
      <div className="quest-board__wrapper">
        <div className="quest-board__board">
          {this.state.quests !== null ?
            this.state.quests.map(quest =>
              <QuestObject questHelperFunction={this.questHelperFunction} questInfo={quest}/>
            )
            :
            null
          }
        </div>
        <div className="quest-board__divider"></div>
        <div className="quest-board__description">
            {this.state.selectedQuest === null ?
              <div className="quest-board__description-container">
                Please select a quest to get started.
              </div>
            :
              <div className="quest-board__description-container">
                <div className="quest-board__description-container-inner">
                  <h3>
                    {this.state.selectedQuest.title}
                  </h3>
                  <div className="quest-board__description-container-inner-description">
                    {this.state.selectedQuest.description}
                  </div>
                  <div className="quest-board__description-container-inner-reward">
                    <h4>
                      Reward
                    </h4>
                    {this.state.selectedQuest.reward}
                  </div>
                </div>
              </div>
            }
        </div>
      </div>
    )
  }
}

export default QuestBoardComponent;

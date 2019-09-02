import React from 'react';

class AddObject extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      default: ""
    }
  }

  render(){
    var numbers = []
    for (let i=0; i<=100; i++){
      numbers.push(i)
    }

    return(
      <div>
        <div>
          <h2 className="add-object-header">Enter Item Details</h2>
        </div>
        <div style={{display: "flex", flexDirection: "column"}}>
          <div className="add-object-holder">
            <h3>Name:</h3>
            <input />
          </div>
          <div className="add-object-holder">
            <h3>Type:</h3>
            <input />
          </div>
          <div className="add-object-holder">
            <h3>Stock:</h3>
            <select>
            {numbers.map((number) => (
                <option value={number}>{number}</option>
              ))
            }
            </select>
          </div>
          <div className="add-object-holder">
            <h3>Description:</h3>
            <textarea />
          </div>
        </div>
      </div>
    )
  }

}

export default AddObject;

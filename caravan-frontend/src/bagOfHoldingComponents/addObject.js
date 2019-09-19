import React from 'react';

class AddObject extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      newItemName: "",
      newItemType: "",
      newItemClassification: "item",
      newItemStock: 0,
      newItemDescription: ""
    }
  }

  createItems = () => {
    if (this.state.newItemName === ""){
      alert("Please fill out all required fields.")
    }
    else{
      fetch("http://Austins-MacBook-Pro.local/items/",{
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({"item": this.state, "bagofholding": 1})
      })
      .then(res => res.json())
      .then(res => {
        this.props.refreshItems()
        alert("Added to Bag of Holding!")
        this.props.addItemStatusHelper()
      })
    }
  }

  handleValueChange = (value, type) => {
    if (type === "name"){
      this.setState({
        newItemName: value
      })
    }

    if (type === "type"){
      this.setState({
        newItemType: value
      })
    }

    if (type === "classification"){
      this.setState({
        newItemClassification: value
      })
    }

    if (type === "stock"){
      this.setState({
        newItemStock: parseInt(value)
      })
    }

    if (type === "description"){
      this.setState({
        newItemDescription: value
      })
    }
  }

  render(){
    var numbers = []
    for (let i=0; i<=100; i++){
      numbers.push(i.toString())
    }
    return(
      <div>
        <div className="parchmentBody">
          <div>
            <h2 className="add-object-header">Enter Item Details</h2>
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            <div className="add-object-holder">
              <h3>Name:</h3>
              {this.state.newItemName === "" ?
                <div className="add-object-required-field">This field is required.</div>
              :
                null
              }
              <input value={this.state.newItemName} onChange={(event) => this.handleValueChange(event.target.value, "name")} />
            </div>
            <div className="add-object-holder">
              <h3>Type:</h3>
              <input value={this.state.newItemType} onChange={(event) => this.handleValueChange(event.target.value, "type")} />
            </div>
            <div className="add-object-holder">
              <h3>Item or Spell?</h3>
              <select value={this.state.newItemClassification} onChange={(event) => this.handleValueChange(event.target.value, "classification")}>
                <option value="item">Item</option>
                <option value="spell">Spell</option>
              </select>
            </div>
            <div className="add-object-holder">
              <h3>Stock:</h3>
              <select value={this.state.newItemStock} onChange={(event) => this.handleValueChange(event.target.value, "stock")}>
              {numbers.map((number) => (
                  <option value={number}>{number}</option>
                ))
              }
              </select>
            </div>
            <div className="add-object-holder">
              <h3>Description:</h3>
              <textarea value={this.state.newItemDescription} onChange={(event) => this.handleValueChange(event.target.value, "description")} />
            </div>
          </div>
        </div>
        {this.props.loading === false ?
          <div className="changes-button-holder">
            <p className="cart-save-changes-button" onClick={() => this.createItems()}>Create Item</p>
          </div>
        :
          <div className="changes-button-holder">
            <p>Saving...</p>
          </div>
        }
      </div>
    )
  }

}

export default AddObject;

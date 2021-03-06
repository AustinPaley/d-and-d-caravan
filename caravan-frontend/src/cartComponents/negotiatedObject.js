import React from 'react';

class NegotiatedObject extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      existingValue: "",
      existingSelectedOption: "",
      selectedOption: "",
      newValue: ""
    }
  }

  componentDidMount(){
    this.currencyFinderHelper(this.props.info.in_cart_render_cost)
  }

  currencyFinderHelper = (costString) => {
    var existingSelectedOptionType = ""
    var itemCostDigit = ""
    if (costString.search("g") > 0){
      existingSelectedOptionType = "gold"
      itemCostDigit = costString.split("g")[0]
    }

    if (costString.search("s") > 0){
      existingSelectedOptionType = "silver"
      itemCostDigit = costString.split("s")[0]
    }

    if (costString.search("c") > 0){
      existingSelectedOptionType = "copper"
      itemCostDigit = costString.split("c")[0]
    }

    this.setState({
      existingSelectedOption: existingSelectedOptionType,
      existingValue: itemCostDigit
    })
  }

  handleCurrencyChange = (currency) => {
    this.setState({
      selectedOption: currency
    })
  }

  handlePriceChange = (value) => {
    var newValue = value.replace(/\D+/g, "")
    this.setState({
      newValue: newValue
    })
  }

  negotiationValidator = () => {
    if (this.state.selectedOption === "" || this.state.newValue === ""){
      alert("Please choose a new value and currency type!")
    }
    else{
      this.props.negotiatedPriceUpdator(this.props.info, this.state.selectedOption, this.state.newValue)
    }
  }

  render(){
    return(
      <div>
        <div>
          <h2>Negotiating...</h2>
          <h3 style={{textAlign: "left"}}><u>Name:</u> {this.props.info.name}</h3>
          <div style={{display: "inline-flex", width: "400px"}}>
            <div className="negotiation-holder" style={{display: "grid"}}>
              <label>Current Price:</label>
              <input value={this.state.existingValue} readOnly={true} className="negotiation-input" />
              <label>
                <input type="radio" value="gold" checked={this.state.existingSelectedOption === "gold"} readOnly={true} />
                Gold
              </label>
              <label>
                <input type="radio" value="silver" checked={this.state.existingSelectedOption === "silver"} readOnly={true} />
                Silver
              </label>
              <label>
                <input type="radio" value="copper" checked={this.state.existingSelectedOption === "copper"} readOnly={true} />
                Copper
              </label>
            </div>
            <div className="negotiation-holder" style={{display: "grid"}}>
              <label>Negotiated Price:</label>
              <input value={this.state.newValue} className="negotiation-input" onChange={(event) => this.handlePriceChange(event.target.value)} />
              <label>
                <input type="radio" value="gold" checked={this.state.selectedOption === "gold"} onChange={(event) => this.handleCurrencyChange(event.target.value)} />
                Gold
              </label>
              <label>
                <input type="radio" value="silver" checked={this.state.selectedOption === "silver"} onChange={(event) => this.handleCurrencyChange(event.target.value)} />
                Silver
              </label>
              <label>
                <input type="radio" value="copper" checked={this.state.selectedOption === "copper"} onChange={(event) => this.handleCurrencyChange(event.target.value)} />
                Copper
              </label>
            </div>
          </div>
        </div>
        <div className="changes-button-holder">
          <p className="cart-save-changes-button" onClick={() => this.negotiationValidator()}>Update Price</p>
        </div>
      </div>
    )
  }

}

export default NegotiatedObject;

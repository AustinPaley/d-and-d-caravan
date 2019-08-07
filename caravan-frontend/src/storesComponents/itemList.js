import React, {Fragment} from 'react';

class ItemList extends React.Component{

  componentDidMount(){
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
                <th className="sticky-header">Item Name</th><th className="sticky-header">Item Type</th><th className="sticky-header">Cost</th><th className="sticky-header">Stock</th>
              </tr>
            </thead>
            <tbody>
              {this.props.items.sort((a,b) => a.cost-b.cost).map(item => {
                return (
                  <Fragment key={`item-number-${item.id}`}>
                  <tr>
                    <td>{item.name}</td><td>{item.equipment_category}</td><td>{item.cost}</td><td>{item.current_stock}</td>
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

export default ItemList;

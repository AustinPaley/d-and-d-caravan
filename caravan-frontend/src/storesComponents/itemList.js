import React, {Fragment} from 'react';

class ItemList extends React.Component{

  componentDidMount(){
  }

  render(){
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <th>Item Name</th><th>Item Type</th><th>Cost</th><th>Stock</th>
            </tr>
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
    )
  }
}

export default ItemList;

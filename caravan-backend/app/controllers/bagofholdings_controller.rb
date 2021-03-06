class BagofholdingsController < ApplicationController
  def index
    @bagofholdings = Bagofholding.all
    render json: @bagofholdings, except: [:created_at, :updated_at]
  end

  def show
    @bagofholding = Bagofholding.find(params[:id])
    render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
  end

  def update
    @bagofholding = Bagofholding.find(params[:id])
    validUpdate = true
    if (params[:type] === "purchase")
      cartCost = sprintf("%.2f", params[:money])
      if cartCost.split(".")[0].to_i <= @bagofholding.money.split(".")[0].to_i
        add_objects(params)
      elsif ((cartCost.split(".")[0].to_i <= @bagofholding.money.split(".")[0].to_i) && ((cartCost.split(".")[1].to_i <= @bagofholding.money.split(".")[1].to_i)))
        add_objects(params)
      else
        render json: {error: "You do not have enough money to complete this purchase!", status: 406}
      end
    end

    if (params[:type] != "purchase")
      filter_objects(params)
    end
  end

private
def filter_objects(params)
  new_items_array = []
  new_spells_array = []

  params[:items].each do |item|
    currentItem = Item.find(item[:id])
    currentItem.update(
      current_stock: item[:current_stock]
    )
    new_items_array.push(currentItem)
  end

  params[:spells].each do |spell|
    currentSpell = Spell.find(spell[:id])
    currentSpell.update(
      current_stock: spell[:current_stock]
    )
    new_spells_array.push(currentSpell)
  end

  @bagofholding.items.replace(new_items_array)
  @bagofholding.spells.replace(new_spells_array)
  @bagofholding.update(money: params[:money])
  render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
end

def add_objects(params)
  params[:items].each do |item|
    oldItem = Item.find(item[:id])
    oldItem.update(
      current_stock: item[:current_stock]
    )
    currentItem = Item.create(
      name: item[:name],
      equipment_category: item[:equipment_category],
      weapon_category: item[:weapon_category],
      range: item[:range],
      cost: item[:in_cart_cost],
      damage: item[:damage],
      damage_type: item[:damage_type],
      description: item[:description],
      armor_category: item[:armor_category],
      armor_class: item[:armor_class],
      shop_id: 1,
      current_stock: item[:number_in_cart],
      item_level: item[:item_level]
    )
    @bagofholding.items.push(currentItem)
  end

  params[:spells].each do |spell|
    oldSpell = Spell.find(spell[:id])
    oldSpell.update(
      current_stock: spell[:current_stock]
    )
    currentSpell = Spell.create(
      name: spell[:name],
      casting_time: spell[:casting_time],
      components: spell[:components],
      description: spell[:description],
      duration: spell[:duration],
      level: spell[:level],
      range: spell[:range],
      school: spell[:school],
      cost: spell[:in_cart_cost],
      current_stock: spell[:number_in_cart],
      shop_id: 1
    )
    @bagofholding.spells.push(currentSpell)
  end
  if (params[:type] != "purchase")
    @bagofholding.update(money: params[:money])
  elsif params[:type] === "purchase"
    lengthSplitHelper = ((@bagofholding.money.to_f * 100) - (params[:money].to_f * 100)).to_s.split(".")[0].length - 2
    if lengthSplitHelper > 0
      newMoney = ((@bagofholding.money.to_f * 100) - (params[:money].to_f * 100)).to_s.split(".")[0].insert(lengthSplitHelper, ".")
    else
      newMoney = "0" + ((@bagofholding.money.to_f * 100) - (params[:money].to_f * 100)).to_s.split(".")[0].insert(lengthSplitHelper, ".")
    end
    @bagofholding.update(money: newMoney)
  end
  render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
end

end

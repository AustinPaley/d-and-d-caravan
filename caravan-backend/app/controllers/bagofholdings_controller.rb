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
    newItems = []
    params[:items].each do |item|
      currentItem = Item.find(item[:id])
      currentItem.update(
        name: item[:name],
        equipment_category: item[:equipment_category],
        weapon_category: item[:weapon_category],
        range: item[:range],
        cost: item[:cost],
        damage: item[:damage],
        damage_type: item[:damage_type],
        description: item[:description],
        armor_category: item[:armor_category],
        armor_class: item[:armor_class],
        shop_id: item[:shop_id],
        current_stock: item[:current_stock],
        item_level: item[:item_level]
      )
      newItems.push(currentItem)
    end
    newSpells = params[:spells].map do |spell|
      Spell.find(spell[:id])
    end
    @bagofholding.update(items: newItems, spells: newSpells, money: params[:money])
    render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
  end
end

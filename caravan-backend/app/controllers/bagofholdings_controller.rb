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
      @bagofholding.items.push(currentItem)
    end
    params[:spells].each do |spell|
      currentSpell = Spell.find(spell[:id])
      currentSpell.update(
        name: spell[:name],
        casting_time: spell[:casting_time],
        components: spell[:components],
        description: spell[:description],
        duration: spell[:duration],
        level: spell[:level],
        range: spell[:range],
        school: spell[:school],
        cost: spell[:cost],
        current_stock: spell[:current_stock],
        shop_id: spell[:shop_id]
      )
      @bagofholding.spells.push(currentSpell)
    end
    # @bagofholding.update(items: newItems, spells: newSpells, money: params[:money])
    render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
  end
end

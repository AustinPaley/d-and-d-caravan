class ItemsController < ApplicationController

  def create
    @bagofholding = Bagofholding.find(params[:bagofholding])
    if params[:item][:newItemClassification] === "item"
      newItem = Item.create(
        name: params[:item][:newItemName],
        equipment_category: params[:item][:newItemType],
        description: params[:item][:newItemDescription],
        current_stock: params[:item][:newItemStock],
        shop_id: 1
      )
      @bagofholding.items.push(newItem)
    end

    if params[:item][:newItemClassification] === "spell"
      newSpell = Spell.create(
        name: params[:item][:newItemName],
        school: params[:item][:newItemType],
        description: params[:item][:newItemDescription],
        current_stock: params[:item][:newItemStock],
        shop_id: 1
      )
      @bagofholding.spells.push(newSpell)
    end

    render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
  end

  def update
    @bagofholding = Bagofholding.find(params[:bagofholding])
    if params[:item][:newItemClassification] === "item"
      @item = @bagofholding.items.find(params[:id])
      @item.update(
        name: params[:item][:newItemName],
        equipment_category: params[:item][:newItemType],
        description: params[:item][:newItemDescription],
        current_stock: params[:item][:newItemStock],
        shop_id: 1
      )
    end

    if params[:item][:newItemClassification] === "spell"
      @spell = @bagofholding.spells.find(params[:id])
      @spell.update(
        name: params[:item][:newItemName],
        school: params[:item][:newItemType],
        description: params[:item][:newItemDescription],
        current_stock: params[:item][:newItemStock],
        shop_id: 1
      )
    end
    render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
  end

  def delete
    byebug
  end

end

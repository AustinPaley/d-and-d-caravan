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
    newItems = params[:items].map do |item|
      Item.find(item[:id])
    end
    newSpells = params[:spells].map do |spell|
      Spell.find(spell[:id])
    end
    @bagofholding.update(items: newItems, spells: newSpells, money: params[:money])
    render json: {bag: {id: @bagofholding.id, items: @bagofholding.items, spells: @bagofholding.spells, money: @bagofholding.money}}
  end
end

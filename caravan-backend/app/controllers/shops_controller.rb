class ShopsController < ApplicationController
  def index
    @shops = Shop.where.not(id: params[:exclude])
    render json: @shops, except: [:created_at, :updated_at]
  end

  def show
    @shop = Shop.find(params[:id])
    render json: {shop: {id: @shop.id, name: @shop.name, level: @shop.level}, owner: {name: @shop.character.name, race: @shop.character.race.race, image: @shop.character.character_image}, items: @shop.items, spells: @shop.spells}
  end

  def update
    @shop = Shop.find(params[:id])
    @shop.update(level: params[:level])
    render json: @shop
  end
end

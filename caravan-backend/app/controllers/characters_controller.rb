class CharactersController < ApplicationController
  def index
    @characters = Character.all
    render json: @characters, except: [:created_at, :updated_at]
  end

  def show
    @character = Character.find(params[:id])
    render json: {name: @character.name, race: @character.race.race, shop: @character.shop.name}
  end
end

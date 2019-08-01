class CharactersController < ApplicationController
  def index
    @characters = Character.all
    render json: @characters
  end

  def show
    @character = Character.find(params[:id])
    render json: @character, except: [:created_at, :updated_at, :race_id], include: :race
  end
end

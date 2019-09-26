class QuestboardsController < ApplicationController
  def index
    @questboards = Questboard.all
    render json: @questboards
  end

  def show
    @questboard = Questboard.find(params[:id])
    render json: {questboard: {id: @questboard.id, name: @questboard.name}, quests: @questboard.quests}
  end
end

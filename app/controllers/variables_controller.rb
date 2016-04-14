class VariablesController < ApplicationController

  before_action :authenticate_user!

  def index
    @variables = Variable.all.where(:user_id => current_user.id)
  end

  def show
    @variable = Variable.find(params[:id])
  end

  def new
    @variable = Variable.new
  end

  def create
    @variable = Variable.new(variable_params)
    @variable.user_id = current_user.id
    if @variable.save
      redirect_to action: "index"
    end
  end

  def edit
    @variable = Variable.find(params[:id])
  end

  def update
    @variable = Variable.find(params[:id])
    @variable.update_attributes(name: params[:name], value: params[:value])
  end

  def destroy
    @variable = Variable.find(params[:id])
    if @variable.destroy
      redirect_to action: "index"
    end
  end

  private
    def variable_params
      params.require(:variable).permit(:name, :value)
    end

end

# == Schema Information
#
# Table name: variables
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  value      :integer
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
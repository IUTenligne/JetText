class ContainersController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_permission, only: [:show, :update, :destroy, :generate]
  respond_to :html, :json

  def require_permission
    if current_user != Container.find(params[:id]).user || current_user.nil?
      raise JetText::NotAllowed.new 
    end
  end
  
  def index
    @containers = Container.select("id, name, content").all.where(:user_id => current_user.id)
    render json: { containers: @containers }
  end

  def show
    @container = Container.select("id, name").find(params[:id])
    @pages = Page.select("id, name, sequence, level").where(container_id: params[:id])
    #sleep 3 #simulation long loading query
    render json: { status: { state: 0 }, container: @container, pages: @pages }
  end

  def new
    @container = Container.new
  end

  def update
    @container = Container.find(params[:id])
    @container.update_attributes(:name => params[:name], :content => params[:content])
    render json: { container: @container }
  end

  def create
    @container = Container.new(container_params)
    @container.user_id = current_user.id
    @container.url = current_user.email
    if @container.save
      # redirects to React's container url after save
      redirect_to "/#/containers/#{@container.id}"
    end
  end

  def destroy
    @container = Container.find(params[:id])
    if @container.destroy
      render json: { status: "ok", container: @container.id }
    end
  end

  def generate
    require 'fileutils'
    require 'generator/generator'

    @container = Container.find(params[:id])
    @pages = Page.where(:container_id => @container.id).order('sequence asc')

    Generator.generate(@container.user.email, @container, @pages)

    respond_to do |format|
      format.html { head :no_content }
    end
  end
  
  private
    def container_params
      params.require(:container).permit(:name, :content, :url)
    end
 
end

# == Schema Information
#
# Table name: containers
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  content    :binary(16777215)
#  url        :string(255)
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
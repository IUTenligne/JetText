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
    @containers = Container.select("id, name, content").all.where(:user_id => current_user.id).where(:visible => 1)
    render json: { containers: @containers }
  end

  def show
    @container = Container.select("id, name").find(params[:id]).where(:visible => 1)
    @pages = Page.select("id, name, sequence, level").where(container_id: params[:id])
    #sleep 3 #simulation long loading query
    render json: { status: { state: 0 }, container: @container, pages: @pages }
  end

  def update
    @container = Container.find(params[:id])
    @container.update_attributes(:name => params[:name], :content => params[:content])
    render json: { container: @container }
  end

  def validate
    @container = Container.find(params[:id])
    @container.update_attributes(:status => 1)
    render json: { container: @container }
  end

  def create
    @container = Container.new(container_params)
    @container.user_id = current_user.id
    @container.url = current_user.email
    @container.companies = Company.where(id: 1)
    if @container.save
      render json: {content: "", id: @container.id, name: @container.name}
    end
  end

  def delete
    @container = Container.find(params[:id])
    @container.update_attributes(visible: false)
    render json: { status: "ok", container: @container.id }
  end

  def destroy
    @container = Container.find(params[:id])
    if @container.destroy
      render json: { status: "ok", container: @container.id }
    end
  end

  private
    def container_params
      params.require(:container).permit(:name, :content, :url, :visible, :status)
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
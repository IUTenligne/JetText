class PagesController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_permission, only: [:show, :update, :destroy, :update_level]
  respond_to :json

  def require_permission
    if current_user != Page.find(params[:id]).user || current_user.nil?
      raise JetText::NotAllowed.new
    end
  end

  def index
    @pages = Page.all.where(:user_id => current_user.id)
  end

  def show
    @page = Page.select("id, name, sequence, level, container_id, user_id").find(params[:id])
    @blocks = Block.select("id, name, content, classes, type_id, upload_id").where(page_id: @page.id)
    if @page.present?
      render json: { status: { state: 0 }, container: @page.container.name, page: @page, blocks: @blocks }
    else
      render json: { status: { state: "error" } }
    end
  end

  def create
    @page = Page.new(page_params)
    @page.user_id = current_user.id
    @page.level = 0 if @page.level.nil?
    @container = Container.find(@page.container_id) if Container.exists?(@page.container_id)
    if @container.present?
      if @page.save
        render json: @page
      end
    end
  end

  def update
    @page = Page.find(params[:id])
    @page.update_attribute(:name, params[:name])
    render :nothing => true
  end

  def destroy
    @page = Page.find(params[:id])
    if @page.destroy
      render json: { status: "ok", page: @page.id }
    else
      redirect_to "/#/containers/#{@page.container_id}"
    end
  end

  def update_level
    @page = Page.find(params[:id])
    @page.update_attributes(:level => params[:level])
    render :nothing => true
  end

  def sort
    params[:sequence].each do |key, value|
      @page = Page.find(value[:id])
      @page.update_attribute(:sequence, value[:sequence])
      @page.sequence = value[:sequence]
      if @page.sequence == 0
        @page.update_attribute(:level, 0)
      end
    end
    render :nothing => true
  end

  private
    def page_params
      params.require(:page).permit(:name, :sequence, :level, :container_id, :user_id)
    end
  
end


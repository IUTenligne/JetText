class PagesController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_permission, only: [:show, :update, :destroy, :update_level]
  respond_to :html, :json

  def require_permission
    if current_user != Page.find(params[:id]).user || current_user.nil?
      respond_to do |format|
        format.json { render json: { status: "error" } }
      end 
    end
  end

  def index
    @pages = Page.all.where(:user_id => current_user.id)
  end

  def show
    @page = Page.find(params[:id])
    @pages = Page.select("id, name").where(:container_id => @page.container_id).order(sequence: :asc)
    @blocks = Block.select("id, name, content, type_id, upload_id").where(page_id: @page.id)
    respond_to do |format|
      format.html
      format.json { render json: { page: @page, container: @page.container.name, blocks: @blocks } }
    end 
  end

  def create
    @page = Page.new(page_params)
    @page.user_id = current_user.id
    @page.level = 0 if @page.level.nil?
    @page.sequence = 0

    @container = Container.find(@page.container_id) if Container.exists?(@page.container_id)
    if @container.present?
      if @page.save
        respond_to do |format|
          format.json { render json: @page }
        end
      end
    end
  end

  def update
    @page = Page.find(params[:id])
    @page.update_attribute(:name, params[:page][:name])
  end

  def destroy
    @page = Page.find(params[:id])
    if @page.destroy
      respond_to do |format|
        format.json { render json: {status: "ok", page: @page.id} }
      end
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
      Page.find(value[:id]).update_attribute(:sequence, value[:sequence])
    end
    render :nothing => true
  end

  private
    def page_params
      params.require(:page).permit(:name, :sequence, :level, :container_id, :user_id)
    end
  
end


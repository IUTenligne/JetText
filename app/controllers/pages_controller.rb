class PagesController < ApplicationController

  before_action :authenticate_user!
  respond_to :html, :json
  require 'image_generator/image_generator'
  include ImageGenerator

  def index
    @pages = Page.all.where(:user_id => current_user.id)
  end

  def show
    @page = Page.find(params[:id])
    @pages = Page.select("id, name").where(:container_id => @page.container_id).order(sequence: :asc)
    @blocks = Block.select("id, name, content, type_id, upload_id").where(page_id: @page.id)
    unless @page.user_id == current_user.id
      redirect_to action: "index"
    end
    respond_to do |format|
      format.html
      format.json { render json: { page: @page, container: @page.container.name, pages: @pages, blocks: @blocks } }
    end 
  end

  def new
    @new_page = Page.new
  end

  def create
    @page = Page.new(page_params)
    @page.user_id = current_user.id
    @container = Container.find(@page.container_id) if Container.exists?(@page.container_id)
    if @container.present? && current_user.id == @container.user_id
      if @page.save
        respond_to do |format|
          format.json { render json: @page }
        end
      end
    end
  end

  def edit
    @page = Page.find(params[:id])
    @upload = Upload.new
  end

  def update
    @page = Page.find(params[:id])
    @page.update_attribute(:name, params[:page][:name])
  end

  def destroy
    @page = Page.find(params[:id])
    if @page.user_id == current_user.id
      if @page.destroy
        respond_to do |format|
          format.json { render json: {status: "ok", page: @page.id} }
        end
      end
    else
      redirect_to "/#/containers/#{@page.container_id}"
    end
  end

  def update_ajax
    @page = Page.find(params[:id])
    if current_user.id == @page.user_id
      @page.update_attributes(:name => params[:name])
    end
    render :nothing => true
  end

  def sort
    params[:sequence].each do |key, value|
      Page.find(value[:id]).update_attribute(:sequence, value[:sequence])
    end
    render :nothing => true
  end

  def levelize
    @page = Page.find(params[:id])
    if params[:do] == 'inc'
      if @page.level.nil?
        @page.update_attribute(:level, 1)
      else
        @page.update_attribute(:level, @page.level + 1)
      end
    else
      if @page.level.nil?
        @page.update_attribute(:level, 1)
      else
        unless @page.level == 1 || @page.level == 0
          @page.update_attribute(:level, @page.level - 1)
        end
      end
    end
    render :nothing => true
  end

  private
    def page_params
      params.require(:page).permit(:name, :sequence, :level, :container_id, :user_id)
    end
  
end


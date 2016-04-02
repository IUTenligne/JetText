class ContainersController < ApplicationController

  before_action :authenticate_user!
  respond_to :html, :json
  skip_before_filter :verify_authenticity_token
  require 'image_generator/image_generator'
  
  def index
    @containers = Container.select("id, name").all.where(:user_id => current_user.id)
    respond_to do |format|
      format.html
      format.json { render json: @containers }
    end
  end

  def show
    @container = Container.find(params[:id])
    @pages = Page.select("id, name").where(:container_id => @container.id)
    @new_page = Page.new
    unless @container.user_id == current_user.id
      redirect_to action: "index"
    end
    respond_to do |format|
      format.html
      format.json { render json: {container: @container, pages: @pages} }
    end
  end

  def new
    @container = Container.new
  end

  def create
    @container = Container.new(container_params)
    @container.user_id = current_user.id
    @container.url = current_user.email
    if @container.save
      respond_to do |format|
        format.html { head :no_content }
      end
    end
  end
 
  def edit
    @container = Container.find(params[:id])
  end

  def update
    @container = Container.where(:id => params[:id]).where(:user_id => current_user.id).take
    if params[:container][:content].empty?
      val = ""
    else
      val = params[:container][:content]
    end

    @doc = ImageGenerator.image_transformer(val, @container.url)

    if @container.update_attribute(:content, @doc)
      redirect_to container_path(@container.id)
    end
  end

  def destroy
    @container = Container.find(params[:id])
    if @container.user_id == current_user.id
      if @container.destroy
        redirect_to action: "index"
      end
    else
      redirect_to action: "index"
    end
  end

  def generate
    require 'fileutils'
    require 'generator/generator'

    @container = Container.find(params[:id])
    @pages = Page.where(:container_id => @container.id)
    
    Generator.generate(@container.user.email, @container, @pages)

    respond_to do |format|
      format.html { head :no_content }
    end
  end
  
  private
    def container_params
      params.require(:container).permit(:name, :content, :url)
    end

    def create_folder
      return nil unless current_user.present?
      dest = "#{Rails.root}/public/#{current_user.email}"
      FileUtils.mkdir_p dest
      return dest
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
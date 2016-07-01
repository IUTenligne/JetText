class ContainersController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_permission, only: [:show, :update, :destroy, :generate]
  before_filter :require_validation
  respond_to :html, :json

  def require_permission
    if current_user != Container.find(params[:id]).user || current_user.nil?
      raise JetText::NotAllowed.new
    end
  end

  def index
    @containers = Container.select("id, name, created_at, status")
      .where(:user_id => current_user.id).where(:visible => 1)
    results = Array.new
    @containers.each do |container|
      container.categories
    end
    # methods allows the json rendering of the attr_accessor's field "categories"
    render json: @containers, methods: [:categories]
  end

  def show
    @container = Container.select("id, name").find(params[:id])
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
    # The user pushes the container to admin valdiation
    @container = Container.find(params[:id])
    @prev_version = Version.where(container_id: @container.id).last
    @container.update_attributes(:status => 1)

    @version = Version.new(container_id: @container.id)
    @version.save

    @pages = Page.where(:container_id => @container.id)
    @pages.each do |page|
      @blocks = Block.where(:page_id => page.id).where(:version_id => @prev_version.id)
      @blocks.each do |block|
        @new_block = block.dup
        @new_block.version_id = @version.id
        @new_block.save
      end
    end

    # Send update email
    UserMailer.container_update_message(@container).deliver

    render json: { containers: Container.select("id, name, content, status").all.where(:user_id => current_user.id).where(:visible => 1) }
  end

  def send_update
    # The user pushes a new version (update) of the container to admin validation
    @container = Container.find(params[:id])
    @prev_version = Version.where(container_id: @container.id).last

    @version = Version.new(container_id: @container.id)
    @version.save

    @pages = Page.where(:container_id => @container.id)
    @pages.each do |page|
      @blocks = Block.where(:page_id => page.id).where(:version_id => @prev_version.id)
      @blocks.each do |block|
        @new_block = block.dup
        @new_block.version_id = @version.id
        @new_block.save
      end
    end

    # Send update email
    UserMailer.container_update_message(@container).deliver

    render json: { containers: Container.select("id, name, content, status").all.where(:user_id => current_user.id).where(:visible => 1) }
  end

  def create
    @container = Container.new(container_params)
    @container.user_id = current_user.id
    @container.url = current_user.email
    @container.companies = Company.where(id: 1)
    if @container.save
      if params[:container]["categories"].present?
        categories = Category.where(:id => params[:container]["categories"])
        categories.each do |c|
          @container.categories << c
        end
      end
      @version = Version.new(container_id: @container.id)
      @version.save
      render json: { id: @container.id, name: @container.name, content: "", created_at: @container.created_at, categories: @container.categories }
    end
  end

  def delete
    @container = Container.find(params[:id])
    if @container.status == false
      @container.update_attributes(:visible => 0)
    end
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

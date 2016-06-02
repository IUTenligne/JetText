class BlocksController < ApplicationController

	before_action :authenticate_user!
  before_filter :require_permission, only: [:update, :destroy, :set_content]
  before_filter :require_validation
  respond_to :html, :json

  def require_permission
    if current_user != Block.find(params[:id]).user || current_user.nil?
      raise JetText::NotAllowed.new 
    end
  end

	def index
    @page = Page.find(params[:id])
    @version = Version.where(container_id: @page.container.id).last
		@blocks = Block.where(page_id: @page.id).where(version_id: @version.id)
		respond_to do |format|
      format.json { render json: { blocks: @blocks } }
    end
  end

  def create
  	@block = Block.new(block_params)
    @block.version_id = Version.where(container_id: @block.page.container.id).last.id
  	@block.user_id = current_user.id
    if @block.page_id.present?
    	if @block.save
        render json: { id: @block.id, name: @block.name, content: @block.content, type_id: @block.type_id, upload_id: @block.upload_id }
      end 
    else
      render json: { status: "error" }
    end
  end

  def update
    @block = Block.find(params[:id])
    @block.update_attributes(:name => params[:name], :content => params[:content], :classes => params[:classes])
    render json: { name: @block.name, content: @block.content, classes: @block.classes }
  end

  def export
    @block = Block.find(params[:id])
    @export = @block.dup
    if Page.find(params[:page_id]).user == current_user
      @export.page_id = params[:page_id]
      @export.save
      render json: { block: @export }
    else
      render json: { status: "error" }
    end
  end

  def update_classes
    @block = Block.find(params[:id])
    @block.update_attributes(:classes => params[:classes])
    render json: { classes: @block.classes }
  end

  def update_upload
    @block = Block.find(params[:id])
    @block.update_attributes(:content => params[:content], :upload_id => params[:upload_id])
    render json: { content: @block.content }
  end

  def destroy
    @block = Block.find(params[:id])
    if @block.user_id == current_user.id
      if @block.destroy
        render json: { status: "ok", block: @block.id }
      end
    else
      render json: { status: "error" }
    end
  end

  def set_content
    Block.find(params[:id]).update_attributes(content: params[:content], upload_id: params[:upload_id])
    render :nothing => true
  end

  def sort
    params[:sequence].each do |key, value|
      Block.find(value[:id]).update_attribute(:sequence, value[:sequence])
    end
    render :nothing => true
  end

  private
    def block_params
      params.require(:block).permit(:name, :content, :sequence, :classes, :page_id, :user_id, :type_id, :upload_id)
    end

end

# == Schema Information
#
# Table name: blocks
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  content    :text(65535)
#  user_id    :integer
#  page_id    :integer
#  type_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

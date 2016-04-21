class BlocksController < ApplicationController

	before_action :authenticate_user!
  before_filter :require_permission, only: [:update, :destroy, :set_content]
  respond_to :html, :json

  def require_permission
    if current_user != Block.find(params[:id]).user || current_user.nil?
      raise JetText::NotLoggedIn.new 
    end
  end

	def index
		@blocks = Block.where(page_id: params[:id])
		respond_to do |format|
      format.json { render json: { blocks: @blocks } }
    end
  end

  def create
  	@block = Block.new(block_params)
  	@block.user_id = current_user.id
  	if @block.save
      render json: { id: @block.id, name: @block.name, content: @block.content, type_id: @block.type_id, upload_id: @block.upload_id }
    end 
  end

  def update
    @block = Block.find(params[:id])
    @block.update_attributes(:content => params[:content])
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

  private
    def block_params
      params.require(:block).permit(:name, :content, :page_id, :user_id, :type_id, :upload_id)
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

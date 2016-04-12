class BlocksController < ApplicationController

	before_action :authenticate_user!
  respond_to :html, :json

	def index
		@blocks = Block.where(page_id: params[:id])
		respond_to do |format|
      format.html
      format.json { render json: { blocks: @blocks } }
    end
  end

  def create
  	@block = Block.new(block_params)
  	@block.user_id = current_user.id
  	if @block.save
      respond_to do |format|
        format.json { render json: {block: @block} }
      end
    end 
  end

  private
    def block_params
      params.require(:block).permit(:name, :content, :page_id, :user_id)
    end

end
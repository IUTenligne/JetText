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

  def update
    @block = Block.find(params[:id])
    if current_user.id == @block.user_id
      @block.update_attributes(:content => params[:content])
    end
    render :nothing => true
  end

  private
    def block_params
      params.require(:block).permit(:name, :content, :page_id, :user_id)
    end

end
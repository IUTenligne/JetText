class TermsController < ApplicationController
	
	before_action :authenticate_user!

	def index
		@terms = Terms.all
	end

	def show
  		@terms = Terms.find(params[:id])
  	end

	def new
  		@terms = Terms.new
  	end

	def create
		@terms = Terms.new(terms_params)
	    @terms.user_id = current_user.id
	    if @terms.save
	      respond_to do |format|
	        format.json { render json: @page }
	      end
	    end
	end

	def edit
  	end

  	private
    	def term_params
      		params.require(:term).permit(:name, :description)
    	end
end
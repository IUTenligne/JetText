class TermsController < ApplicationController
	
	before_action :authenticate_user!
  	respond_to :json

	def index
		@terms = Term.select("id, name").all
		respond_to do |format|
	      format.json { render json: { term: @term } }
	    end
	end

	def show
  		@terms = Term.find(params[:id])
  	end

	def new
  		@terms = Term.new
  	end

	def edit
  	end

end
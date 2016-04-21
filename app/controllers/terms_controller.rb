class TermsController < ApplicationController
	
	before_action :authenticate_user!
  respond_to :json

	def index
		@terms = Term.select("id, name").all
		render json: { term: @term }
	end

	def show
  	@terms = Term.find(params[:id])
  end

	def new
  	@terms = Term.new
  end

end
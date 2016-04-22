class TermsController < ApplicationController

	before_action :authenticate_user!
  respond_to :json

	def index
		@terms = Term.select("id, name").all
		render json: { term: @term }
	end

	def show
  	@term = Term.find(params[:id])
		render json: { term: @term}
  end

	def create
		@term = Term.new(term_params)

		@glossary = Glossary.find(params[:term][:glossary_id]) if Glossary.exists?(params[:term][:glossary_id])
		if @glossary.present?
			if @term.save
				render json: @term
			end
		else
			render json: "Error"
		end
	end

	def destroy
	    @term = Term.find(params[:id])
	    if @term.destroy
	      render json: { status: "ok", term: @term.id }
	    else
	      redirect_to "/#/glossaries/#{@glossary.glossary_id}"
	    end
	end

	private
    def term_params
      params.require(:term).permit(:name, :description, :glossary_id)
    end

end

class TermsController < ApplicationController

	before_action :authenticate_user!
  respond_to :json

	def require_permission
    if current_user != Term.find(params[:id]).user || current_user.nil?
      render json: { status: "error" }
    end
  end

	def index
		@terms = Term.select("id, name").all
		render json: { terms: @terms } }
	end

	def show
  		@term = Term.find(params[:id])
			render json: { term: @term}
  end

	def create
		@term = Term.new(glossary_params)
		@term.user_id = current_user.id

		@glossary = Glossary.find(@glossary.container_id) if Glossary.exists?(@glossary.container_id)
		if @glossary.present?
			if @term.save
				render json: @term
			end
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

end

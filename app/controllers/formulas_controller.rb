class FormulasController < ApplicationController

	before_action :authenticate_user!
  respond_to :json

	def index
		@formulas = Formula.where(user_id: current_user.id)
		render json: { formulas: @formulas }
	end

	def create
		@formula = Formula.new(formula_params)
		@formula.user_id = current_user.id
		if @formula.save
			render json: { formula: @formula }
		end
	end

	private
		def formula_params
      params.require(:formula).permit(:name, :value)
    end

end
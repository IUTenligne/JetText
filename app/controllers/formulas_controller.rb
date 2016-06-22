class FormulasController < ApplicationController

	before_action :authenticate_user!
	before_filter :require_validation
  respond_to :json

	def index
		@formulas = Formula.where(user_id: current_user.id).where(user_id: current_user.id)
		render json: { formulas: @formulas }
	end

	def create
		@formula = Formula.new(formula_params)
		@formula.user_id = current_user.id
		if @formula.save
			render json: { formula: @formula }
		end
	end

	def find
		@formulas = Formula.select("id, name, value").where("formulas.name LIKE ?", "#{params[:searched]}%").where(user_id: current_user.id)
		unless @formulas.empty?
			render json: { status: 0, formulas: @formulas } 
		else
			render json: { status: 1 }
		end
	end

	private
		def formula_params
      params.require(:formula).permit(:name, :value)
    end

end
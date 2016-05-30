class CompaniesController < ApplicationController

  def index
    
  end

  def show
    @containers = Company.find(params[:id]).containers
    render json: { containers: @containers }
  end

  private
    def company_params
      params.require(:container).permit(:name)
    end

end

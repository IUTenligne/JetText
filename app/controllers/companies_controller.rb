class CompaniesController < ApplicationController

  def index
    
  end

  def show
  	@company = Company.find(params[:id])
    @containers = @company.containers
    @users = Array.new
    @containers.each do |c|
    	@users << c.user.firstname + " " + c.user.lastname
    end
    render json: { company: @company, containers: @containers, users: @users }
  end

  private
    def company_params
      params.require(:container).permit(:name)
    end

end

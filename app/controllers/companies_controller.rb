class CompaniesController < ApplicationController

  before_filter :require_validation

  def index
    
  end

  def show
  	@company = Company.find(params[:id])

    @inc_containers = @company.containers.where(status: 0).where(visible: 1)
    @validated_containers = @company.containers.where(status: 1)
    @deleted_containers = @company.containers.where(visible: 0)

    @inc_users = Array.new
    @inc_containers.each do |c|
    	@inc_users << c.user.firstname + " " + c.user.lastname
    end

    @validated_users = Array.new
    @validated_containers.each do |c|
    	@validated_users << c.user.firstname + " " + c.user.lastname
    end

    @deleted_users = Array.new
    @deleted_containers.each do |c|
      @deleted_users << c.user.firstname + " " + c.user.lastname
    end

    render json: { 
    	company: @company,
    	inc_containers: @inc_containers, 
    	validated_containers: @validated_containers, 
    	inc_users: @inc_users, 
    	validated_users: @validated_users,
      deleted_containers: @deleted_containers,
      deleted_users: @deleted_users
    }
  end

  private
    def company_params
      params.require(:container).permit(:name)
    end

end
class =ContainerTermController  < ActiveSupport

  before_action :authenticate_user!
  before_filter :require_permission, only: [:show, :update, :destroy]
    respond_to :json

  def require_permission
      if current_user != Glossary.find(params[:id]).user || current_user.nil?
        render json: { status: "error" }
      end
  end

  def new
    @containerTerm = ContainerTerm.new
  end

  def create
    @containerTerm = ContainerTerm.new(containerTerm_params)
    if @interaction.save
      render json: @containerTerm
    end
  end

end
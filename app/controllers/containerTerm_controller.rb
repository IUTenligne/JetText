class =ContainerTermController  < ActiveSupport

  before_action :authenticate_user!
  before_filter :require_permission, only: [:show, :update, :destroy]
    respond_to :json

  def require_permission
      if current_user != Glossary.find(params[:id]).user || current_user.nil?
        render json: { status: "error" }
      end
  end

  def setup
    @containerTerm = ContainerTerm.new(term_id: 1, container_id: 2)
  end

end
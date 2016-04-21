class GlossariesController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_permission, only: [:show, :update, :destroy]
  respond_to :json

  def require_permission
    if current_user != Glossary.find(params[:id]).user || current_user.nil?
      render json: { status: "error" }
    end
  end

  def index
  	@glossaries = Glossary.select("id, name").all
    render json: { glossaries: @glossaries }
  end

  def show
  	@glossary = Glossary.find(params[:id])
    render json: { glossary: @glossary }
  end

  def new
  	@glossary = Glossary.new
  end

  def create
    @glossary = Glossary.new(glossary_params)
    @glossary.user_id = current_user.id
    if @glossary.save
      respond_to do |format|
        format.html { head :no_content }
      end
    end
  end

  def edit
  end

  private
    def glossary_params
      params.require(:glossary).permit(:name)
    end
end

# == Schema Information
#
# Table name: glossaries
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text(65535)
#  user_id     :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
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
  	@glossaries = Glossary.select("id, name").where(user_id: current_user.id)
    render json: { glossaries: @glossaries }
  end

  def glossaries_box
    @glossaries = Glossary.select("id, name").where(user_id: current_user.id)
    @containers_glossaries = ContainersGlossary.select("glossary_id").where(container_id: params["id"])
    render json: { glossaries: @glossaries, containers_glossaries: @containers_glossaries }
  end

  def show
  	@glossary = Glossary.find(params[:id])
    render json: { glossary: @glossary, terms: @glossary.terms }
  end

  def create
    @glossary = Glossary.new(glossary_params)
    @glossary.user_id = current_user.id
    if @glossary.save
      render json: @glossary
    end
  end

  def destroy
    @glossary = Glossary.find(params[:id])
    if @glossary.destroy
       render json: {status: "ok", glossary: @glossary.id}
    end
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
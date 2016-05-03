class ContainersGlossariesController < ApplicationController

  before_filter :require_permission, only: [:create]

  def require_permission
    if current_user != Container.find(params["container_id"]).user || current_user.nil?
      render json: { status: "error" }
    end
  end 

  def create
    @containers_glossaries = ContainersGlossary.new(container_id: params["container_id"], glossary_id: params["glossary_id"])
    if @containers_glossaries.save
      render json: @containers_glossaries
    end
  end

end
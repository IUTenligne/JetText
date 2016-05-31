class VersionsController < ApplicationController

  before_action :authenticate_user!
  respond_to :html, :json

  def show_all
    @versions = Version.where(container_id: params[:id]).order('updated_at DESC')
    render json: { versions: @versions }
  end  

  def show
    @version = Version.find(params[:id])
    @latest = Version.where(container_id: @version.container_id).last

    @version_blocks = Block.where(version_id: @version.id)
    @latest_blocks = Block.where(version_id: @latest.id)

    render json: { version: @version, version_blocks: @version_blocks, latest_blocks: @latest_blocks }
  end 

end

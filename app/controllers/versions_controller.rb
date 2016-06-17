class VersionsController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_validation
  respond_to :html, :json

  def show_all
    @latest = Version.where(container_id: params[:id]).last
    # find all but the latest (actual) version
    @versions = Version.where(container_id: params[:id]).where.not(id: @latest.id).order('updated_at DESC')
    
    @blocks = Block.where(version_id: @versions.last.id)
    words = 0
    @blocks.map{ |b| 
      words = words + b.content.scan(/\w+/).size 
    }

    render json: { latest: @latest, versions: @versions, words: words }
  end  

  def show
    @version = Version.find(params[:id])
    @latest = Version.where(container_id: @version.container_id).last

    @pages = Page.where(container_id: @latest.container_id)
    @contents = Array.new

    render json: { version: @version, pages: @pages }
  end 

end

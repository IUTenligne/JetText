class VersionsController < ApplicationController

  before_action :authenticate_user!
  respond_to :html, :json

  def show_all
    @versions = Version.where(container_id: params[:id]).order('updated_at DESC')
    @blocks = Block.where(version_id: @versions.last.id)

    words = 0
    @blocks.map{ |b| 
      words = words + b.content.scan(/\w+/).size 
    }

    render json: { versions: @versions, words: words }
  end  

  def show
    @version = Version.find(params[:id])
    @latest = Version.where(container_id: @version.container_id).last

    @pages = Page.where(container_id: @latest.container_id)
    @contents = Array.new

    render json: { version: @version, pages: @pages }
  end 

  def diffs
    @version = Version.find(params[:id])
    @latest = Version.where(container_id: @version.container_id).last
    @blocks = Block.where(page_id: params[:page_id])
    @contents = Array.new

    @version_blocks = Block.where(version_id: @version.id).where(page_id: params[:page_id])
    @latest_blocks = Block.where(version_id: @latest.id).where(page_id: params[:page_id])

    @latest_blocks.each_with_index do |block, index|
      @diff = Block.new(id: index)
      if @version_blocks[index] && @version_blocks[index].content
        @diff.content = Diffy::Diff.new(@version_blocks[index].content, block.content).to_s(:html)
      else
        @diff.content = Diffy::Diff.new("", block.content).to_s(:html)
      end
      @contents.push(@diff)
    end

    render json: { contents: @contents }
  end

end

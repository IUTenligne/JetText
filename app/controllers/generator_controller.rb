class GeneratorController < ApplicationController

	before_action :authenticate_user!
  
  def container
  	@container = Container.find(params[:id])
  	@pages = Page.where(container_id: params[:id])
  end

  def page
  	@page = Page.find(params[:id])
  	@container = Container.find(@page.container_id)
  	@pages = Page.where(container_id: params[:id])
  	@blocks = Block.where(page_id: params[:id])
  end

  def save
  	@container = Container.find(params[:id])
  	@pages = Page.where(container_id: @container.id)

  	data = render_to_string(:action => :container, :id => params[:id], :layout => false)
  	File.open("/Users/pierre/Desktop/text_container.html", "w") { |f| f << data }
  	render :nothing => true
  end

end
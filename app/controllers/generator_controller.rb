class GeneratorController < ApplicationController

	before_action :authenticate_user!
  
  def container
  	@container = Container.find(params[:id])
  	@pages = Page.where(container_id: params[:id])
    render :layout => false
  end

  def page
  	@page = Page.find(params[:id])
  	@container = Container.find(@page.container_id)
  	@pages = Page.where(container_id: @page.container_id)
  	@blocks = Block.where(page_id: params[:id])
    render :layout => false
  end

  def page_generation
    @page = Page.find(params[:id])
    @container = Container.find(@page.container_id)
    @pages = Page.where(container_id: @page.container_id)
    @blocks = Block.where(page_id: params[:id])
    render :layout => false
  end

  def save
    @container = Container.find(params[:id])
    @pages = Page.where(container_id: params[:id])

    data = render_to_string(:action => :container, :id => params[:id], :layout => false)
    File.open("#{Rails.public_path}/#{@container.url}/tmp/index.html", "w") { |f| f << data }

    pages = Array.new()
    pages.push("index.html")

    files = Array.new()

    @pages.each_with_index do |page, index|
      @page = page
      @blocks = Block.where(page_id: page.id)
      @blocks.map { |block| 
        block.content = gsub_email(block.content, @container.user.email) unless block.content.nil?
        unless block.upload_id.nil? || block.upload_id == nil
          @upload = Upload.find(block.upload_id)
          files.push(gsub_email(@upload.url, @container.user.email))
        end
      }

      page_name = gsub_name(page.name)
      filename = index.to_s + "-" + page_name + ".html"
      data = render_to_string(:action => :page_generation, :id => params[:id], :layout => false, :template => "generator/page.html.erb")
      File.open("#{Rails.public_path}/#{@container.url}/tmp/" + filename, "w") { |f| f << data }

      pages.push(filename)
    end

    motherfucking_zipper("#{Rails.public_path}/#{@container.url}", pages, files)

    render :nothing => true
  end

  def gsub_name(name)
    return name.gsub(/[^a-zA-Z1-9_-]/, "").to_s.downcase
  end

  def gsub_email(content, username)
    if content.include? "#{username}/files/"
      content.gsub!("#{username}/files/", "files/")
    end
    return content
  end

  def gsub_glossary(page_id, content)
    glossaries = Glossary.all
    unless glossaries.empty?
      glossaries.each do |glossary|
        if content.downcase.include? glossary.name.downcase
          content.gsub!(/#{glossary.name}/i, "<span style='background:red'>#{glossary.name}</span><span>#{glossary.description}</span>")
        end
      end
    end
    return content
  end

  def recur_page_level(p, i, content, ul)
    content = content + "<li class=\"sidebar-brand\"> <a href=\""+p[i].name+".html\">" + p[i].name + "</a></li>\n"
    if p[i+1].present?
      if p[i].level == p[i+1].level
        i = i + 1
        ul = ul
        recur_page_level(p, i, content, ul)
      elsif p[i+1].level == p[i].level + 1
        i = i + 1
        ul = ul + 1
        content = content + "<ul>"
        recur_page_level(p, i , content, ul)
      elsif p[i+1].level == p[i].level - 1
        i = i + 1
        ul = ul - 1
        content = content + "</ul>"
        recur_page_level(p, i , content, ul)
      end
    else
      ul.times do 
        content = content + "</ul>"
      end
      return content
    end
  end

  def motherfucking_zipper(path, pages, files)
    require 'rubygems'
    require 'zip'

    Zip::File.open(path + "/tmp/zip.zip", Zip::File::CREATE) do |zipfile|
      pages.each do |filename|
        zipfile.add(filename, path + '/tmp/' + filename)
      end
      files.each do |filename|
        zipfile.add(filename, path + '/' + filename)
      end
    end
  end

end
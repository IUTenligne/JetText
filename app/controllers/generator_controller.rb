class GeneratorController < ApplicationController

  before_action :authenticate_user!
  
  def container
    # Container overview method

  	@container = Container.find(params[:id])
  	@pages = Page.where(container_id: params[:id])
    @assets_prefix = "/templates/iutenligne/"
    @home_link = "/generator/overview/#{params[:id]}"
    @org_link = "#"
    render :layout => false
  end


  def container_generation
    # Container generation method

    @container = Container.find(params[:id])
    @pages = Page.where(container_id: params[:id])
    @assets_prefix = ""
    @home_link = "#"
    @org_link = "http://www.iutenligne.net/resources.html"
    render :layout => false
  end
  

  def page
    # Page overview method

  	@page = Page.find(params[:id])
  	@container = Container.find(@page.container_id)
  	@pages = Page.where(container_id: @page.container_id)
  	@blocks = Block.where(page_id: params[:id])
    @blocks.map { |block| 
      block.content = add_slash(block.content, @container.user.email) unless block.content.nil?
    }
    @assets_prefix = "/templates/iutenligne/"
    @home_link = "/generator/overview/#{@container.id}"
    @org_link = "#"
    render :layout => false
  end


  def page_generation
    # Page generation method

    @page = Page.find(params[:id])
    @container = Container.find(@page.container_id)
    @pages = Page.where(container_id: @page.container_id)
    @blocks = Block.where(page_id: params[:id])
    @assets_prefix = ""
    @home_link = "index.html"
    @org_link = "http://www.iutenligne.net/resources.html"
    render :layout => false
  end


  def gsub_name(name)
    return name.gsub(/[^a-zA-Z1-9_-]/, "").to_s.downcase
  end
  helper_method :gsub_name


  def gsub_email(content, username)
    if content.include? "#{username}/files/"
      content.gsub!("#{username}/files/", "files/")
    end
    return content
  end


  def add_slash(content, username)
    if content.include? "#{username}/files/"
      content.gsub!("#{username}/files/", "/#{username}/files/")
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


  def image_finder(content, files)
    require 'nokogiri'

    doc = Nokogiri::HTML(content)
    img_srcs = doc.css('img').map{ |i| files.push(i['src']) }

    return files
  end


  def recur_page_level(page, page_name, i, content, ul)
    if page_name
      content = content + "<li class=\"sidebar-brand\"> <a href=\"" + page_name + ".html\">" + page_name + "</a></li>\n"
    else
      content = content + "<li class=\"sidebar-brand\"> <a href=\"" + i + "-page.html\">" + i + "</a></li>\n"
    end

    if page[i+1].present?
      if page[i].level == page[i+1].level
        i = i + 1
        ul = ul
        recur_page_level(page, i, content, ul)
      elsif page[i+1].level == page[i].level + 1
        i = i + 1
        ul = ul + 1
        content = content + "<ul>"
        recur_page_level(page, i , content, ul)
      elsif page[i+1].level == page[i].level - 1
        i = i + 1
        ul = ul - 1
        content = content + "</ul>"
        recur_page_level(page, i , content, ul)
      end
    else
      ul.times do 
        content = content + "</ul>"
      end
      return content
    end
  end


  def motherfucking_zipper(path, username, pages, files)
    require 'rubygems'
    require 'zip'

    username = username.split("@")[0].gsub!(".", "_")
    zippath = "#{Rails.public_path}/#{path}/tmp/#{Time.now.to_i.to_s}_#{username}.zip"
    relpath = "#{Rails.public_path}/#{path}"
    url = "#{path}/tmp/#{Time.now.to_i.to_s}_#{username}.zip"

    Zip::File.open(zippath, Zip::File::CREATE) do |zipfile|
      pages.each do |filename|
        zipfile.add(filename, relpath + '/tmp/' + filename)
      end
      files.each do |filename|
        zipfile.add(filename, relpath + '/' + filename)
      end

      railsroot = "#{Rails.public_path}/templates/iutenligne/"
      Dir["#{Rails.public_path}/templates/iutenligne/**/**"].each do |file|
        filename = file.gsub(railsroot, "")
        zipfile.add(filename, file)
      end
    end

    return url
  end


  def save
    # Generation method
    # Used by Containers.jsx to allow the users to generate and then download a zip of a container

    @container = Container.find(params[:id])
    @pages = Page.where(container_id: params[:id])
    @assets_prefix = ""
    @home_link = "#"
    @org_link = "http://www.iutenligne.net/resources.html"

    data = render_to_string(:action => :container_generation, :id => params[:id], :layout => false, :template => "generator/container.html.erb")
    File.open("#{Rails.public_path}/#{@container.url}/tmp/index.html", "w") { |f| f << data }

    pages = Array.new()
    pages.push("index.html")

    files = Array.new()
    @home_link = "index.html"

    @pages.each_with_index do |page, index|
      @page = page
      page_name = gsub_name(page.name) if page.name

      @blocks = Block.where(page_id: page.id)
      @blocks.map { |block| 
        block.content = gsub_email(block.content, @container.user.email) unless block.content.nil?
        
        # handle img files contained in text blocks
        files = image_finder(block.content, files)

        unless block.upload_id.nil? || block.upload_id == nil
          @upload = Upload.find(block.upload_id)
          files.push(gsub_email(@upload.url, @container.user.email))
        end
      }

      filename = index.to_s + "-" + page_name + ".html"
      data = render_to_string(:action => :page_generation, :id => params[:id], :layout => false, :template => "generator/page.html.erb")
      File.open("#{Rails.public_path}/#{@container.url}/tmp/" + filename, "w") { |f| f << data }

      pages.push(filename)
    end

    url = motherfucking_zipper(@container.url, @container.user.email, pages, files)

    # url is used by Containers.jsx to allow the zip file to be downloaded
    render json: { :url => url }
  end

end
class GeneratorController < ApplicationController

  before_action :authenticate_user!
  
  def container
    # Container overview method

  	@container = Container.find(params[:id])
  	@pages = Page.where(container_id: params[:id])
    @menu = recur_page_level(false, @pages, true, 0, "", 0)
    @assets_prefix = "/templates/iutenligne/"
    @home_link = "/generator/overview/#{params[:id]}"
    @org_link = "#"
    render :layout => false
  end


  def container_generation
    # Container generation method

    @container = Container.find(params[:id])
    @pages = Page.where(container_id: params[:id])
    @menu = recur_page_level(true, @pages, false, 0, "", 0)
    @assets_prefix = ""
    @home_link = "#"
    @org_link = "http://www.iutenligne.net/resources.html"
    render :layout => false
  end
  

  def page
    # Page overview method

  	@page = Page.find(params[:id])
  	@container = Container.find(@page.container_id)
    @glossaries = ContainersGlossary.where(container_id: @container.id)
  	@pages = Page.where(container_id: @page.container_id)
    @menu = recur_page_level(false, @pages, false, 0, "", 0)
    @mathjax = false
  	@blocks = Block.where(page_id: params[:id])
    @blocks.map { |block| 
      block.content = add_slash(block.content, @container.user.email) unless block.content.nil?
      @mathjax = true if block.type_id == 4
      unless @glossaries.nil?
        @glossaries.map { |glossary| 
          @terms = Term.where(glossary_id: glossary.glossary_id)
          @terms.each do |term|
            block.content.gsub!(/#{term.name}/i, '<span style="background: green !important">'+term.name+'</span>') unless block.content.nil?
          end
        }
      end
    }
    @assets_prefix = "/templates/iutenligne/"
    @libs_prefix = "/assets/"
    @home_link = "/generator/overview/#{@container.id}"
    @org_link = "#"
    render :layout => false
  end


  def page_generation
    # Page generation method

    @page = Page.find(params[:id])
    @container = Container.find(@page.container_id)
    @pages = Page.where(container_id: @page.container_id)
    @menu = recur_page_level(true, @pages, false, 0, "", 0)
    @blocks = Block.where(page_id: params[:id])
    @mathjax = false
    @assets_prefix = ""
    @home_link = "index.html"
    @libs_prefix = "libs/"
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


  def recur_page_level(zip, pages, index, i, content, ul)
    if pages.empty?
      return content
    else
      if zip == true
        if pages[i].name
          content = content + "<li><a href=\"#{i}-#{gsub_name(pages[i].name)}.html\">" + pages[i].name.capitalize + "</a></li>\n"
        else
          content = content + "<li><a href=\"#{i}\">" + i + "</a></li>\n"
        end
      else
        if index == true
          if pages[i].name
            content = content + "<li><a href=\"pages/#{pages[i].id}\">" + pages[i].name.capitalize + "</a></li>\n"
          else
            content = content + "<li><a href=\"pages/#{pages[i].id}\">" + i + "</a></li>\n"
          end
        else
          if pages[i].name
            content = content + "<li><a href=\"#{pages[i].id}\">" + pages[i].name.capitalize + "</a></li>\n"
          else
            content = content + "<li><a href=\"#{pages[i].id}\">" + i + "</a></li>\n"
          end
        end
      end

      if pages[i+1].present?
        if pages[i].level == pages[i+1].level
          i = i + 1
          ul = ul
          recur_page_level(zip, pages, index, i, content, ul)
        elsif pages[i+1].level == pages[i].level + 1
          i = i + 1
          ul = ul + 1
          content = content + "<ul>"
          recur_page_level(zip, pages, index, i , content, ul)
        elsif pages[i+1].level == pages[i].level + 2
          i = i + 1
          ul = ul + 2
          content = content + "<ul><ul>"
          recur_page_level(zip, pages, index, i , content, ul)
        elsif pages[i+1].level == pages[i].level + 3
          i = i + 1
          ul = ul + 3
          content = content + "<ul><ul><ul>"
          recur_page_level(zip, pages, index, i , content, ul)      
        elsif pages[i+1].level == pages[i].level - 1
          i = i + 1
          ul = ul - 1
          content = content + "</ul>"
          recur_page_level(zip, pages, index, i , content, ul)
        elsif pages[i+1].level == pages[i].level - 2
          i = i + 1
          ul = ul - 2
          content = content + "</ul></ul>"
          recur_page_level(zip, pages, index, i , content, ul)
        elsif pages[i+1].level == pages[i].level - 3
          i = i + 1
          ul = ul - 3
          content = content + "</ul></ul></ul>"
          recur_page_level(zip, pages, index, i , content, ul)
        end
      else
        ul.times do 
          content = content + "</ul>"
        end
        return content
      end
    end
  end


  def motherfucking_zipper(path, username, pages, files, mathjax)
    require 'rubygems'
    require 'zip'

    username = username.split("@")[0].gsub!(".", "_")
    zippath = "#{Rails.public_path}/#{path}/tmp/#{Time.now.to_i.to_s}_#{username}.zip"
    relpath = "#{Rails.public_path}/#{path}"
    url = "#{path}/tmp/#{Time.now.to_i.to_s}_#{username}.zip"

    Zip.continue_on_exists_proc = true
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

      if mathjax == true
        libsroot = "#{Rails.public_path}/libs/mathjax/"
        Dir["#{Rails.public_path}/libs/mathjax/**/**"].each do |file|
          filename = file.gsub(libsroot, "")
          zipfile.add("assets/libs/mathjax/#{filename}", file)
        end
      end
    end

    return url
  end


  def save
    require 'fileutils'
    # Generation method
    # Used by Containers.jsx to allow the users to generate and then download a zip of a container

    @container = Container.find(params[:id])
    @pages = Page.where(container_id: params[:id])
    @assets_prefix = ""
    @home_link = "#"
    @libs_prefix = "assets/libs/"
    @org_link = "http://www.iutenligne.net/resources.html"
    @menu = recur_page_level(true, @pages, true, 0, "", 0)

    data = render_to_string(:action => :container_generation, :id => params[:id], :layout => false, :template => "generator/container.html.erb")
    Dir.mkdir("#{Rails.public_path}/#{@container.url}/tmp") unless File.exists?("#{Rails.public_path}/#{@container.url}/tmp")
    File.open("#{Rails.public_path}/#{@container.url}/tmp/index.html", "w") { |f| f << data }

    pages = Array.new()
    pages.push("index.html")

    files = Array.new()
    @mathjax = false
    @home_link = "index.html"

    @menu = recur_page_level(true, @pages, false, 0, "", 0)

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

        # include MathJax if any math block present
        if block.type_id == 4
          @mathjax = true
        end
      }

      filename = index.to_s + "-" + page_name + ".html"
      data = render_to_string(:action => :page_generation, :id => params[:id], :layout => false, :template => "generator/page.html.erb")
      File.open("#{Rails.public_path}/#{@container.url}/tmp/" + filename, "w") { |f| f << data }

      pages.push(filename)
    end

    url = motherfucking_zipper(@container.url, @container.user.email, pages, files, @mathjax)

    # url is used by Containers.jsx to allow the zip file to be downloaded
    render json: { :url => url }
  end

end
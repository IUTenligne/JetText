module Generator

	# Generates static files

  require 'fileutils'

  def self.generate(username, container, pages)
    container.content = gsub_content(username, container.content, container.url) if container.content
    File.open("#{Rails.public_path}/#{container.url}/index.html", "w+") do |f|
      f.write(
        "<html>\n" \
        + "\t<head>\n" \
        + "\t\t<script type=\"text/x-mathjax-config\">" \
        + "\t\t\tMathJax.Hub.Config({tex2jax: {inlineMath: [[\"$\",\"$\"]]},displayAlign: \"center\",displayIndent: \"0.1em\"});" \
        + "\t\t</script>\n" \
        + "\t\t<script type=\"text/javascript\" src=\"/assets/MathJax/MathJax.js?config=TeX-AMS_HTML\" defer></script>\n" \
        + "\t\t<script type=\"text/javascript\" src=\"/assets/MathJax/extensions/MathMenu.js\" defer></script>\n" \
        + "\t\t<script type=\"text/javascript\" src=\"/assets/MathJax/extensions/MathZoom.js\" defer></script>\n" \
        + "\t</head>\n" \
        + "\t<body>\n\n" \
      )
      f.write("\t\t<div>"+container.content+"\t\t</div>\n\n") if container.content
      f.write(
        "\t</body>\n" \
        + "</html>" \
      )
      f.close
    end

    pages.each do |page|
      page.content = gsub_content(username, page.content, container.url) if page.content
      page.content = gsub_glossary(page.id, page.content) if page.content
      file_name = gsub_page_name(page.name)
      File.open("#{Rails.public_path}/#{container.url}/#{file_name}.html", "w+") do |f|
        f.write(
	        "<html>\n" \
          + "\t<head>\n" \
          + "\t\t<meta charset=\"utf-8\">\n" \
          + "\t\t<title>"+container.name+"</title>\n" \
          + "\t\t<script type=\"text/x-mathjax-config\">\n" \
          + "\t\t\tMathJax.Hub.Config({tex2jax: {inlineMath: [[\"$\",\"$\"]]},displayAlign: \"center\",displayIndent: \"0.1em\"});\n" \
          + "\t\t</script>\n" \
          + "\t\t<script type=\"text/javascript\" src=\"/Users/pierre/Documents/Developpement/Ruby/Rails/JetText/bower_components/MathJax/MathJax.js?config=TeX-AMS_HTML\" defer></script>\n" \
          + "\t\t<script type=\"text/javascript\" src=\"/Users/pierre/Documents/Developpement/Ruby/Rails/JetText/bower_components/MathJax/extensions/MathMenu.js\" defer></script>\n" \
          + "\t\t<script type=\"text/javascript\" src=\"/Users/pierre/Documents/Developpement/Ruby/Rails/JetText/bower_components/MathJax/extensions/MathZoom.js\" defer></script>\n" \
          + "\t\t<link href=\"assets/css/bootstrap.min.css\" rel=\"stylesheet\">\n" \
          + "\t\t<link href=\"assets/css/simple-sidebar.css\" rel=\"stylesheet\">\n" \
          + "\t\t<link href=\"assets/css/template.css\" rel=\"stylesheet\">\n" \
          + "\t\t<link href=\"assets/font-awesome/css/font-awesome.min.css\" rel=\"stylesheet\" type=\"text/css\">\n" \
          + "\t</head>\n\n" \
          + "\t<body>\n" \
        )
        if page.content
          f.write(
            "\t\t<div id=\"wrapper\">\n" \
            +"\t\t\t<div id=\"sidebar-wrapper\">\n" \
            +"\t\t\t\t<div class=\"sidebar-nav\">\n" \
            +"\t\t\t\t\t<a href=\"http://www.iutenligne.net/resources.html\">\n" \
            +"\t\t\t\t\t\t<img src=\"files/image/iutenligne.png\" border=\"0\">\n" \
            +"\t\t\t\t\t</a>\n\n" \
            +"\t\t\t\t\t<hr>\n\n" \
            +"\t\t\t\t\t<ul class=\"nav-link\">\n" \
            +"\t\t\t\t\t\t<li>\n" \
            +"\t\t\t\t\t\t\t<a class=\"btn btn-default\" href=\"#\">\n" \
            +"\t\t\t\t\t\t\t\t<i class=\"fa fa-home fa-fw\" title=\"Home\" aria-hidden=\"true\"></i>\n" \
            +"\t\t\t\t\t\t\t\t<span class=\"sr-only\">Home</span>\n" \
            +"\t\t\t\t\t\t\t</a>\n" \
            +"\t\t\t\t\t\t</li>\n" \
            +"\t\t\t\t\t\t<li>\n" \
            +"\t\t\t\t\t\t\t<a class=\"btn btn-default\" href=\"#\">\n" \
            +"\t\t\t\t\t\t\t\t<i class=\"fa fa-facebook fa-fw\" title=\"Facebook\" aria-hidden=\"true\"></i>\n" \
            +"\t\t\t\t\t\t\t\t<span class=\"sr-only\">Facebook</span>\n" \
            +"\t\t\t\t\t\t\t</a>\n" \
            +"\t\t\t\t\t\t</li>\n" \
            +"\t\t\t\t\t\t<li>\n" \
            +"\t\t\t\t\t\t\t<a class=\"btn btn-default\" href=\"#\">\n" \
            +"\t\t\t\t\t\t\t\t<i class=\"fa fa-pencil fa-fw\" title=\"Mail\" aria-hidden=\"true\"></i>\n" \
            +"\t\t\t\t\t\t\t\t<span class=\"sr-only\">Mail</span>\n" \
            +"\t\t\t\t\t\t\t</a>\n" \
            +"\t\t\t\t\t\t</li>\n" \
            +"\t\t\t\t\t\t<li>\n" \
            +"\t\t\t\t\t\t\t<a href=\"#menu-toggle\" id=\"menu-toggle\" class=\"btn btn-default\">\n" \
            +"\t\t\t\t\t\t\t\t<i class=\"fa fa-chevron-left fa-fw\" title=\"Navigation\" aria-hidden=\"true\"></i>\n" \
            +"\t\t\t\t\t\t\t\t<span class=\"sr-only\">Navigation</span>\n" \
            +"\t\t\t\t\t\t\t</a>\n" \
            +"\t\t\t\t\t\t</li>\n" \
            +"\t\t\t\t\t</ul>\n\n" \
            +"\t\t\t\t\t<hr>\n\n" \
            +"\t\t\t\t\t<ul class=\"nav-menu\">\n" \
          )
          pages.each do |p|
            file_name =  gsub_page_name(p.name) if p.name
            f.write("\t\t\t\t\t\t<li class=\"sidebar-brand\"> <a href=\""+file_name+".html\">" + p.name + "</a></li>\n")
          end
          f.write(
            "\t\t\t\t\t</ul>\n" \
            +"\t\t\t\t</div>\n\n" \
            +"\t\t\t</div>\n\n" \
            +"\t\t\t<div id=\"page-content-wrapper\">\n" \
            +"\t\t\t\t<div class=\"container-fluid\">\n" \
            +"\t\t\t\t\t<!-- title container--> \n\n" \
            +"\t\t\t\t\t<h1 class=\"container-title\">" + container.name + "</h1>\n" \
            +"\t\t\t\t\t<!-- / title container --> \n\n" \
            +"\t\t\t\t\t<!-- title page--> \n\n" \
            +"\t\t\t\t\t<h2 class=\"page-title\">" + page.name + "</h2>\n" \
            +"\t\t\t\t\t<!-- / title page --> \n\n" \
            +"\t\t\t\t\t<!-- content --> \n" \
            
          )
          page.blocks.each do |block|
            f.write(
            "\t\t\t\t\t<div class=\"row\">\n" \
            +"\t\t\t\t\t\t<div class=\"col-lg-12\">\n" \
            +"\t\t\t\t\t\t\t<h3>" + block.name + "</h3>\n" \
            +"\t\t\t\t\t\t\t<div class=\"content\">\n" \
            +"\t\t\t\t\t\t\t\t" + block.content + "\n" \
            +"\t\t\t\t\t\t\t</div>\n" \
            +"\t\t\t\t\t\t</div>\n" \
            +"\t\t\t\t\t</div>\n\n"
            )
          end
          f.write(
            "\t\t\t\t\t<!-- / content --> \n\n" \
            +"\t\t\t\t</div>\n" \
            +"\t\t\t</div>\n" \
            +"\t\t</div>\n\n" \
          )
        end
        f.write(
          "\t\t<script src=\"assets/js/bootstrap.min.js\"></script>\n" \
          +"\t\t<script src=\"assets/js/jquery.js\"></script>\n" \
          +"\t\t<script>\n" \
          +"\t\t\t $(\"#menu-toggle\").click(function(e){e.preventDefault();$(\"#wrapper\").toggleClass(\"toggled\"); });\n" \
          +"\t\t</script>\n" \
          +"\t</body>\n" \
          + "</html>" \
        )
        f.close
      end
    end

    #Dir.chdir("#{Rails.public_path}/#{container.url}/") do |directory|
    #  `zip -R "target.zip" "files/application/dossier-presse-2016.pdf" "files/image/capturet-ext.png" "index.html" "Page 1.html"`
    #end

    return true
  end

  def self.gsub_content(username, content, container_url)
    patterns = [
      '<body>',
      '</body>',
      '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">',
      '<html>',
      '</html>'
    ]
    patterns.map {|s| content.gsub!(s, '')}

    # changes the files default url to a relative one
    if content.include? "#{username}/files/"
    	content.gsub!("#{username}/files/", "files/")
      content.gsub!("/#{username}/files/", "files/")
    end
    return content
  end

  def self.gsub_glossary(page_id, content)
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

  def self.gsub_page_name(page_name)
    return page_name.gsub(/[^a-zA-Z1-9_-]/, "").to_s.downcase
  end

end
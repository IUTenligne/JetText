module ImageGenerator

  # Saves base64 images code in files

  def self.image_transformer(html, url)
    require 'fileutils'
    doc = Nokogiri::HTML(html)
    images = doc.search('img') if doc.search('img').present?
    unless images.nil?
      images.each_with_index do |item, index|
        if item['src']['data:image/'].to_s.length > 0
          format = item['src'].split(';')[0].split('/')[-1]
          if format =~ /^*(png|jpg|jpeg|gif)$/
            content = Base64.decode64(item['src']["data:image/#{format};base64,".length .. -1])
            path = "#{Rails.root}/public/#{url}"
            i = create_image(content, path, url, index, format)
            #replaces image base64 code by the file url
            item['src'] = "/#{url}/files/image/image#{i}.#{format}"
          end
        end
      end
    end
    return doc
  end

  def self.create_image(content, path, url, index, format)
    unless File.directory?("#{path}/files/image")
      FileUtils.mkdir_p "#{path}/files/image"
    end
    i = define_index("#{path}/files/image", index, format)
    File.open("#{path}/files/image/image#{i}.#{format}", 'wb') { |f| f.write(content) }
    return i
  end

  def self.define_index(path, index, format)
    image_name = "image#{index}.#{format}"
    if File.file?("#{path}/#{image_name}")
      index = index.to_i + 1
      return define_index(path, index, format)
    else
      return index
    end
  end

end
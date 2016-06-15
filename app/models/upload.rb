class Upload < ActiveRecord::Base

  belongs_to :user
  has_and_belongs_to_many :blocks

  before_create :reencode_filename
  before_create :set_type

  Paperclip.interpolates('user') do |attachment, style|
    attachment.instance.user.email.to_s
  end

  Paperclip.interpolates :file_type do |attachment, style|
    attachment.instance.file_type
  end

  Paperclip.interpolates :month do |attachment, style|
    attachment.instance.month
  end

  Paperclip.interpolates :timestamp do |attachment, style|
    attachment.instance.timestamp
  end

  Paperclip.interpolates :valid_name do |attachment, style|
    attachment.instance.valid_name
  end

  Paperclip.interpolates :valid_ext do |attachment, style|
    attachment.instance.valid_ext
  end

  has_attached_file :file,
    :url => ":user/files/:file_type/:month/:timestamp_:valid_name:valid_ext",
  	:path => ":rails_root/public/:user/files/:file_type/:month/:timestamp_:valid_name:valid_ext",
    :use_timestamp => false

  validates_attachment_content_type :file, 
		:content_type => [
			"video/mp4",
			"application/pdf",
      "application/force-download",
			"image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/svg+xml",
      "image/svg",
      "audio/mp3",
      "audio/mpeg"
		],
		:message => 'Seuls les fichiers PDF, MP3, PNG, JPG et MP4 sont autorisés.'

  def file_type
    ext = self.file_file_name.split('.')[-1].downcase
    type = self.file_content_type.mb_chars.normalize(:kd).split('/')

    # forces directory's name if the mime-type's bug force-download is encounterd
    if type[0] === "application" && type[1] === "force-download" && !self.types_hash.fetch(ext.to_sym).nil?
      if type[1] === "force-download" && (ext === "mp4" || ext === "avi" || ext === "flv")
        self.file_content_type = "video/#{ext}"
      elsif type[1] === "force-download" && ext === "mp3"
        self.file_content_type = "audio/#{ext}"
      end
      return self.types_hash.fetch(ext.to_sym)
    end
    return self.types_hash.fetch(ext.to_sym)
  end

  def month
    return Time.now.strftime("%Y-%m")
  end

  def timestamp
    return Time.now.strftime("%Y%m%d%H%M").to_i
  end

  def valid_name
    return File.basename(file_file_name, File.extname(file_file_name)).gsub(/[^a-zA-Z_-]/, '').downcase
  end

  def valid_ext
    return File.extname(file_file_name).downcase
  end

  def types_hash
    types = {
      mp4: "video",
      flv: "video",
      avi: "video",
      pdf: "pdf",
      png: "image",
      jpg: "image",
      jpeg: "image",
      gif: "image",
      svg: "image",
      mp3: "audio",
      mpeg: "audio",
      svg: "image"
    }
    return types
  end

  private

    def reencode_filename
      # lowercase the ext
      extension = File.extname(file_file_name).downcase
      name = File.basename(file_file_name, File.extname(file_file_name)).gsub(/[^a-zA-Z_-]/, '').downcase
      self.file.instance_write(:file_name, "#{name}#{extension}")
    end

    def set_type
      self.filetype ||= self.file_type
    end

    def self.sort_by(current_user, column, way)
      return nil unless current_user.present? && (column == "file_file_name" || column == "filetype" || column == "file_updated_at")
      return Upload.select("id, file_file_name, file_content_type, url, filetype, file_updated_at")
        .where(user_id: current_user.id)
        .order("#{column} #{way}")
    end

end
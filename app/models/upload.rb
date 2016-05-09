class Upload < ActiveRecord::Base

  belongs_to :user
  belongs_to :block

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

  has_attached_file :file,
    :url => ":user/files/:file_type/:month/:timestamp_:valid_name.:extension",
  	:path => ":rails_root/public/:user/files/:file_type/:month/:timestamp_:valid_name.:extension",
    :use_timestamp => false

  validates_attachment_content_type :file, 
		:content_type => [
			"video/mp4",
			"application/pdf",
      "application/force-download",
			"image/png",
      "image/jpg",
      "audio/mp3",
      "audio/mpeg"
		],
		:message => 'seuls les fichiers PDF et MP4 sont autorisés.'

  def file_type
    ext = self.file_file_name.split('.')[-1]
    type = self.file_content_type.mb_chars.normalize(:kd).split('/')

    # forces directory's name if the mime-type's bug force-download is encounterd
    if type[0] === "application" && type[1] === "force-download" && ext === "mp4"
      return "video"
    elsif type[0] === "application" && type[1] === "pdf"
      return "pdf"
    else
      return type[0].to_s
    end
  end

  def month
    return Time.now.strftime("%Y-%m")
  end

  def timestamp
    return Time.now.to_i
  end

  def valid_name
    return self.file_file_name.split('.')[0].gsub(/[^a-zA-Z_-]/, '').downcase
  end

end

# == Schema Information
#
# Table name: uploads
#
#  id                :integer          not null, primary key
#  name              :string(255)
#  file_file_name    :string(255)
#  file_content_type :string(255)
#  file_file_size    :integer
#  file_updated_at   :datetime
#  type              :string(255)
#  url               :string(255)
#  size              :integer
#  user_id           :integer
#

class Upload < ActiveRecord::Base

  belongs_to :user
  belongs_to :block

  Paperclip.interpolates('user') do |attachment, style|
    attachment.instance.user.email.to_s
  end

  Paperclip.interpolates :file_type do |attachment, style|
    attachment.instance.file_type
  end

  Paperclip.interpolates :file_name do |attachment, style|
    attachment.instance.file_name
  end

  has_attached_file :file,
    :url => ":user/files/:file_type/:file_name.:extension",
  	:path => ":rails_root/public/:user/files/:file_type/:file_name.:extension",
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
      else
        return type[0].to_s
      end
    end

    def file_name
      filename = self.file_file_name.split('.')[0]
      ext = self.file_file_name.split('.')[-1]
      type = self.file_type
      user = self.user.email
      if FileTest.exists?("#{Rails.root}/public/#{user}/files/#{type}/#{self.file_file_name}")
        filename = filename.to_s + "_1"
        if FileTest.exists?("#{Rails.root}/public/#{user}/files/#{type}/#{filename}#{ext}")
          filename = filename + filename.split("_")[-1].succ
        end
        return filename
      else
        return filename
      end
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

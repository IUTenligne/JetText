class PagesUpload < ActiveRecord::Base
	belongs_to :page
	belongs_to :upload
end

# == Schema Information
#
# Table name: pages_uploads
#
#  page_id   :integer
#  upload_id :integer
#

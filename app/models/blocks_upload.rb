class BlocksUpload < ActiveRecord::Base
  belongs_to :block
	belongs_to :upload

	validates :block_id, presence: true
	validates :upload_id, presence: true
end

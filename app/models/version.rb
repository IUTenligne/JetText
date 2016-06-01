class Version < ActiveRecord::Base
	belongs_to :container
	has_many :blocks
end

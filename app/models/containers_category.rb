class ContainersCategory < ActiveRecord::Base
  belongs_to :container
	belongs_to :category

	validates :container_id, presence: true
	validates :category_id, presence: true
end

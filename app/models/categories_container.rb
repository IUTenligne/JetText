class CategoriesContainer < ActiveRecord::Base
  belongs_to :category
  belongs_to :container

  validates :category_id, presence: true
	validates :container_id, presence: true
end

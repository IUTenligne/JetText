class Category < ActiveRecord::Base
  has_and_belongs_to_many :containers, :through => :containers_category

	validates :name, :presence => true

  default_scope { order("name ASC") }
end

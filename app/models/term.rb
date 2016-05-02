class Term < ActiveRecord::Base
	belongs_to :user
  belongs_to :glossary
  has_many :containers

	validates :name,          :presence => true
  validates :description,   :presence => true
end

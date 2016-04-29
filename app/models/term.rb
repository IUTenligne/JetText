class Term < ActiveRecord::Base
	belongs_to :user
  	belongs_to :glossary
  	has_many :container

	validates :name,          :presence => true
  	validates :description,   :presence => true
end

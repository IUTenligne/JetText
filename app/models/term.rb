class Term < ActiveRecord::Base
	belongs_to :user
  	belongs_to :glossary
  	has_and_belongs_to_many :containers, :through => :containers_glossary


	validates :name,          :presence => true
  	validates :description,   :presence => true
end

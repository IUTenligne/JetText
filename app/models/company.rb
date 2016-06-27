class Company < ActiveRecord::Base
	has_many :users
	has_and_belongs_to_many :containers, :through => :companies_container

	validates :name, :presence => true
end

class CompaniesContainer < ActiveRecord::Base
  belongs_to :company
	belongs_to :container
	
	validates :company_id, presence: true
	validates :container_id, presence: true
end
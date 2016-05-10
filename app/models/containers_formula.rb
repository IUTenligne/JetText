class ContainersFormula < ActiveRecord::Base
  belongs_to :container
	belongs_to :formula
	
	validates :container_id, presence: true
	validates :formula_id, presence: true

end
class ContainersTerm < ActiveRecord::Base
  belongs_to :container
	belongs_to :term
	
	validates :container_id, presence: true
	validates :term_id, presence: true

end
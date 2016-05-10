class ContainersGlossary < ActiveRecord::Base
  belongs_to :container
	belongs_to :glossary
	
	validates :container_id, presence: true
	validates :glossary_id, presence: true

end
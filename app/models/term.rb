class Term < ActiveRecord::Base
	belongs_to :user
	belongs_to :glossary

	validates :name,          :presence => true
	validates :desciption,    :presence => true
  	validates :glossary_id,   :presence => true
end
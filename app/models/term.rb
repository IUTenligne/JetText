class Term < ActiveRecord::Base
	belongs_to :user
  belongs_to :glossary

	validates :name,          :presence => true
  validates :description,   :presence => true
end

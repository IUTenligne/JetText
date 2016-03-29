class PagesGlossary < ActiveRecord::Base
	belongs_to :page
	belongs_to :glossary
end
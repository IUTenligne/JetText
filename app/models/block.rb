class Block < ActiveRecord::Base
  belongs_to :user
  belongs_to :page
  has_and_belongs_to_many :uploads, through: :blocks_uploads
  belongs_to :version, required: true

  default_scope { order("sequence ASC") }
end

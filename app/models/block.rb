class Block < ActiveRecord::Base
  belongs_to :user
  belongs_to :page
  has_one :upload, required: false
  belongs_to :version, required: true

  default_scope { order("sequence ASC") }
end
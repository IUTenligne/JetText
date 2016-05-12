class Block < ActiveRecord::Base
  belongs_to :user
  belongs_to :page
  has_one :upload, required: false

  default_scope { order("sequence ASC") }
end
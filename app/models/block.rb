class Block < ActiveRecord::Base
  belongs_to :user
  belongs_to :page
end

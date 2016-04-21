class Page < ActiveRecord::Base

  belongs_to :container
  belongs_to :user
  has_many :uploads
  has_many :blocks, :dependent => :destroy

  validates :name,          :presence => true, length: { maximum: 250 }
  validates :user_id,       :presence => true
  validates :container_id,  :presence => true

  default_scope { order("sequence ASC") }

end

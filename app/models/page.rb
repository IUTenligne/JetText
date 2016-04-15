class Page < ActiveRecord::Base
  belongs_to :container
  belongs_to :user
  has_many :uploads
  has_many :blocks, :dependent => :destroy

  validates :name,          :presence => true, length: { maximum: 250 }
  validates :user_id,       :presence => true
  validates :container_id,  :presence => true

  default_scope { order("weight ASC") }
end

# == Schema Information
#
# Table name: pages
#
#  id           :integer          not null, primary key
#  name         :string(255)
#  content      :binary(16777215)
#  container_id :integer
#  user_id      :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  weight       :integer
#  level        :integer
#

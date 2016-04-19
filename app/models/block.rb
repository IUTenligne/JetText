class Block < ActiveRecord::Base
  belongs_to :user
  belongs_to :page
end

# == Schema Information
#
# Table name: blocks
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  content    :text(65535)
#  user_id    :integer
#  page_id    :integer
#  type_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

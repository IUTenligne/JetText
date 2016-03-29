class Variable < ActiveRecord::Base
	belongs_to :user
end

# == Schema Information
#
# Table name: variables
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  value      :integer
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

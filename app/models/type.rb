class Type < ActiveRecord::Base
	has_many :blocks
end

# == Schema Information
#
# Table name: types
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

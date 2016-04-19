require 'spec_helper'


describe Container do
	it {should validate_presence_of(:name)}
	#it {should validate_presence_of(:url)}
	#it {should validate_presence_of(:user_id)}
	it {should have_many (:pages)}
end

describe "tests TITLES (name)" do
	it "should reject name that is too long" do
	  long = "a" * 256 
	end 
end


describe "tests url" do
	it "should reject content that is too long" do
	  long = "a" * 256
	end 	 
end

# == Schema Information
#
# Table name: containers
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  content    :binary(16777215)
#  url        :string(255)
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

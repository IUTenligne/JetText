require 'spec_helper'

describe Page do 
	it {should validate_presence_of(:name)}
	#it {should validate_presence_of(:content)}
	it {should validate_presence_of(:user_id)}  
	it {should validate_presence_of(:container_id)}  
end



describe "tests TITLES (name)" do
	it "should reject name that is too long" do
	  long = "a" * 256 
	end 
end


describe "tests content" do
	it "should reject content that is too long" do
	  long = "a" * 16777216
	end 	 
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

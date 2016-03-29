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

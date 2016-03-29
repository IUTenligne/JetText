require 'test_helper'

class ContainerTest < ActiveSupport::TestCase

	def setup 
		@container = containers(:one)
		@user = users(:one)
	end	




	test "name is too long" do 
		@container.name = "a" * 251
		assert_not @container.valid?
	 		#validates_length_of :name,  :maximum => 250, :allow_blank => false
	end

	test "name is valid" do 
		@container.name = "a" * 250
		assert @container.valid?
	end	

	test "should not save container without user" do
		@container.user_id = nil
		assert_not @container.valid?
	end

	test "should save container with user" do
		@container.user_id == @user.id
		assert @container.valid?
	end	


	test "should save container without content" do
		@container.content = nil
		assert @container.valid?
	end	


end
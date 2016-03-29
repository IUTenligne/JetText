require 'test_helper'

class PageTest < ActiveSupport::TestCase


	def setup 
		@page = pages(:one)
		@user = users(:one)
		@container = containers(:one)
	end	

	test "name is too long" do 
		@container.name = "a" * 251
		assert_not @container.valid?
	 		#validates_length_of :name,  :maximum => 250, :allow_blank => false
	end


 	test "should not save page without user" do
		@page.user_id = nil
		assert_not @page.valid?
	end


	test "should save page with user" do
		@page.user_id == @user.id
		assert @page.valid?
	end	

	test "should not save without container" do
		@page.container_id = nil
		assert_not @page.valid?
	end

	test "should save page with container " do
		@page.container_id = @container.id
		assert @page.valid?
	end	


end

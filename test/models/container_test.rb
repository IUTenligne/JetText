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

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

require 'test_helper'

class PagesControllerTest < ActionController::TestCase

  include Devise::TestHelpers
  setup :initialize_page

  test "should get index" do
    sign_in @user
    get :index
    assert_response :success
  end
 
  test "should be logged in for index" do
    get :index
    assert_response :redirect
  end

  test "should get new" do
    sign_in @user
    get :new
    assert_response :success
  end

  test "should create page" do
    sign_in @user
    assert_difference('Page.count', +1) do
      post :create, page: {name: "ressouce 1", container_id: @container.id, user_id: 1}
    end
    assert_redirected_to containers_path()
  end  

  test "no difference" do
    assert_no_difference 'Page.count', 'An page should not be created' do
      post :create, page: { name: "titre" }
    end
  end  

  test "should save content" do
    content = @page.content
    content.encode(Encoding::ISO_8859_1)
    assert_difference('Page.count', +1) do
      post :create, page: {name: "ressource 1", content: "content", container_id: @container.id, user_id: 1}
    end
  end

 private
    def initialize_page
      @user = users(:one)
      @user = users(:user_one)
      @container = containers(:container_one)
    end
end

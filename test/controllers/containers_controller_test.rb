require 'test_helper'

class ContainersControllerTest < ActionController::TestCase

  include Devise::TestHelpers
  setup :initialize_container

  test "should get index" do
    sign_in @user
    get :index, :format => :json
    assert_response :success
    assert_not_nil assigns(:containers)
  end

  test "should create container" do
    sign_in @user
    assert_difference('Container.count') do
      post :create, container: { name: "container's name" }
    end
    container_id = assigns[:container].id
    assert_redirected_to "/#/containers/#{container_id}"
  end

  test "should show container" do
    sign_in @user
    get :show, id: @container.id
    assert_response :success
  end

  test "should not show container" do
    sign_in @wrong_user
    get :show, id: @container
    assert_redirected_to containers_path
  end

  test "should update container" do
    patch :update, id: @container, container: {  }
    assert_redirected_to container_path(assigns(:container))
  end

  test "should destroy container" do
    assert_difference('Container.count', -1) do
      delete :destroy, id: @container
    end

    assert_redirected_to containers_path
  end

  private
    def initialize_container
      @user = users(:user_one)
      @wrong_user = users(:user_two)
      @container = containers(:container_one)
    end
end

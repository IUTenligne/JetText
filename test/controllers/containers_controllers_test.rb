require 'test_helper'

class ContainersControllerTest < ActionController::TestCase

  include Devise::TestHelpers
  setup :initialize_container

  test "should get index" do
    sign_in @user
    get :index
    assert_response :success, "Possède une méthode index"
  end

  test "should get new" do
    sign_in @user
    get :new
    assert_response :success
  end

  test "should create container" do
    sign_in @user
    assert_difference('Container.count', +1) do
      post :create, container: {name: "ressource 1"}  
    end
    assert_redirected_to container_path(assigns(:container))
  end

  test "should show container" do
    sign_in @user
    get :show, id: @container
  end  
  
  test "should update" do
    container = Container.create(name: "ressource")
    get :update
  end  

  test "should destroy container" do
    sign_in @user
    if @user.id == @container.user_id
      assert_difference('Container.count', -1) do
        delete :destroy, id: @container.id
      end
      assert_redirected_to containers_path
    else
      assert_no_difference('Container.count', -1) do
        delete :destroy, id: @container.id
      end
      assert_redirected_to containers_path
    end
  end

  private
    def initialize_container
      @user = users(:user_one)
      @container = containers(:container_one)
    end
end

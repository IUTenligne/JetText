class UsersController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_admin, only: [:index, :validate, :update_role]
  respond_to :html, :json

  def index
    @users = User.users_list
    @roles = Role.all.where("role <> 'admin'")
    @validated_users = @users.where(validated: true)
    @pending_users = @users.where(validated: false)
    render json: { users: @users, roles: @roles, validated_users: @validated_users, pending_users: @pending_users }
  end

  def validate
  	@user = User.find(params[:id])
  	@user.update_attributes(validated: !@user.validated)

    # Send validation email
    UserMailer.validation_message(@user).deliver if @user.validated === true

  	@users = User.users_list
    @validated_users = @users.where(validated: true)
    @pending_users = @users.where(validated: false)
    render json: { usersdata: { users: @users, validated_users: @validated_users, pending_users: @pending_users } }
  end

  def update_role
  	@user = User.find(params[:id])
  	@user.update_attributes(role_id: params[:role_id])
  	@users = User.users_list
    @validated_users = @users.where(validated: true)
    @pending_users = @users.where(validated: false)
    render json: { usersdata: { users: @users, validated_users: @validated_users, pending_users: @pending_users } }
  end

  def my

  end

end

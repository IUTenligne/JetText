class UsersController < ApplicationController

  before_action :authenticate_user!
  before_filter :require_validation
  respond_to :html, :json

  def index
    @users = User.all.select("users.id, users.firstname, users.lastname, users.email, users.created_at, users.role_id").joins(:role).select("roles.role")
    @validated_users = @users.where(validated: true)
    @pending_users = @users.where(validated: false)
    render json: { users: @users, validated_users: @validated_users, pending_users: @pending_users }
  end

  def validate
  	@user = User.find(params[:id])
  	@user.update_attributes(validated: !@user.validated)
  	@users = User.all.select("users.id, users.firstname, users.lastname, users.email, users.created_at, users.role_id").joins(:role).select("roles.role")
    @validated_users = @users.where(validated: true)
    @pending_users = @users.where(validated: false)
    render json: { usersdata: { users: @users, validated_users: @validated_users, pending_users: @pending_users } }
  end

  def update_role
  	@user = User.find(params[:id])
  	@user.update_attributes(role_id: params[:role_id]).save!
  	@users = User.all.select("users.id, users.firstname, users.lastname, users.email, users.created_at, users.role_id").joins(:role).select("roles.role")
    @validated_users = @users.where(validated: true)
    @pending_users = @users.where(validated: false)
    render json: { usersdata: { users: @users, validated_users: @validated_users, pending_users: @pending_users } }
  end

end

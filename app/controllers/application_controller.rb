require_dependency 'jettext'

class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception
  before_action :set_locale
 
  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  rescue_from JetText::NotLoggedIn do |e|
    raise e if Rails.env.test?
    render json: { status: { state: "error", message: "Not logged in" } }
  end

  rescue_from JetText::NotAllowed do |e|
    raise e if Rails.env.test?
    render json: { status: { state: "error", message: "Not allowed" } }
  end

  def ensure_logged_in
    raise JetText::NotLoggedIn.new unless current_user.present?
  end

  def rescue_jettext_actions(type, status_code, message=false)
    render json: { status: { state: "error", message: message } }
  end

  def require_validation
    #requires that the user is validated (user.validated == true)
    unless current_user.is_validated?
      raise JetText::NotAllowed.new
    end
  end

  def require_admin
    #requires that the user is validated (user.validated == true)
    unless current_user.is_admin?
      raise JetText::NotAllowed.new
    end
  end
	
end

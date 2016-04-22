require_dependency 'jettext'

class ApplicationController < ActionController::Base

  protect_from_forgery with: :exception
  before_action :set_locale
 
  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  rescue_from JetText::NotLoggedIn do |e|
    raise e if Rails.env.test?
    rescue_jettext_actions(:not_logged_in, 403, t(:not_logged_in))
  end

  rescue_from JetText::NotAllowed do |e|
    raise e if Rails.env.test?
    rescue_jettext_actions(:not_logged_in, 403, t(:not_allowed))
  end

  def ensure_logged_in
    raise JetText::NotLoggedIn.new unless current_user.present?
  end

  def rescue_jettext_actions(type, status_code, message=false)
    render json: { status: { state: "error", message: message } }
  end
	
end

module ApplicationHelper
  
	# Devise resource helpers
	def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  def resource_class
    # Needed by Omniauth
    devise_mapping.to
  end

end

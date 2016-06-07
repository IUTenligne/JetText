class RolesController < ApplicationController


	private
		def role_params
			params.require(:upload).permit(:name)
		end
end	

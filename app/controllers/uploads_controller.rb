class UploadsController < ApplicationController
	#skip_before_filter :verify_authenticity_token, :only => [:create]

	def new
		@upload = Upload.new
	end
	
	def create
		@upload = Upload.new(name: params[:original_filename], file: params[:tempfile])
		@upload.user_id = current_user.id
		@upload.url = @upload.file.url
		if @upload.save
      respond_to do |format|
			  format.json { render json: @upload }
			  format.html { head :no_content }
			end
		else
			respond_to do |format|
			  format.json { render json: "error".to_json }
			  format.html { head :no_content }
			end
		end
	end

	private
		def upload_params
			params.require(:upload).permit(:name, :file, :url)
		end
end	

# == Schema Information
#
# Table name: uploads
#
#  id                :integer          not null, primary key
#  name              :string(255)
#  file_file_name    :string(255)
#  file_content_type :string(255)
#  file_file_size    :integer
#  file_updated_at   :datetime
#  type              :string(255)
#  url               :string(255)
#  size              :integer
#  user_id           :integer
#
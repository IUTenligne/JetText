class UploadsController < ApplicationController
	skip_before_filter :verify_authenticity_token, :only => [:create]

	def new
		@upload = Upload.new
	end

	def show
		@upload = Upload.find(params[:id])
		respond_to do |format|
			 format.json { render json: @upload }
		end
	end
	
	def create
		@upload = Upload.new(name: params[:original_filename], file: params[:tempfile], block_id: params[:block_id])
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

	def clear
    Upload.where(params[:block_id]).destroy_all
    render :nothing => true
  end

  def destroy
		Upload.find(params[:id]).destroy
    render :nothing => true
  end

	private
		def upload_params
			params.require(:upload).permit(:name, :file, :url, :block_id)
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
#  user_id           :integer
#
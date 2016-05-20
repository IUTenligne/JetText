class UploadsController < ApplicationController

  before_action :authenticate_user!
  before_filter :block_permission, only: [:create, :clear]
  before_filter :require_permission, only: [:show, :destroy]
  respond_to :html, :json
	skip_before_filter :verify_authenticity_token, :only => [:create]

	def block_permission
    if current_user != Block.find(params[:block_id]).user || current_user.nil?
      respond_to do |format|
        format.json { render json: { status: "error" } }
      end 
    end
  end

  def require_permission
    if current_user != Upload.find(params[:id]).user || current_user.nil?
      respond_to do |format|
        format.json { render json: { status: "error" } }
      end 
    end
  end

  def index
  	@uploads = Upload.select("id, file_file_name, file_content_type, url, file_updated_at").where(user_id: current_user.id)
  	render json: { uploads: @uploads }
  end

	def show
		@upload = Upload.find(params[:id])
		respond_to do |format|
			 format.json { render json: @upload }
		end
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
			  format.json { render json: "error" }
			  format.html { head :no_content }
			end
		end
	end

  def destroy
		Upload.find(params[:id]).destroy
    render :nothing => true
  end

  def search
  	if params[:name].empty?
  		@uploads = Upload.select("id, file_file_name, file_content_type, url, file_updated_at").where(user_id: current_user.id)
  	else
  		@uploads = Upload.select("id, file_file_name, file_content_type, url, file_updated_at").where("uploads.file_file_name LIKE ?", "%#{params[:name]}%").where(user_id: current_user.id)
  	end
  	render json: { uploads: @uploads }
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
#  user_id           :integer
#
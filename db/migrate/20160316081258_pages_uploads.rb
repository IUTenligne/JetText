class PagesUploads < ActiveRecord::Migration
  def change
  	create_table :pages_uploads, :id => false do |t|
  		t.integer :page_id
  		t.integer :upload_id
  	end
  end
end

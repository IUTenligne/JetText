class RemoveColumnFromUploads < ActiveRecord::Migration
  def change
  	remove_reference :uploads, :container, index: true, foreign_key: true
  end
end

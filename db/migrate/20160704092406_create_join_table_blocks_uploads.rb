class CreateJoinTableBlocksUploads < ActiveRecord::Migration
  def change
    create_join_table :blocks, :uploads do |t|
      t.index [:block_id, :upload_id]
      t.index [:upload_id, :block_id]
    end
  end
end

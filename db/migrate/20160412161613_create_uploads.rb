class CreateUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|

    t.string :name    
    t.attachment :file
    t.string :type    
    t.string :url   
    t.references :block, index: true, foreign_key: true
    t.references :user, index: true, foreign_key: true
    end
  end
end

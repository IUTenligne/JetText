class CreateUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|

    t.string :name
    t.attachment :file
    t.string :filetype
    t.string :url
    t.text :alt, null: true
    t.string :width, null: true
    t.references :user, index: true, foreign_key: true
    end
  end
end

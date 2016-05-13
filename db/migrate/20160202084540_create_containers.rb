class CreateContainers < ActiveRecord::Migration
  def change
    create_table :containers do |t|
      t.string :name
      t.text :content
      t.string :url, limit: 255
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

class CreateContainers < ActiveRecord::Migration
  def change
    create_table :containers do |t|
      t.string :name
      t.binary :content, limit: 16777215
      t.string :url, limit: 255
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

class CreateBlocks < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.string :name
      t.text :content
      t.integer :sequence, limit: 2
      t.references :user,   index: true, foreign_key: true
      t.references :page,   index: true, foreign_key: true
      t.references :type,   index: true, foreign_key: true
      t.references :upload, index: true, foreign_key: true, null: true

      t.timestamps null: false
    end
  end
end

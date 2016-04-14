class CreateBlocks < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.string :name
      t.text :content
      t.references :user, index: true, foreign_key: true
      t.references :page, index: true, foreign_key: true
      t.references :type, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

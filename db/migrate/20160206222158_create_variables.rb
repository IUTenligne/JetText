class CreateVariables < ActiveRecord::Migration
  def change
    create_table :variables do |t|
      t.string :name
      t.integer :value
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

class CreateVersions < ActiveRecord::Migration
  def change
    create_table :versions do |t|
      t.references :container, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
class CreateFormulas < ActiveRecord::Migration
  def change
    create_table :formulas do |t|
      t.string :name
      t.string :value
      t.references :user, index: true, foreign_key: true
    end
  end
end

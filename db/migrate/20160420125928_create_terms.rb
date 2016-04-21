class CreateTerms < ActiveRecord::Migration
  def change
    create_table :terms do |t|
      t.string :name
      t.text :description
      t.references :glossary, index: true, foreign_key: true
    end
  end
end

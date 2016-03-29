class CreateJoinTablePagesGlossaries < ActiveRecord::Migration
  def change
  	create_join_table :pages, :glossaries do |t|
      t.index [:page_id, :glossary_id]
      t.index [:glossary_id, :page_id]
    end
  end
end

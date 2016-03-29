class CreateJoinTable < ActiveRecord::Migration
  def change
    create_join_table :pages, :variables do |t|
      t.index [:page_id, :variable_id]
      t.index [:variable_id, :page_id]
    end
  end
end

class CreateJoinTableContainerTerm < ActiveRecord::Migration
  def change
    	create_join_table :containers, :terms do |t|
      	t.index [:container_id, :term_id]
      	t.index [:term_id, :container_id]
    end
    	add_index :containerTerm, :term_id
    	add_index :containerTerm, :container_id
    	add_index :containerTerm, [:term_id, :container_id], unique: true
  end
end

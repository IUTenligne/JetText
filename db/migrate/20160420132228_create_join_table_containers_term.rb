class CreateJoinTableContainersTerm < ActiveRecord::Migration
	 def change
    		create_join_table :containers, :terms do |t|
      		t.index [:container_id, :term_id]
      		t.index [:term_id, :container_id]
	    end
	 end
end

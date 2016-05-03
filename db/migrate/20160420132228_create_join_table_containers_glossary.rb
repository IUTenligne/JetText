class CreateJoinTableContainersGlossary < ActiveRecord::Migration
	 def change
    		create_join_table :containers, :glossaries do |t|
      		t.index [:container_id, :glossary_id]
      		t.index [:glossary_id, :container_id]
	    end
	 end
end

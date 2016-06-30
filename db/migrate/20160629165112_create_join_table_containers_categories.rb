class CreateJoinTableContainersCategories < ActiveRecord::Migration
  def change
    create_join_table :containers, :categories do |t|
      t.index [:container_id, :category_id]
      t.index [:category_id, :container_id]
    end
  end
end

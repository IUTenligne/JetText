class CreateJoinTableContainersCategories < ActiveRecord::Migration
  def change
    create_join_table :categories, :containers do |t|
      t.index [:category_id, :container_id]
      t.index [:container_id, :category_id]
    end
  end
end

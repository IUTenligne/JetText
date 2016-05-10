class CreateJoinTableContainersFormula < ActiveRecord::Migration
  def change
    create_join_table :containers, :formulas do |t|
      t.index [:container_id, :formula_id]
      t.index [:formula_id, :container_id]
    end
  end
end

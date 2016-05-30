class CreateJoinTableCompaniesContainers < ActiveRecord::Migration
  def change
  	create_join_table :companies, :containers do |t|
      t.index [:company_id, :container_id]
      t.index [:container_id, :company_id]
    end
  end
end

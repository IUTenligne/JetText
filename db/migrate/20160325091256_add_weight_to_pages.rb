class AddWeightToPages < ActiveRecord::Migration
  def change
    add_column :pages, :weight, :integer
  end
end

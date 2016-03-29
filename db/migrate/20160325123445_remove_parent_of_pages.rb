class RemoveParentOfPages < ActiveRecord::Migration
  def change
  	remove_column :pages, :parent
  end
end

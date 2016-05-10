class Formula < ActiveRecord::Base

  has_and_belongs_to_many :containers, :through => :containers_formula

end

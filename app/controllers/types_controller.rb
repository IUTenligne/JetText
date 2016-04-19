class TypesController < ApplicationController

	def index
		@types = Type.all.select('id, name')
		respond_to do |format|
      format.json { render json: { types: @types } }
    end
	end

end	

# == Schema Information
#
# Table name: types
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TypesController < ApplicationController

	def index
		@types = Type.all.select('id, name')
		respond_to do |format|
      format.json { render json: { types: @types } }
    end
	end

end	
class CategoriesController < ApplicationController

  def index
    render json: Category.select("id, name").all
  end

end

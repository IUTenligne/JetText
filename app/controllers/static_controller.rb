class StaticController < ApplicationController
    def about
      render template: "static/about"
    end
end

Rails.application.routes.draw do

  root 'home#index'

  devise_for :users, :controllers => {
    :registrations => "registrations",
    :omniauth_callbacks => "users/omniauth_callbacks"
  }

  authenticate :user do
    resources :containers do
      put "/validate/:id" => "containers#validate", on: :collection
      post "/send_update/:id" => "containers#send_update", on: :collection
      put "/delete/:id" => "containers#delete", on: :collection
      put "/delstroy/:id" => "containers#destroy", on: :collection
    end

    resources :pages do
      put :sort, on: :collection
      put :levelize, on: :collection
      put :update_level, on: :collection
      post "/delete/:id" => "pages#destroy", on: :collection
    end

    resources :blocks do
      put "/set_content/:id" => "blocks#set_content", on: :collection
      put "/update_upload" => "blocks#update_upload", on: :collection
      put "/update_classes" => "blocks#update_classes", on: :collection
      post "/export" => "blocks#export", on: :collection
      put :sort, on: :collection
    end

    resources :types

    resources :variables

    resources :uploads do
      delete "/clear/:block_id" => "uploads#clear", on: :collection
      get "/search/:name" => "uploads#search", on: :collection
      get "/filter/:type" => "uploads#filter_types", on: :collection
    end
    get "/files" => "uploads#index"

    resources :glossaries do
      get "/box/:id"=> "glossaries#glossaries_box", on: :collection
    end

    resources :terms

    get "/containers_glossaries/:container_id" => "containers_glossaries#show"
    post "/containers_glossaries" => "containers_glossaries#check"

    resources :formulas
    get "/search_variables" => "formulas#find"

    resources :generator
    get "/generator/overview/:id" => "generator#container"
    get "/generator/overview/pages/:id" => "generator#page"
    get "/generator/pages/:id" => "generator#page_generation"
    get "/generator/save/:id" => "generator#save"
    get "/generator/diffs/:id" => "generator#diffs"

    get "/users/my" => "users#my"
  end

  # Admin zone access
  authenticate :user, -> (u) { u.is_admin? } do
    resources :companies
    get "/users" => "users#index"
    put "/users/validate/:id" => "users#validate"
    put "/users/update_role/:id" => "users#update_role"
    resources :versions
    get "/versions/show_all/:id" => "versions#show_all"
  end

  # Expert zone access
  authenticate :user, -> (u) { u.is_expert? } do
    resources :companies
    resources :versions
    get "/versions/show_all/:id" => "versions#show_all"
  end

end

Rails.application.routes.draw do

  root 'home#index'
  devise_for :users, :controllers => { :registrations => 'registrations' }

  authenticate :user do
    resources :containers
    resources :pages do
      put :sort, on: :collection
      put :levelize, on: :collection
      put :update_level, on: :collection
      post "/delete/:id" => "pages#destroy", on: :collection
    end
    resources :blocks do
      put "/set_content/:id" => "blocks#set_content", on: :collection
      put "/update_upload" => "blocks#update_upload", on: :collection
      put :sort, on: :collection
    end
    resources :types
    resources :variables
    resources :uploads do
      delete "/clear/:block_id" => "uploads#clear", on: :collection
    end
    resources :glossaries do
      get "/box/:id"=> "glossaries#glossaries_box", on: :collection
    end
    resources :terms
    get "/generate_container/:id" => "containers#generate", as: 'generate_container'
    get "/containers_glossaries/:container_id" => "containers_glossaries#show"
    post "/containers_glossaries" => "containers_glossaries#check"
    resources :formulas
    
    resources :generator
    get "/generator/overview/:id" => "generator#container"
    get "/generator/overview/page/:id" => "generator#page"
    get "/generator/page/:id" => "generator#page_generation"
    get "/generator/save/:id" => "generator#save"
  end

end

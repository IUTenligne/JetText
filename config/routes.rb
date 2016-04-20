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
    end
    resources :types
    resources :variables
    resources :uploads do
      delete "/clear/:block_id" => "uploads#clear", on: :collection
    end
    resources :glossaries
    get "/generate_container/:id" => "containers#generate", as: 'generate_container'
  end
  
end
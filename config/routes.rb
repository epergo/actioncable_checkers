Rails.application.routes.draw do
  resources :matches
  resources :users, only: [:index, :create, :destroy]

  root 'matches#index'
end

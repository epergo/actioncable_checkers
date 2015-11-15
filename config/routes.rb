Rails.application.routes.draw do
  resources :matches
  resources :users, only: [:index, :create]

  root 'matches#index'
end

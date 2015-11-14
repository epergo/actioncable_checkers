Rails.application.routes.draw do
  resources :matches
  resources :users, only: [:index]

  root 'users#index'
end

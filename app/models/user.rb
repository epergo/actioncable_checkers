class User < ActiveRecord::Base
  has_many :matches
  has_one :opponent, class_name: 'User'
end
